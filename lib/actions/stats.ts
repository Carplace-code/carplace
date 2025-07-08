"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getCarListingsStats() {
  try {
    const [totalListings, totalBrands, recentListings] = await Promise.all([
      // Total de autos disponibles
      prisma.carListing.count(),

      // Total de marcas únicas
      prisma.brand.count(),

      // Autos agregados en las últimas 24 horas
      prisma.carListing.count({
        where: {
          scrapedAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Últimas 24 horas
          },
        },
      }),
    ]);

    return {
      totalListings,
      totalBrands,
      recentListings,
      success: true,
    };
  } catch (error) {
    return {
      totalListings: 0,
      totalBrands: 0,
      recentListings: 0,
      success: false,
    };
  } finally {
    await prisma.$disconnect();
  }
}
