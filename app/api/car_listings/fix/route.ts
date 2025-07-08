/* eslint-disable */

import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function POST() {
  try {
    const listings = await prisma.carListing.findMany({
      include: { priceHistory: true },
    });

    const listingsByUrl = listings.reduce(
      (map, listing) => {
        if (!map[listing.url]) map[listing.url] = [];
        map[listing.url].push(listing);
        return map;
      },
      {} as Record<string, typeof listings>,
    );

    const urls = Object.entries(listingsByUrl);

    for (let i = 0; i < urls.length; i++) {
      const [url, group] = urls[i];
      console.log(`\n[${i + 1}/${urls.length}] Procesando URL: ${url}`);

      if (group.length === 0) continue;

      for (const listing of group) {
        const hasCurrentPrice = listing.priceHistory.some((ph) => Number(ph.price) === Number(listing.price));

        if (!hasCurrentPrice) {
          await prisma.priceHistory.create({
            data: {
              listingId: listing.id,
              price: listing.price,
              priceCurrency: listing.priceCurrency,
              recordedAt: listing.scrapedAt,
            },
          });
          console.log(`  → Añadido priceHistory al listing ${listing.id}`);
        }
      }

      if (group.length <= 1) continue;

      const [main, ...duplicates] = [...group].sort((a, b) => b.scrapedAt.getTime() - a.scrapedAt.getTime());

      for (const dup of duplicates) {
        const samePriceExists = await prisma.priceHistory.findFirst({
          where: {
            listingId: main.id,
            price: dup.price,
          },
        });

        if (!samePriceExists) {
          await prisma.priceHistory.create({
            data: {
              listingId: main.id,
              price: dup.price,
              priceCurrency: dup.priceCurrency,
              recordedAt: dup.scrapedAt,
            },
          });
          console.log(`  → Merged price ${dup.price} from ${dup.id} into ${main.id}`);
        }

        await prisma.image.updateMany({
          where: { listingId: dup.id },
          data: { listingId: main.id },
        });

        await prisma.priceHistory.deleteMany({
          where: { listingId: dup.id },
        });

        await prisma.carListing.delete({
          where: { id: dup.id },
        });

        console.log(`  → Duplicado eliminado: ${dup.id}`);
      }
    }

    console.log("\n✅ Proceso de deduplicación y normalización terminado");
    return NextResponse.json({ message: "Listings fixed and deduplicated (sequentially)" }, { status: 200 });
  } catch (err) {
    console.error("❌ Error fixing listings:", err);
    return NextResponse.json({ error: "Failed to fix listings" }, { status: 500 });
  }
}
