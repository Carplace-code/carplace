import { beforeEach, describe, expect, it, vi, type MockedFunction } from "vitest";

import { GET } from "@/app/api/brand-models/route";

// ✅ TYPED SOLUTION: Create a shared mock that's accessible
let mockFindMany: MockedFunction<() => Promise<Array<{ name: string; brand: { name: string } }>>>;

vi.mock("@prisma/client", () => ({
  PrismaClient: vi.fn().mockImplementation(() => ({
    model: {
      findMany: (...args: Parameters<typeof mockFindMany>) => mockFindMany(...args),
    },
  })),
}));

describe("GET /api/brand-models", () => {
  beforeEach(() => {
    mockFindMany = vi.fn();
  });

  it("should return a brand-models map with status 200", async () => {
    mockFindMany.mockResolvedValueOnce([
      {
        name: "Model X",
        brand: { name: "Tesla" },
      },
      {
        name: "Model S",
        brand: { name: "Tesla" },
      },
      {
        name: "Civic",
        brand: { name: "Honda" },
      },
    ]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      Tesla: ["Model X", "Model S"],
      Honda: ["Civic"],
    });
  });

  it("should handle errors and return status 500", async () => {
    mockFindMany.mockRejectedValueOnce(new Error("DB error"));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: "Error loading brand-models map" });
  });
});
