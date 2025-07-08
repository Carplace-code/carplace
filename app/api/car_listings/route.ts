/* eslint-disable */

import { FuelType, Prisma, TransmissionType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

// ===== GET handler =====
export async function GET(request: NextRequest | Request) {
  try {
    const url = "nextUrl" in request ? request.nextUrl : new URL((request as Request).url);

    const includeParam = url.searchParams.get("include");
    const pageSizeParam = url.searchParams.get("pageSize");
    const orderByParam = url.searchParams.get("orderBy");

    let include: Prisma.CarListingInclude | undefined;

    if (includeParam === "full") {
      include = {
        trim: {
          include: {
            version: {
              include: {
                model: {
                  include: {
                    brand: true,
                  },
                },
              },
            },
          },
        },
        priceHistory: true,
        images: true,
        seller: true,
        source: true,
      };
    } else if (includeParam) {
      try {
        include = JSON.parse(includeParam) as Prisma.CarListingInclude;
      } catch {
        return NextResponse.json({ error: "Invalid include JSON" }, { status: 400 });
      }
    }

    let orderBy: Prisma.CarListingOrderByWithRelationInput | undefined;
    if (orderByParam) {
      try {
        orderBy = JSON.parse(orderByParam) as Prisma.CarListingOrderByWithRelationInput;
      } catch {
        return NextResponse.json({ error: "Invalid orderBy JSON" }, { status: 400 });
      }
    } else {
      orderBy = { scrapedAt: "desc" };
    }

    const listings = await prisma.carListing.findMany({
      include,
      take: pageSizeParam ? parseInt(pageSizeParam, 10) : 100,
      orderBy,
    });

    return NextResponse.json(listings, { status: 200 });
  } catch (err) {
    console.error("Error fetching car listings:", err);
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 });
  }
}

