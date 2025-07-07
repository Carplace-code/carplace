import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const models = await prisma.model.findMany({
      include: {
        brand: true,
      },
    });

    const brandModelsMap = models.reduce<Record<string, string[]>>((acc, model) => {
      const brandName = model.brand.name;
      if (!acc[brandName]) acc[brandName] = [];
      acc[brandName].push(model.name);
      return acc;
    }, {});

    return NextResponse.json(brandModelsMap, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error loading brand-models map" }, { status: 500 });
  }
}
