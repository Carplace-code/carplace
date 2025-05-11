import { NextResponse } from "next/server";
import { describe, expect, it } from "vitest";

import { GET } from "@/app/api/hello/route";

describe("GET /api/hello", () => {
  it('responds 200 with { message: "Hello, world!" }', async () => {
    // Simula una solicitud GET
    const res = await GET();

    // Verifica que la respuesta sea válida
    expect(res).toBeInstanceOf(NextResponse);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toEqual({ message: "Hello, world!" });
  });
});
