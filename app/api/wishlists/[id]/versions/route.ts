import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

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
