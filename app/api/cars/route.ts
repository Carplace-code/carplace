import { FuelType, Prisma, TransmissionType } from "@prisma/client";
import { NextResponse } from "next/server";

import prisma from "@../../lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const take = parseInt(searchParams.get("take") || "8", 10);
  const skip = (page - 1) * take;

  const brandId = searchParams.get("brandId");
  const modelId = searchParams.get("modelId");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const transmission = searchParams.get("transmission");
  const fuel = searchParams.get("fuel");

  const where: Prisma.CarListingWhereInput = {};

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }

  if (modelId) {
    where.trim = {
      version: {
        modelId,
      },
    };
  } else if (brandId) {
    where.trim = {
      version: {
        model: {
          brandId,
        },
      },
    };
  }

  if (transmission) {
    if (!where.trim) where.trim = {};
    (where.trim as Prisma.TrimWhereInput).transmissionType = transmission as
      | Prisma.EnumTransmissionTypeFilter
      | undefined;
  }

  if (fuel) {
    if (!where.trim) where.trim = {};
    (where.trim as Prisma.TrimWhereInput).fuelType = fuel as Prisma.EnumFuelTypeFilter | undefined;
  }

  const [listings, total] = await Promise.all([
    prisma.carListing.findMany({
      where,
      skip,
      take,
      include: {
        seller: true,
        images: true,
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
      },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.carListing.count({ where }),
  ]);

  return NextResponse.json({ listings, total });
}

export async function POST(request: Request) {
  try {
    let data;
    try {
      data = await request.json();
    } catch (e) {
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

    // Validar enums y tipos
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

    // Buscar si ya existe un CarListing con el mismo URL
    const existingListing = await prisma.carListing.findFirst({ where: { url: postUrl } });
    if (existingListing) {
      // Actualizar solo el precio y fecha scrapedAt
      const updated = await prisma.carListing.update({
        where: { id: existingListing.id },
        data: {
          price: priceActual,
          scrapedAt: scrapedAt ? new Date(scrapedAt) : new Date(),
        },
      });
      // Opcional: guardar historial de precios
      await prisma.priceHistory.create({
        data: {
          price: priceActual,
          priceCurrency: "CLP",
          recordedAt: new Date(),
          listingId: existingListing.id,
        },
      });
      return NextResponse.json({ updatedListing: updated }, { status: 200 });
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

    // 5. Buscar o crear Version (por modelo y año)
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

    // 6. Buscar o crear Trim (name puede ser version o algo generado)
    const trimName = version ?? `${brand}-${model}-${year}`;
    let trim = await prisma.trim.findFirst({
      where: {
        name: trimName,
        versionId: carVersion.id,
      },
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

    // 7. Crear CarListing
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

    if (typeof priceOriginal === "number" && priceOriginal > 0) {
      await prisma.priceHistory.create({
        data: {
          price: priceOriginal,
          priceCurrency: "CLP",
          recordedAt: new Date(),
          listingId: carListing.id,
        },
      });
    }

    // 8. Crear Imagen si viene
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