// ===== POST handler =====
export async function POST(request: Request) {
  try {
    let data;
    try {
      data = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid or missing JSON body" }, { status: 400 });
    }

    const {
      brand,
      model,
      year,
      km,
      version,
      transmission,
      priceActual,
      priceOriginal,
      location,
      fuelType,
      postUrl,
      imgUrl,
      dataSource,
      publishedAt,
      scrapedAt,
    } = data;

    // Validaciones básicas
    if (!brand || !model || !year || !priceActual || !location || !postUrl || !dataSource) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (
      typeof priceActual !== "number" ||
      typeof priceOriginal !== "number" ||
      typeof km !== "number" ||
      typeof year !== "number"
    ) {
      return NextResponse.json({ error: "Invalid type for numeric fields" }, { status: 400 });
    }

    if (priceActual < 0 || priceOriginal < 0) {
      return NextResponse.json({ error: "Negative price" }, { status: 400 });
    }

    if (km < 0) {
      return NextResponse.json({ error: "Negative mileage" }, { status: 400 });
    }

    if (year < 1886) {
      return NextResponse.json({ error: "The car was invented in 1886" }, { status: 400 });
    }

    // Validar enums
    const allowedFuelTypes = ["gas", "diesel", "electricity", "hybrid", "other"];
    const allowedTransmissions = ["automatic", "manual", "other"];

    if (typeof fuelType !== "string") {
      return NextResponse.json({ error: "Invalid fuelType: must be a string" }, { status: 400 });
    }

    if (typeof transmission !== "string") {
      return NextResponse.json({ error: "Invalid transmission: must be a string" }, { status: 400 });
    }

    const normalizedFuelType = fuelType.toLowerCase();
    const normalizedTransmission = transmission.toLowerCase();

    if (!allowedFuelTypes.includes(normalizedFuelType)) {
      return NextResponse.json({ error: `Invalid fuelType. Allowed: ${allowedFuelTypes.join(", ")}` }, { status: 400 });
    }

    if (!allowedTransmissions.includes(normalizedTransmission)) {
      return NextResponse.json(
        { error: `Invalid transmission. Allowed: ${allowedTransmissions.join(", ")}` },
        { status: 400 },
      );
    }

    // 1. Crear seller placeholder
    const carSeller = await prisma.seller.create({
      data: {
        name: "placeholder",
        email: `placeholder+${Date.now()}@email.com`,
        phone: "000000",
        type: "null",
      },
    });

    // 2. Buscar o crear Source
    const sources = [
      ["yapo", "https://public-api.yapo.cl/"],
      ["fb_mkt", "https://www.facebook.com/marketplace/"],
      ["kavak", "https://www.kavak.com/cl"],
    ];
    let source = await prisma.source.findFirst({ where: { name: dataSource } });

    if (!source) {
      const found = sources.find(([name]) => name === dataSource);
      if (!found) {
        return NextResponse.json({ error: "Invalid source" }, { status: 400 });
      }
      const [name, baseUrl] = found;
      source = await prisma.source.create({ data: { name, baseUrl } });
    }

    // 3. Buscar o crear Brand
    let carBrand = await prisma.brand.findFirst({ where: { name: brand } });
    if (!carBrand) {
      carBrand = await prisma.brand.create({ data: { name: brand } });
    }

    // 4. Buscar o crear Model
    let carModel = await prisma.model.findFirst({
      where: { name: model, brandId: carBrand.id },
    });
    if (!carModel) {
      carModel = await prisma.model.create({
        data: {
          name: model,
          bodyType: "other",
          brandId: carBrand.id,
        },
      });
    }

    // 5. Buscar o crear Version
    let carVersion = await prisma.version.findFirst({
      where: { modelId: carModel.id, year },
    });
    if (!carVersion) {
      carVersion = await prisma.version.create({
        data: {
          modelId: carModel.id,
          year,
        },
      });
    }

    // 6. Buscar o crear Trim
    const trimName = version ?? `${brand}-${model}-${year}`;
    let trim = await prisma.trim.findFirst({
      where: { name: trimName, versionId: carVersion.id },
    });

    if (!trim) {
      trim = await prisma.trim.create({
        data: {
          name: trimName,
          motorSize: -1,
          fuelType: normalizedFuelType as FuelType,
          transmissionType: normalizedTransmission as TransmissionType,
          versionId: carVersion.id,
        },
      });
    }

    // 7. Verificar si ya existe el listing
    const existingListing = await prisma.carListing.findFirst({
      where: { url: postUrl },
      include: { trim: true },
    });

    if (existingListing) {
      const updates: Prisma.CarListingUpdateInput = {
        scrapedAt: scrapedAt ? new Date(scrapedAt) : new Date(),
      };

      let hasChanges = false;

      if (Number(existingListing.price) !== priceActual) {
        updates.price = priceActual;
        hasChanges = true;

        await prisma.priceHistory.create({
          data: {
            listingId: existingListing.id,
            price: priceActual,
            priceCurrency: existingListing.priceCurrency,
            recordedAt: new Date(),
          },
        });
      }

      if (km > existingListing.mileage) {
        updates.mileage = km;
        hasChanges = true;
      }

      if (location !== existingListing.location) {
        updates.location = location;
        hasChanges = true;
      }

      const newPublishedAt = publishedAt ? new Date(publishedAt) : null;
      if (newPublishedAt && existingListing.publishedAt.getTime() !== newPublishedAt.getTime()) {
        updates.publishedAt = newPublishedAt;
        hasChanges = true;
      }

      if (hasChanges) {
        const updated = await prisma.carListing.update({
          where: { id: existingListing.id },
          data: updates,
        });

        return NextResponse.json({ updatedListing: updated }, { status: 200 });
      }

      // Solo actualizar scrapedAt si nada más cambió
      await prisma.carListing.update({
        where: { id: existingListing.id },
        data: { scrapedAt: updates.scrapedAt },
      });

      return NextResponse.json({ message: "Listing unchanged" }, { status: 200 });
    }

    // 8. Crear nuevo listing
    const carListing = await prisma.carListing.create({
      data: {
        sellerId: carSeller.id,
        sourceId: source.id,
        url: postUrl,
        title: `${brand} ${model} ${version || ""}`.trim(),
        description: "null",
        price: priceActual,
        priceCurrency: "CLP",
        trimId: trim.id,
        year,
        mileage: km,
        exteriorColor: "null",
        interiorColor: "null",
        isNew: false,
        location,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
        scrapedAt: scrapedAt ? new Date(scrapedAt) : new Date(),
      },
    });

    await prisma.priceHistory.create({
      data: {
        listingId: carListing.id,
        price: priceActual,
        priceCurrency: "CLP",
        recordedAt: new Date(),
      },
    });

    if (imgUrl) {
      await prisma.image.create({
        data: {
          listingId: carListing.id,
          url: imgUrl,
        },
      });
    }

    return NextResponse.json({ newListing: carListing }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
