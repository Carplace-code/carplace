// app/api/versions/route.ts
import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    // parse params
    const includeParam = searchParams.get("include");
    const whereParam = searchParams.get("where");
    const orderByParam = searchParams.get("orderBy");
    const pageParam = searchParams.get("page");
    const pageSizeParam = searchParams.get("pageSize");

    const include = includeParam ? (JSON.parse(includeParam) as Prisma.VersionInclude) : undefined;
    const where = whereParam ? (JSON.parse(whereParam) as Prisma.VersionWhereInput) : undefined;
    const orderBy = orderByParam ? (JSON.parse(orderByParam) as Prisma.VersionOrderByWithRelationInput) : undefined;
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : 100;
    const skip = pageSize && page ? (page - 1) * pageSize : undefined;

    // Fetch
    const total = await prisma.version.count({ where });
    const data = await prisma.version.findMany({ where, include, orderBy, take: pageSize, skip });

    // Return
    return NextResponse.json({
      data,
      meta: {
        total,
        page,
        pageSize,
        pageCount: pageSize ? Math.ceil(total / pageSize) : 1,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch versions" }, { status: 500 });
  }
}
