/* eslint-disable */

import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

// ===== GET handler =====
export async function GET(_req: NextRequest, context: any) {
  try {
    const { versionId } = context.params;

    // 1. Verificar que exista la versión y obtener modelId + year
    const version = await prisma.version.findUnique({
      where: { id: versionId },
      select: {
        id: true,
        year: true,
        modelId: true,
        model: {
          select: {
            id: true,
            name: true,
            brand: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!version) {
      return NextResponse.json({ error: "Version not found" }, { status: 404 });
    }

    // 2. Buscar todos los carListings que tengan trims de esa misma versión
    const listings = await prisma.carListing.findMany({
      where: {
        trim: {
          version: {
            modelId: version.modelId,
            year: version.year,
          },
        },
      },
      include: {
        trim: {
          include: {
            version: {
              include: {
                model: {
                  include: {
                    brand: true,
                  },
                },
              },
            },
          },
        },
        priceHistory: true,
        images: true,
        seller: true,
        source: true,
      },
      orderBy: {
        scrapedAt: "desc",
      },
    });

    return NextResponse.json(
      {
        brand: version.model.brand.name,
        model: version.model.name,
        year: version.year,
        listings,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in /by-version/[versionId]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
