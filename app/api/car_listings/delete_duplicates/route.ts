// delete_duplicates
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

/*
Route for deleting duplicate car listings based on their URL.
*/

export async function DELETE() {
  // Get the latest car listings grouped by URL
  const latestListings = await prisma.carListing.groupBy({
    by: ["url"],
    _max: {
      id: true,
      scrapedAt: true,
    },
    _count: {
      id: true,
    },
  });

  // eslint-disable-next-line
  const latestListingsIds = latestListings.map(item => item._max.id).filter((id): id is string => id !== null);

  // Get duplicate car listings that are not in the latest listings
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

  // Delete images associated with the duplicate car listings
  await prisma.image.deleteMany({
    where: {
      listingId: {
        in: duplicatesIds,
      },
    },
  });

  // Delete the duplicate car listings
  const deletedDuplicates = await prisma.carListing.deleteMany({
    where: {
      id: {
        in: duplicatesIds,
      },
    },
  });

  return NextResponse.json({ deletedDuplicates });
}
