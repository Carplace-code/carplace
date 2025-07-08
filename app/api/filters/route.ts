// app/api/filters/route.ts
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const where = body.where as Prisma.VersionWhereInput;

    const versions = await prisma.version.findMany({
      where,
      select: {
        year: true,
        model: {
          select: {
            name: true,
            bodyType: true,
            brand: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const brands = Array.from(new Set(versions.map((v) => v.model.brand.name))).sort((a, b) => a.localeCompare(b));
    const models = Array.from(new Set(versions.map((v) => v.model.name))).sort((a, b) => a.localeCompare(b));
    const years = Array.from(new Set(versions.map((v) => v.year))).sort((a, b) => b - a); // Descendente por utilidad
    const bodyTypes = Array.from(new Set(versions.map((v) => v.model.bodyType).filter(Boolean))).sort((a, b) =>
      (a as string).localeCompare(b as string),
    );

    return NextResponse.json({ brands, models, years, bodyTypes });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch available filters" }, { status: 500 });
  }
}
