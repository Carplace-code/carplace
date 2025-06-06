import { NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET, POST } from "../cars/route";

// Mock the prisma client module
vi.mock("@/lib/prisma", () => ({
  default: {
    // Use 'default' because of the 'export default prisma' in lib/prisma.ts
    $extends: vi.fn().mockReturnThis(),
    // Mock every prisma call made in the POST route
    seller: {
      create: vi.fn().mockResolvedValue({ id: "seller-id-123" }),
    },
    source: {
      // The API expects findFirst to return an object with an ID
      findFirst: vi.fn().mockResolvedValue({ id: "source-id-123", name: "kavak" }),
    },
    brand: {
      // Mock findFirst to return null, so the test covers the 'create' case
      findFirst: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({ id: "brand-id-123", name: "Toyota" }),
    },
    model: {
      // Mock findFirst to return null, so the test covers the 'create' case
      findFirst: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({ id: "model-id-123", name: "Corolla" }),
    },
    version: {
      // Mock findFirst to return null, so the test covers the 'create' case
      findFirst: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({ id: "version-id-123", versionName: "XLE" }),
    },
    trim: {
      create: vi.fn().mockResolvedValue({ id: "trim-id-123" }),
    },
    image: {
      // The API creates an image at the end, it must be mocked
      create: vi.fn().mockResolvedValue({ id: "image-id-123" }),
    },
    carListing: {
      create: vi.fn().mockResolvedValue({ id: "new-listing-id-123" }), // Mock for POST
      findMany: vi.fn().mockResolvedValue([
        // Mock for GET
        {
          id: "f3b952d5-0fb0-4d49-a2a7-56341c2c685c",
          sellerId: "a317ea55-e20c-484c-af5c-4b46d8830895",
          sourceId: "source-id-123",
          url: "https://public-api.yapo.cl/autos-usados/kia-carens-ex-1-7-dsl-7p-6mt-dab-abs-ac-1446-2014/29750094",
          title: "Kia CARENS 2014",
          description: "null",
          price: "8990000",
          priceCurrency: "CLP",
          trimId: "trim-id-123",
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
    expect(json.newListing).toHaveProperty("id", "new-listing-id-123");
  });

  it("should handle missing data", async () => {
    const request = new Request("http://localhost/api/cars", {
      method: "POST",
      body: JSON.stringify(null),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(request);
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toBe("Invalid data");
  });
});
