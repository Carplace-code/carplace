import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "../wishlists/[id]/versions/route";

// Hoisted mocks
const mockAuth = vi.hoisted(() => vi.fn());
const mockCreate = vi.hoisted(() => vi.fn());

// Mocks reales
vi.mock("@clerk/nextjs/server", () => ({
  auth: mockAuth,
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    wishlistItem: {
      create: mockCreate,
    },
  },
}));

// Helper para simular un NextRequest con JSON
function buildPostRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/wishlists/w1/versions", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

describe("POST /wishlists/[id]/versions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 201 when wishlist item is created", async () => {
    mockAuth.mockResolvedValue({ userId: "user_123" });
    mockCreate.mockResolvedValue({ id: "item_1" });

    const req = buildPostRequest({ versionId: "v1" });

    const res = await POST(req, { params: { id: "w1" } });

    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json).toEqual({});
    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        wishlistId: "w1",
        versionId: "v1",
      },
    });
  });

  it("should throw if userId is null", async () => {
    mockAuth.mockResolvedValue({ userId: null });

    const req = buildPostRequest({ versionId: "v1" });

    await expect(POST(req, { params: { id: "w1" } })).rejects.toThrow(
      "userId should not be null, if null it could mean middleware is not set up correctly",
    );
  });
});
