import { NextResponse } from "next/server";
import { describe, expect, it, vi } from "vitest";

import { GET } from "../brands/route";

// Mock de Prisma
vi.mock("@prisma/client", () => ({
  PrismaClient: vi.fn().mockImplementation(() => ({
    brand: {
      findMany: vi.fn().mockResolvedValue([
        { id: 1, name: "Toyota" },
        { id: 2, name: "Ford" },
      ]),
    },
  })),
}));

describe("GET /api/brands", () => {
  it("responds 200 with a list of brands", async () => {
    // Simula la solicitud GET
    const res = await GET();

    // Verifica la respuesta
    expect(res).toBeInstanceOf(NextResponse);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toEqual([
      { id: 1, name: "Toyota" },
      { id: 2, name: "Ford" },
    ]);
  });
});
