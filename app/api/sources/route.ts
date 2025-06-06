import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const sources = await prisma.source.findMany();
    return NextResponse.json(sources, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "" }, { status: 500 });
  }
}
