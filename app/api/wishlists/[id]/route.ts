import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) throw new Error("userId should not be null");

  const wishlist = await prisma.wishlist.findUnique({
    where: { id: context.params.id, clerkUserId: userId },
  });

  if (!wishlist) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(wishlist);
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) throw new Error("userId should not be null");

  const deletedWishlists = await prisma.wishlist.deleteMany({
    where: {
      id: context.params.id,
      clerkUserId: userId,
    },
  });

  if (deletedWishlists.count === 0) {
    return NextResponse.json({ error: "Wishlist not found" }, { status: 404 });
  }

  return NextResponse.json({}, { status: 200 });
}

export async function PATCH(request: NextRequest, context: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) throw new Error("userId should not be null");

  const newData = await request.json();

  const wishlist = await prisma.wishlist.update({
    where: { id: context.params.id },
    data: newData,
  });

  return NextResponse.json(wishlist);
}
