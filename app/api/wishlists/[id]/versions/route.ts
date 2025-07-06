import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) throw new Error("userId should not be null, if null it could mean middleware is not set up correctly");

  const { versionId } = await request.json();

  await prisma.wishlistItem.create({
    data: {
      wishlistId: params.id,
      versionId,
    },
  });

  return NextResponse.json({}, { status: 201 });
}
