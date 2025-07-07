import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DELETE } from "../wishlists/[id]/versions/[versionId]/route"; // Ajusta si necesario

// Hoisted mocks
const mockAuth = vi.hoisted(() => vi.fn());
const mockDeleteMany = vi.hoisted(() => vi.fn());

// Mocks reales
vi.mock("@clerk/nextjs/server", () => ({
  auth: mockAuth,
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    wishlistItem: {
      deleteMany: mockDeleteMany,
    },
  },
}));

// ✅ Construye una instancia válida de NextRequest
const buildRequest = () =>
  new NextRequest("http://localhost/api/wishlists/w1/versions/v1", {
    method: "DELETE",
  });

describe("DELETE /wishlists/[id]/versions/[versionId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 400 if parameters are missing", async () => {
    mockAuth.mockResolvedValue({ userId: "user_123" });

    const res = await DELETE(buildRequest(), {
      params: Promise.resolve({ id: "", versionId: "" }),
    });

    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toBe("Invalid request parameters");
  });

  it("should return 200 if item is deleted", async () => {
    mockAuth.mockResolvedValue({ userId: "user_123" });

    // Prisma deleteMany devuelve un objeto con `count`
    mockDeleteMany.mockResolvedValue({ count: 1 });

    const res = await DELETE(buildRequest(), {
      params: Promise.resolve({ id: "w1", versionId: "v1" }),
    });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({});
  });

  it("throws if userId is not present", async () => {
    mockAuth.mockResolvedValue({ userId: null });

    await expect(
      DELETE(buildRequest(), {
        params: Promise.resolve({ id: "w1", versionId: "v1" }),
      }),
    ).rejects.toThrow("userId should not be null, if null it could mean middleware is not set up correctly");
  });
});
