import { beforeEach, describe, expect, it, vi } from "vitest";

import prisma from "@/lib/prisma";

import { DELETE } from "../cars/delete_duplicates/route";
import { GET, POST } from "../cars/route";

vi.mock("@/lib/prisma", () => ({
  default: {
    seller: {
      create: vi.fn().mockResolvedValue({ id: "seller-id-123" }),
    },
    source: {
      findFirst: vi.fn().mockResolvedValue({ id: "source-id-123", name: "kavak" }),
      create: vi.fn().mockResolvedValue({ id: "source-id-123", name: "kavak", baseUrl: "https://www.kavak.com/cl" }),
    },
    brand: {
      findFirst: vi.fn().mockResolvedValue({ id: "brand-id-123", name: "Toyota" }),
      create: vi.fn().mockResolvedValue({ id: "brand-id-123", name: "Toyota" }),
    },
    model: {
      findFirst: vi.fn().mockResolvedValue({ id: "model-id-123", name: "Corolla", brandId: "brand-id-123" }),
      create: vi.fn().mockResolvedValue({ id: "model-id-123", name: "Corolla", brandId: "brand-id-123" }),
    },
    version: {
      findFirst: vi.fn().mockResolvedValue({ id: "version-id-123", year: 2020 }),
      create: vi.fn().mockResolvedValue({ id: "version-id-123", year: 2020 }),
    },
    trim: {
      findFirst: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({ id: "trim-id-123", name: "XLE" }),
    },
    carListing: {
      groupBy: vi.fn(),
      create: vi.fn().mockResolvedValue({ id: "listing-id-123" }),
      findMany: vi.fn().mockResolvedValue([
        {
          id: "listing-id-123",
          sellerId: "seller-id-123",
          sourceId: "source-id-123",
          url: "https://example.com/",
          title: "Toyota Corolla XLE",
          description: "null",
          price: 15000,
          priceCurrency: "CLP",
          trimId: "trim-id-123",
          year: 2020,
          mileage: 10000,
          exteriorColor: "null",
          interiorColor: "null",
          isNew: false,
          location: "Buenos Aires",
          publishedAt: new Date(),
          scrapedAt: new Date(),
          images: [
            {
              id: "img-id-123",
              url: "https://example.com/test-image.jpg",
              listingId: "listing-id-123",
            },
          ],
          source: {
            id: "source-id-123",
            name: "kavak",
            baseUrl: "https://www.kavak.com/cl",
          },
          trim: {
            id: "trim-id-123",
            name: "XLE",
            fuelType: "gas",
            transmissionType: "automatic",
            version: {
              id: "version-id-123",
              year: 2020,
              model: {
                id: "model-id-123",
                name: "Corolla",
                brand: {
                  id: "brand-id-123",
                  name: "Toyota",
                },
              },
            },
          },
        },
      ]),
      deleteMany: vi.fn().mockResolvedValue({}),
    },
    image: {
      create: vi.fn().mockResolvedValue({ id: "img-id-123", url: "https://example.com/" }),
      deleteMany: vi.fn().mockResolvedValue({}),
    },
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/cars", () => {
  it("responds 200 with a list of car listings", async () => {
    const request = new Request("http://localhost:3000/api/cars");
    const res = await GET(request);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json.listings)).toBe(true);
    expect(json.listings[0]).toHaveProperty("id", "listing-id-123");
  });

  it("returns 500 if prisma.carListing.findMany throws", async () => {
    vi.mocked(prisma.carListing.findMany).mockRejectedValueOnce(new Error("Database error"));

    const request = new Request("http://localhost:3000/api/cars");
    const res = await GET(request);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("");
  });
});

