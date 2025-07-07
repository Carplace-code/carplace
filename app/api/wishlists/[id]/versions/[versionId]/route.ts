/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function DELETE(request: NextRequest, context: any) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("userId should not be null, if null it could mean middleware is not set up correctly");
  }

  const { id: wishlistId, versionId } = context.params;
  if (!wishlistId || !versionId) {
    return NextResponse.json({ error: "Invalid request parameters" }, { status: 400 });
  }

  const removedVersionsFromWishlist = await prisma.wishlistItem.deleteMany({
    where: {
      wishlistId,
      versionId,
      wishlist: {
        clerkUserId: userId,
      },
    },
  });

  if (removedVersionsFromWishlist.count === 0) {
    return NextResponse.json({ error: "Item not found in wishlist" }, { status: 404 });
  }

  return NextResponse.json({}, { status: 200 });
}
