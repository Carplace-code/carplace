import { NextResponse } from "next/server";

import prisma from "@../../lib/prisma";

/*
Ruta para eliminar poublicaciones antiguas.
Es un get porque eso especificaba la docu de los crons en vercel:
https://vercel.com/docs/cron-jobs/quickstart
*/

export async function GET() {
  try {
    // Obtenemos fecha de hace un mes atrás
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // Eliminamos las imágenes asociadas a los listings
    await prisma.image.deleteMany({
      where: {
        carListing: {
          scrapedAt: {
            lt: oneMonthAgo,
          },
        },
      },
    });

    // Eliminamos los carListings
    const deletedOldListings = await prisma.carListing.deleteMany({
      where: {
        scrapedAt: {
          lt: oneMonthAgo,
        },
      },
    });
    return NextResponse.json({ deletedOldListings, status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "Error deleting old listings" }, { status: 400 });
  }
}
