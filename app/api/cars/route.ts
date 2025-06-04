import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const carListings = await prisma.carListing.findMany();
    return NextResponse.json(carListings, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    const {
      brand,
      model,
      year,
      km,
      version,
      transmission,
      price_actual: priceActual,
      // price_original: priceOriginal,
      location,
      fuel_type: fuelType,
      post_url: carUrl,
      img_url: imgUrl,
      data_source: dataSource, // plataforma de orígen
      published_at: publishedAt,
      scraped_at: scrapedAt,
    } = data;

    // 1. Crear seller vacío (no tenemos la info del vendedor)
    const carSeller = await prisma.seller.create({
      data: {
        name: "placeholder",
        email: "placeholder@email.com",
        phone: "000000",
        type: "null",
      },
    });

    // 2. Buscar o crear Source
    const source = await prisma.source.findFirst({
      where: { name: dataSource },
    });

    // name: baseUrl
    // fb_mkt: https://www.facebook.com/marketplace/
    // kavak: https://www.kavak.com/cl
    // yapo: https://public-api.yapo.cl/
    if (!source) {
      return NextResponse.json({ error: "Invalid source url" }, { status: 400 });
    }

    // 3. Buscar o crear Brand
    let carBrand = await prisma.brand.findFirst({
      where: { name: brand },
    });

    if (!carBrand) {
      carBrand = await prisma.brand.create({
        data: { name: brand },
      });
    }

    // 4. Buscar o crear Model
    let carModel = await prisma.model.findFirst({
      where: {
        name: brand,
        brandId: carBrand.id,
      },
    });

    if (!carModel) {
      carModel = await prisma.model.create({
        data: {
          name: model,
          bodyType: "null", // no esta todavia en la data
          brandId: carBrand.id,
        },
      });
    }

    // 5. Buscar o crear Version
    let carVersion = await prisma.version.findFirst({
      where: {
        modelId: carModel.id,
      },
    });
    if (!carVersion && version) {
      carVersion = await prisma.version.create({
        data: {
          versionName: version, // si no viene la version
          year,
          modelId: carModel.id,
        },
      });
    } else if (!carVersion && !version) {
      carVersion = await prisma.version.create({
        // caso contrario creamos una versión vacía
        data: {
          versionName: "null",
          year: -1,
          modelId: carModel.id,
        },
      });
    }
    // 6. Crear Trim
    const nameArray: string[] = [brand, model, year];
    const trim = await prisma.trim.create({
      data: {
        versionId: carVersion.id,
        name: nameArray.join(" "),
        motorSize: -1, // no esta todavia en la data
        fuelType,
        transmissionType: transmission,
      },
    });

    // 7. Crear publiacición
    const carListing = await prisma.carListing.create({
      data: {
        sellerId: carSeller.id,
        sourceId: source.id,
        url: carUrl,
        title: nameArray.join(" "),
        description: "null", // no esta todavia en la data
        price: priceActual,
        priceCurrency: "CLP",
        trimId: trim.id,
        year,
        mileage: km,
        exteriorColor: "null", // no esta todavia en la data
        interiorColor: "null", // no esta todavia en la data
        isNew: false, // no esta todavia en la data
        location,
        publishedAt,
        scrapedAt,
      },
    });
    // 8. Crear imágen
    await prisma.image.create({
      data: {
        listingId: carListing.id,
        url: imgUrl,
      },
    });
    return NextResponse.json(carListing);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
