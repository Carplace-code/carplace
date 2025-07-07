/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function POST(request: NextRequest, context: any) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("userId should not be null, if null it could mean middleware is not set up correctly");
  }

  const { versionId } = await request.json();

  await prisma.wishlistItem.create({
    data: {
      wishlistId: context.params.id,
      versionId,
    },
  });

  return NextResponse.json({}, { status: 201 });
}
