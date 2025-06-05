import { NextResponse } from "next/server";
import { describe, expect, it, vi } from "vitest";

import { GET } from "@/app/api/sources/route";

const sources = [
  {
    name: "fb_mkt",
    baseUrl: "https://www.facebook.com/marketplace/",
  },
  {
    name: "kavak",
    baseUrl: "https://www.kavak.com/cl",
  },
  {
    name: "yapo",
    baseUrl: "https://public-api.yapo.cl/",
  },
];

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $extends: vi.fn().mockReturnThis(),
    source: { findMany: vi.fn().mockResolvedValue(sources) },
  },
}));

describe("GET /api/cars", () => {
  it("responds 200 with a list of car listings", async () => {
    // Simula la solicitud GET
    const res = await GET();

    // Verifica la respuesta
    expect(res).toBeInstanceOf(NextResponse);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toEqual(sources);
  });
});
