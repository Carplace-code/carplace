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
    const { brand } = data;
    const { model } = data;
    const { year } = data;
    const { km } = data;
    const { version } = data;
    const { transmission } = data;
    const priceActual = data.price_actual;
    const { location } = data;

    const platform = "kavak";
    const platformUrl = "https://www.kavak.com/cl/usados";
    const carUrl = "null"; // va a venir del scraper

    if (!data) {
      return NextResponse.json({ error: "" }, { status: 400 });
    }

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
    let source = await prisma.source.findFirst({
      where: { name: platform },
    });

    if (!source) {
      source = await prisma.source.create({
        data: { baseUrl: platformUrl, name: platform },
      });
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

    // 4. Crear Model
    const carModel = await prisma.model.create({
      data: {
        name: model,
        bodyType: "null", // no esta todavia en la data
        brandId: carBrand.id,
      },
    });

    // 5. Crear Version
    const carVersion = await prisma.version.create({
      data: {
        versionName: version,
        year,
        modelId: carModel.id,
      },
    });

    // 6. Crear Trim
    const nameArray: string[] = [brand, model, year];
    const trim = await prisma.trim.create({
      data: {
        versionId: carVersion.id,
        name: nameArray.join(" "),
        motorSize: -1, // no esta todavia en la data
        fuelType: "null", // no esta todavia en la data
        transmissionType: transmission,
      },
    });
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
        isNew: false,
        location,
        publishedAt: new Date(), // no esta todavia en la data
        scrapedAt: new Date(), // no esta todavia en la data
      },
    });
    return NextResponse.json(carListing);
  } catch (error) {
    return NextResponse.json({ error: "" }, { status: 500 });
  }
}
