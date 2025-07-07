import { beforeEach, describe, expect, it, vi } from "vitest";

import prisma from "@/lib/prisma";

import { GET } from "../cron/delete_old_listings/route";

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
      deleteMany: vi.fn().mockResolvedValue({}),
    },
    image: {
      deleteMany: vi.fn().mockResolvedValue({}),
    },
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/cron/del_old_listings", () => {
  it("succesfully removes 1 month+ old listings", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
  });
  it("returns error if deletion fails", async () => {
    vi.mocked(prisma.carListing.deleteMany).mockRejectedValue(new Error("Deletion failed"));
    const res = await GET();
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Error deleting old listings");
  });
});
