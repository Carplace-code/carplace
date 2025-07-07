// app/api/wishlists/route.ts
import { auth } from "@clerk/nextjs/server";
import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) throw new Error("userId should not be null, if null it could mean middleware is not set up correctly");

  const { searchParams } = request.nextUrl;
  const includeParam = searchParams.get("include");
  const include = includeParam ? (JSON.parse(includeParam) as Prisma.WishlistInclude) : undefined;
  const versionId = request.nextUrl.searchParams.get("versionId");

  const wishlists = versionId
    ? await prisma.wishlist.findMany({
        where: {
          clerkUserId: userId,
          items: { some: { versionId } },
        },
        include,
      })
    : await prisma.wishlist.findMany({
        where: {
          clerkUserId: userId,
        },
        include,
      });

  return NextResponse.json(wishlists);
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) throw new Error("userId should not be null, if null it could mean middleware is not set up correctly");

  const { name, description } = await request.json();
  const wishlist = await prisma.wishlist.create({
    data: {
      name,
      description,
      clerkUserId: userId,
    },
  });

  return NextResponse.json(wishlist, { status: 201 });
}
