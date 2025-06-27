import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "../cron/del_old_listings/route";

vi.mock("@/lib/prisma", () => ({
  default: {
    carListing: {
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
          scrapedAt: "2025-04-01T00:00:00.000Z",
          images: "images",
          source: "source",
          trim: "trim",
        },
      ]),
    },
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/cron/del_old_listings", () => {
  it("succesfully removes 1 month+ old listings", async () => {
    const request = new Request("http://localhost:3000/api/cron/del_old_listings");
    const res = await GET(request);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json.listings)).toBe(true);
    expect(json.listings[0]).toHaveProperty("id", "listing-id-123");
  });
});
