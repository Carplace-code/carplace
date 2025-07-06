/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, test, vi } from "vitest";

// Mock Clerk
vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

// Mock PrismaClient
let mockFindMany: any;
let mockCreate: any;

vi.mock("@prisma/client", async () => {
  mockFindMany = vi.fn();
  mockCreate = vi.fn();

  const mockPrismaClient = vi.fn(() => ({
    wishlist: {
      findMany: mockFindMany,
      create: mockCreate,
    },
  }));

  return {
    PrismaClient: mockPrismaClient,
  };
});

describe("API /api/wishlists", () => {
  let GET: any;
  let POST: any;
  let authMock: any;

  beforeEach(async () => {
    vi.clearAllMocks();

    const clerk = await import("@clerk/nextjs/server");
    authMock = clerk.auth;

    const routes = await import("@/app/api/wishlists/route");
    GET = routes.GET;
    POST = routes.POST;
  });

  test("GET: returns wishlists for user", async () => {
    authMock.mockResolvedValue({ userId: "user_123" });
    mockFindMany.mockResolvedValue([{ id: "wishlist_1", name: "My Wishlist" }]);

    const url = new URL("http://localhost/api/wishlists");
    const req = { nextUrl: url } as NextRequest;

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual([{ id: "wishlist_1", name: "My Wishlist" }]);
    expect(mockFindMany).toHaveBeenCalledWith({
      where: { clerkUserId: "user_123" },
      include: undefined,
    });
  });

  test("POST: creates wishlist for user", async () => {
    authMock.mockResolvedValue({ userId: "user_456" });
    mockCreate.mockResolvedValue({ id: "wishlist_new", name: "Nuevo" });

    const body = { name: "Nuevo", description: "test" };
    const req = {
      json: () => Promise.resolve(body),
    } as any;

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json).toEqual({ id: "wishlist_new", name: "Nuevo" });
    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        name: "Nuevo",
        description: "test",
        clerkUserId: "user_456",
      },
    });
  });

  test("GET: returns 500 if userId is missing", async () => {
    authMock.mockResolvedValue({ userId: null });

    const url = new URL("http://localhost/api/wishlists");
    const req = { nextUrl: url } as NextRequest;

    await expect(GET(req)).rejects.toThrow("userId should not be null");
  });
});
