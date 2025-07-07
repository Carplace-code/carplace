// cron/delete_old_listings
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

/*
Route for deleting car listings and associated images older than one month.
This is a cron job that runs periodically to clean up old data.
This route is intended to be used with Vercel's Cron Jobs feature.
(more info: https://vercel.com/docs/cron-jobs)
*/

export async function GET() {
  try {
    // Get the date one month ago
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // Delete images associated with car listings older than one month
    await prisma.image.deleteMany({
      where: {
        carListing: {
          scrapedAt: {
            lt: oneMonthAgo,
          },
        },
      },
    });

    // Delete car listings older than one month
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
