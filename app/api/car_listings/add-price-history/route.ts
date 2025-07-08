/* eslint-disable */

import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { listingId, entries } = body;

    if (!listingId || !Array.isArray(entries)) {
      return NextResponse.json({ error: "Missing or invalid 'listingId' or 'entries'" }, { status: 400 });
    }

    const listing = await prisma.carListing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const priceHistoryData = entries.map((entry) => {
      const { price, recordedAt, priceCurrency } = entry;

      if (typeof price !== "number" || !recordedAt || isNaN(new Date(recordedAt).getTime())) {
        throw new Error("Invalid priceHistory entry");
      }

      return {
        listingId,
        price,
        priceCurrency: priceCurrency || listing.priceCurrency,
        recordedAt: new Date(recordedAt),
      };
    });

    const created = await prisma.priceHistory.createMany({
      data: priceHistoryData,
    });

    return NextResponse.json({ message: `Added ${created.count} price history record(s)` }, { status: 201 });
  } catch (err) {
    console.error("Error adding price history:", err);
    return NextResponse.json({ error: "Failed to add price history" }, { status: 500 });
  }
}