describe("POST /api/cars", () => {
  const validData = {
    brand: "Toyota",
    model: "Corolla",
    year: 2020,
    km: 10000,
    version: "XLE",
    transmission: "automatic",
    priceActual: 15000,
    priceOriginal: 20000,
    location: "Buenos Aires",
    fuelType: "gas",
    postUrl: "https://example.com/",
    imgUrl: "https://example.com/",
    dataSource: "kavak",
    publishedAt: "2020-10-03T00:00:00.000Z",
    scrapedAt: "2020-10-03T00:00:00.000Z",
  };

  it("creates listing with status 201", async () => {
    const request = new Request("http://localhost/api/cars", {
      method: "POST",
      body: JSON.stringify(validData),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(request);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.newListing).toBeDefined();
  });

  it("fails on missing required fields", async () => {
    const badRequest = new Request("http://localhost/api/cars", {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(badRequest);
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toBe("Missing required fields");
  });

  it("fails with invalid source", async () => {
    vi.mocked(prisma.source.findFirst).mockResolvedValueOnce(null);
    const request = new Request("http://localhost/api/cars", {
      method: "POST",
      body: JSON.stringify({ ...validData, dataSource: "invalid-source" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(request);
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toBe("Invalid source");
  });

  it("fails if price is negative", async () => {
    const request = new Request("http://localhost/api/cars", {
      method: "POST",
      body: JSON.stringify({ ...validData, priceActual: -100 }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(request);
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toMatch(/Negative price/);
  });

  it("fails if mileage is negative", async () => {
    const request = new Request("http://localhost/api/cars", {
      method: "POST",
      body: JSON.stringify({ ...validData, km: -1 }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(request);
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toMatch(/Negative mileage/);
  });

  it("fails if year < 1886", async () => {
    const request = new Request("http://localhost/api/cars", {
      method: "POST",
      body: JSON.stringify({ ...validData, year: 1800 }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(request);
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toMatch(/1886/);
  });

  it("fails with invalid transmission or fuel type", async () => {
    const request = new Request("http://localhost/api/cars", {
      method: "POST",
      body: JSON.stringify({ ...validData, transmission: "flywheel", fuelType: "banana" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(request);
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toMatch(/Invalid (fuelType|transmission)/);
  });

  it("fails if required field 'brand' is missing", async () => {
    const invalidData: Partial<typeof validData> = { ...validData };
    delete invalidData.brand;

    const request = new Request("http://localhost/api/cars", {
      method: "POST",
      body: JSON.stringify(invalidData),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(request);
    expect(res.status).toBe(400);
  });

  it("creates brand if not found", async () => {
    vi.mocked(prisma.brand.findFirst).mockResolvedValueOnce(null);

    const req = new Request("http://localhost/api/cars", {
      method: "POST",
      body: JSON.stringify(validData),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    expect(prisma.brand.create).toHaveBeenCalled();
  });

  it("creates model if not found", async () => {
    vi.mocked(prisma.model.findFirst).mockResolvedValueOnce(null);

    const req = new Request("http://localhost/api/cars", {
      method: "POST",
      body: JSON.stringify(validData),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    expect(prisma.model.create).toHaveBeenCalled();
  });

  it("creates version if not found", async () => {
    vi.mocked(prisma.version.findFirst).mockResolvedValueOnce(null);

    const req = new Request("http://localhost/api/cars", {
      method: "POST",
      body: JSON.stringify(validData),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    expect(prisma.version.create).toHaveBeenCalled();
  });

  it("returns 500 on unexpected error", async () => {
    vi.mocked(prisma.carListing.create).mockRejectedValueOnce(new Error("DB failure"));

    const req = new Request("http://localhost/api/cars", {
      method: "POST",
      body: JSON.stringify(validData),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    const json = await res.json();
    expect(res.status).toBe(500);
    expect(json.error).toMatch(/Internal server error/);
  });

  it("returns 400 on invalid JSON body", async () => {
    const badRequest = new Request("http://localhost/api/cars", {
      method: "POST",
      body: "invalid-json",
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(badRequest);
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toBe("Invalid or missing JSON body");
  });

  it("fails with invalid numeric types", async () => {
    const badTypes = { ...validData, priceActual: "cheap", year: "two-thousand" };
    const req = new Request("http://localhost/api/cars", {
      method: "POST",
      body: JSON.stringify(badTypes),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toBe("Invalid type for numeric fields");
  });

  it("fails if required field 'location' is missing", async () => {
    const invalidData: Omit<typeof validData, "location"> & { location?: string } = { ...validData };
    delete invalidData.location;

    const request = new Request("http://localhost/api/cars", {
      method: "POST",
      body: JSON.stringify(invalidData),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(request);
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toBe("Missing required fields");
  });

  it("fails with non-string fuelType", async () => {
    const badFuel = { ...validData, fuelType: 12345 };
    const req = new Request("http://localhost/api/cars", {
      method: "POST",
      body: JSON.stringify(badFuel),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toMatch(/Invalid fuelType/);
  });

  it("fails if transmission is not in allowed list", async () => {
    const badTransmission = { ...validData, transmission: "banana" };

    const request = new Request("http://localhost/api/cars", {
      method: "POST",
      body: JSON.stringify(badTransmission),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(request);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toMatch(/Invalid transmission/);
  });

  it("creates source if not found but exists in predefined list", async () => {
    vi.mocked(prisma.source.findFirst).mockResolvedValueOnce(null);
    vi.mocked(prisma.source.create).mockResolvedValueOnce({
      id: "source-id-999",
      name: "yapo",
      baseUrl: "https://public-api.yapo.cl/",
    });

    const request = new Request("http://localhost/api/cars", {
      method: "POST",
      body: JSON.stringify({ ...validData, dataSource: "yapo" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(request);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.newListing).toBeDefined();
    expect(prisma.source.create).toHaveBeenCalledWith({
      data: {
        name: "yapo",
        baseUrl: "https://public-api.yapo.cl/",
      },
    });
  });

  it("falls back to 'other' if transmission is not a string", async () => {
    const badTransmission = { ...validData, transmission: 12345 }; // not a string

    const req = new Request("http://localhost/api/cars", {
      method: "POST",
      body: JSON.stringify(badTransmission),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toMatch(/Invalid transmission/);
  });

  it("uses fallback trim name if version is not provided", async () => {
    const dataWithoutVersion: Omit<typeof validData, "version"> & { version?: string } = { ...validData };
    delete dataWithoutVersion.version;

    // mock prisma.trim.findFirst to return null to force creation
    vi.mocked(prisma.trim.findFirst).mockResolvedValueOnce(null);
    vi.mocked(prisma.trim.create).mockResolvedValueOnce({
      id: "trim-id-123",
      name: "Toyota-Corolla-2020",
      motorSize: 1.8,
      fuelType: "gas",
      transmissionType: "automatic",
      versionId: "version-id-123",
    });

    const request = new Request("http://localhost/api/cars", {
      method: "POST",
      body: JSON.stringify(dataWithoutVersion),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(request);

    expect(res.status).toBe(201);
    expect(prisma.trim.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          name: "Toyota-Corolla-2020", // fallback name
        }),
      }),
    );
  });

  it("uses current date if publishedAt and scrapedAt are not provided", async () => {
    const dataWithoutDates = { ...validData } as Omit<typeof validData, "publishedAt" | "scrapedAt"> & {
      publishedAt?: string;
      scrapedAt?: string;
    };
    delete dataWithoutDates.publishedAt;
    delete dataWithoutDates.scrapedAt;

    const request = new Request("http://localhost/api/cars", {
      method: "POST",
      body: JSON.stringify(dataWithoutDates),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(request);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.newListing).toBeDefined();

    // Verifica que se usó new Date()
    const callData = vi.mocked(prisma.carListing.create).mock.calls[0][0].data;

    expect(callData.publishedAt).toBeInstanceOf(Date);
    expect(callData.scrapedAt).toBeInstanceOf(Date);
  });
});

describe("DELETE /api/cars/del_duplicates", () => {
  it("successfully deletes posts with duplicate url", async () => {
    // Simular la salida del groupBy
    (prisma.carListing.groupBy as ReturnType<typeof vi.fn>).mockResolvedValue([
      { url: "a.com", _max: { id: "4" } },
      { url: "b.com", _max: { id: "8" } },
    ]);

    // Simular duplicados encontrados
    (prisma.carListing.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([
      { id: "1" },
      { id: "2" },
      { id: "3" },
      { id: "5" },
      { id: "6" },
      { id: "7" },
    ]);

    // Simular eliminación
    vi.mocked(prisma.image.deleteMany).mockResolvedValue({ count: 6 });
    vi.mocked(prisma.carListing.deleteMany).mockResolvedValue({ count: 6 });

    const res = await DELETE();
    const json = await res.json();

    expect(prisma.carListing.groupBy).toHaveBeenCalled();
    expect(prisma.carListing.findMany).toHaveBeenCalledWith({
      where: {
        id: {
          notIn: ["4", "8"],
        },
      },
      select: {
        id: true,
      },
    });

    expect(prisma.image.deleteMany).toHaveBeenCalledWith({
      where: {
        listingId: {
          in: ["1", "2", "3", "5", "6", "7"],
        },
      },
    });

    expect(prisma.carListing.deleteMany).toHaveBeenCalledWith({
      where: {
        id: {
          in: ["1", "2", "3", "5", "6", "7"],
        },
      },
    });

    expect(res.status).toBe(200);
    expect(json.deletedDuplicates.count).toBe(6);
  });
});
