import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

/*
Ruta para eliminar publicaciones duplicadas por url
*/

export async function DELETE() {
  // Obtener los registros con url repetido más recientes
  const latestListings = await prisma.carListing.groupBy({
    by: ["url"],
    _max: {
      id: true,
      scrapedAt: true,
    },
  });

  // eslint-disable-next-line
  const latestListingsIds = latestListings.map(item => item._max.id).filter((id): id is string => id !== null);

  // Obtener los registros duplicados
  const duplicates = await prisma.carListing.findMany({
    where: {
      id: {
        notIn: latestListingsIds,
      },
    },
    select: {
      id: true,
    },
  });

  const duplicatesIds = duplicates.map((item) => item.id).filter((id): id is string => id !== null);

  // Eliminar imágenes asociadas a los duplicados
  await prisma.image.deleteMany({
    where: {
      listingId: {
        in: duplicatesIds,
      },
    },
  });

  // Eliminar los carListing duplicados
  const deletedDuplicates = await prisma.carListing.deleteMany({
    where: {
      id: {
        in: duplicatesIds,
      },
    },
  });

  return NextResponse.json({ deletedDuplicates });
}
