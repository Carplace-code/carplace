import { NextResponse } from "next/server";
import { describe, expect, it, vi } from "vitest";

import prisma from "@/lib/prisma";

import { GET } from "../sources/route";

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
  default: {
    $extends: vi.fn().mockReturnThis(),
    source: { findMany: vi.fn().mockResolvedValue(sources) },
  },
}));

describe("GET /api/sources", () => {
  it("responds 200 with a list of all sources", async () => {
    // Simula la solicitud GET
    const res = await GET();

    // Verifica la respuesta
    expect(res).toBeInstanceOf(NextResponse);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toEqual([
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
    ]);
  });

  it("fails if error is raised", async () => {
    prisma.source.findMany.mockResolvedValue(new Error("Sources not found"));
    const res = await GET();

    // Verifica la respuesta
    expect(res).toBeInstanceOf(NextResponse);
    expect(res.status).toBe(400);
  });
});
