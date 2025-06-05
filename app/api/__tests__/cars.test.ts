import { NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET, POST } from "@/app/api/cars/route";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $extends: vi.fn().mockReturnThis(),
    seller: { create: vi.fn() },
    source: { findFirst: vi.fn(), create: vi.fn() },
    brand: { findUnique: vi.fn(), create: vi.fn() },
    model: { create: vi.fn() },
    version: { create: vi.fn() },
    trim: { create: vi.fn() },
    carListing: {
      create: vi.fn().mockResolvedValue({ id: 123 }),
      findMany: vi.fn().mockReturnValue([
        {
          id: "f3b952d5-0fb0-4d49-a2a7-56341c2c685c",
          sellerId: "a317ea55-e20c-484c-af5c-4b46d8830895",
          sourceId: "895b269f-20db-4fcc-8c05-397f37811d02",
          url: "https://public-api.yapo.cl/autos-usados/kia-carens-ex-1-7-dsl-7p-6mt-dab-abs-ac-1446-2014/29750094",
          title: "Kia CARENS 2014",
          description: "null",
          price: "8990000",
          priceCurrency: "CLP",
          trimId: "144b3672-2df8-433f-96ef-70e1386cf3a7",
          year: 2014,
          mileage: 143000,
          exteriorColor: "null",
          interiorColor: "null",
          isNew: false,
          location: "Santiago",
          publishedAt: "2020-07-10T00:00:00.000Z",
          scrapedAt: "2020-07-10T00:00:00.000Z",
        },
      ]),
    },
  },
}));

describe("GET /api/cars", () => {
  it("responds 200 with a list of car listings", async () => {
    const res = await GET();
    expect(res).toBeInstanceOf(NextResponse);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(Array.isArray(json.listings)).toBe(true);
    expect(json.listings[0]).toHaveProperty("id", "f3b952d5-0fb0-4d49-a2a7-56341c2c685c");
  });
});

describe("POST /api/cars", () => {
  const fakeData = {
    brand: "Toyota",
    model: "Corolla",
    year: 2020,
    km: 10000,
    version: "XLE",
    transmission: "automático",
    priceActual: 15000,
    priceOriginal: 20000,
    location: "Buenos Aires",
    fuelType: "Bencina",
    postUrl: "https://example.com/",
    imgUrl: "https://example.com/",
    dataSource: "kavak", // plataforma de orígen
    publishedAt: "2020-10-03T00:00:00.000Z",
    scrapedAt: "2020-10-03T00:00:00.000Z",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a car listing and return instance with 201 code", async () => {
    const request = new Request("http://localhost/api/cars", {
      method: "POST",
      body: JSON.stringify(fakeData),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(201);
    expect(json.newListing).toHaveProperty("id");
  });
});
