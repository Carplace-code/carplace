import { NextResponse } from "next/server";
import { describe, expect, it } from "vitest";

import { GET } from "@/app/api/health/route";

describe("GET /api/health (App Router)", () => {
  it('responds 200 with { status: "ok" }', async () => {
    // simulate a GET request
    const req = new Request("http://localhost/api/health", { method: "GET" });
    const res = await GET(req);

    // NextResponse behaves like the standard Web Response
    expect(res).toBeInstanceOf(NextResponse);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toEqual({ status: "ok" });
  });
});
