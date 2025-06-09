/* eslint-disable @typescript-eslint/no-explicit-any */

import { beforeEach, describe, expect, test, vi } from "vitest";

// Mock PrismaClient
vi.mock("@prisma/client", () => {
  const mockFindMany = vi.fn();
  const mockPrismaClient = vi.fn(() => ({
    source: {
      findMany: mockFindMany,
    },
  }));

  return {
    PrismaClient: mockPrismaClient,
    __mockFindMany: mockFindMany,
  };
});

describe("GET /api/sources", () => {
  let mockFindMany: any;
  let GET: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    // Import the mock and the route
    const prismaModule = await import("@prisma/client");
    // eslint-disable-next-line @typescript-eslint/dot-notation
    mockFindMany = (prismaModule as any)["__mockFindMany"];
    const routeModule = await import("@/app/api/sources/route");
    GET = routeModule.GET;
  });

  test("returns sources successfully", async () => {
    const mockSources = [
      { id: "1", name: "chileautos" },
      { id: "2", name: "yapo" },
    ];

    mockFindMany.mockResolvedValue(mockSources);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockSources);
    expect(mockFindMany).toHaveBeenCalledTimes(1);
  });

  test("handles database errors", async () => {
    mockFindMany.mockRejectedValue(new Error("Database error"));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: "" });
  });
});
