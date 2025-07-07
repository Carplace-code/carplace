/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, test, vi } from "vitest";

// Mock Clerk
vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

// Mock Prisma
let findUniqueMock: any;
let deleteManyMock: any;
let updateMock: any;

vi.mock("@/lib/prisma", () => {
  findUniqueMock = vi.fn();
  deleteManyMock = vi.fn();
  updateMock = vi.fn();

  return {
    default: {
      wishlist: {
        findUnique: findUniqueMock,
        deleteMany: deleteManyMock,
        update: updateMock,
      },
    },
  };
});

describe("API /api/wishlists/[id]", () => {
  let GET: any;
  let deleteHandler: any;
  let PATCH: any;
  let authMock: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    const clerk = await import("@clerk/nextjs/server");
    authMock = clerk.auth;

    const mod = await import("@/app/api/wishlists/[id]/route");
    GET = mod.GET;
    deleteHandler = mod.DELETE;
    PATCH = mod.PATCH;
  });

  test("GET: returns wishlist if found", async () => {
    authMock.mockResolvedValue({ userId: "user_1" });
    findUniqueMock.mockResolvedValue({ id: "wishlist_1", name: "My Wishlist" });

    const request = {} as NextRequest;
    const response = await GET(request, { params: { id: "wishlist_1" } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.name).toBe("My Wishlist");
    expect(findUniqueMock).toHaveBeenCalledWith({
      where: { id: "wishlist_1", clerkUserId: "user_1" },
    });
  });

  test("GET: returns 404 if not found", async () => {
    authMock.mockResolvedValue({ userId: "user_1" });
    findUniqueMock.mockResolvedValue(null);

    const response = await GET({} as NextRequest, { params: { id: "not_found" } });
    expect(response.status).toBe(404);
  });

  test("DELETE: deletes wishlist and returns 200", async () => {
    authMock.mockResolvedValue({ userId: "user_1" });
    deleteManyMock.mockResolvedValue({ count: 1 });

    const response = await deleteHandler({} as NextRequest, { params: { id: "wishlist_1" } });
    expect(response.status).toBe(200);
    expect(deleteManyMock).toHaveBeenCalledWith({
      where: { id: "wishlist_1", clerkUserId: "user_1" },
    });
  });

  test("DELETE: returns 404 if not found", async () => {
    authMock.mockResolvedValue({ userId: "user_1" });
    deleteManyMock.mockResolvedValue({ count: 0 });

    const response = await deleteHandler({} as NextRequest, { params: { id: "missing" } });
    expect(response.status).toBe(404);
  });

  test("PATCH: updates wishlist", async () => {
    authMock.mockResolvedValue({ userId: "user_1" });
    const updated = { id: "wishlist_1", name: "Updated" };
    updateMock.mockResolvedValue(updated);

    const request = {
      json: () => Promise.resolve({ name: "Updated" }),
    } as any;

    const response = await PATCH(request, { params: { id: "wishlist_1" } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(updated);
    expect(updateMock).toHaveBeenCalledWith({
      where: { id: "wishlist_1" },
      data: { name: "Updated" },
    });
  });

  test("GET: throws error if userId is missing", async () => {
    authMock.mockResolvedValue({ userId: null });
    await expect(GET({} as NextRequest, { params: { id: "test" } })).rejects.toThrow("userId should not be null");
  });
});
