/* eslint-disable @typescript-eslint/no-explicit-any */

import { beforeEach, describe, expect, test, vi } from "vitest";

// Mock PrismaClient
vi.mock("@prisma/client", () => {
  const mockCount = vi.fn();
  const mockFindMany = vi.fn();

  const mockPrismaClient = vi.fn(() => ({
    version: {
      count: mockCount,
      findMany: mockFindMany,
    },
  }));

  return {
    PrismaClient: mockPrismaClient,
    __mockCount: mockCount,
    __mockFindMany: mockFindMany,
  };
});

describe("GET /api/versions", () => {
  let mockCount: any;
  let mockFindMany: any;
  let GET: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    const prismaModule = await import("@prisma/client");
    // eslint-disable-next-line @typescript-eslint/dot-notation
    mockCount = (prismaModule as any)["__mockCount"];
    // eslint-disable-next-line @typescript-eslint/dot-notation
    mockFindMany = (prismaModule as any)["__mockFindMany"];
    const routeModule = await import("@/app/api/versions/route");
    GET = routeModule.GET;
  });

  const createRequest = (url: string): any => {
    const u = new URL(url);
    return {
      nextUrl: u,
    };
  };

  test("returns versions successfully", async () => {
    const mockVersions = [{ id: "v1", year: 2020 }];
    mockCount.mockResolvedValue(1);
    mockFindMany.mockResolvedValue(mockVersions);

    const response = await GET(createRequest("http://localhost/api/versions"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toEqual(mockVersions);
    expect(data.meta.total).toBe(1);
    expect(data.meta.page).toBe(1);
    expect(data.meta.pageSize).toBe(100);
    expect(mockCount).toHaveBeenCalledTimes(1);
    expect(mockFindMany).toHaveBeenCalledTimes(1);
  });

  test("handles include, where, orderBy and pagination", async () => {
    const include = encodeURIComponent(JSON.stringify({ model: true }));
    const where = encodeURIComponent(JSON.stringify({ year: { gte: 2020 } }));
    const orderBy = encodeURIComponent(JSON.stringify({ year: "desc" }));
    const url = `http://localhost/api/versions?include=${include}&where=${where}&orderBy=${orderBy}&page=2&pageSize=10`;

    mockCount.mockResolvedValue(25);
    mockFindMany.mockResolvedValue([{ id: "v2", year: 2021 }]);

    const response = await GET(createRequest(url));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.meta.page).toBe(2);
    expect(data.meta.pageSize).toBe(10);
    expect(data.meta.pageCount).toBe(3);
    expect(mockCount).toHaveBeenCalledWith({ where: { year: { gte: 2020 } } });
    expect(mockFindMany).toHaveBeenCalledWith({
      where: { year: { gte: 2020 } },
      include: { model: true },
      orderBy: { year: "desc" },
      take: 10,
      skip: 10,
    });
  });

  test("returns 500 on failure", async () => {
    mockCount.mockRejectedValue(new Error("fail"));

    const response = await GET(createRequest("http://localhost/api/versions"));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: "Failed to fetch versions" });
  });
});
