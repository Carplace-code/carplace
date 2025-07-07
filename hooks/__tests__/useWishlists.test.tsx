import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { useAddToWishlist, useCreateWishlist, useDeleteWishlist, useGetWishlist } from "@/hooks/useWishlists";
import axios from "@/lib/axios";

// Mock axios methods
vi.mock("@/lib/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const queryClient = new QueryClient();

const createWrapper = () =>
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };

describe("useWishlists hooks", () => {
  it("fetches a wishlist by ID", async () => {
    const mockWishlist = { id: "wishlist_1", name: "My Wishlist", description: "" };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (axios.get as any).mockResolvedValueOnce({ data: mockWishlist });

    const { result } = renderHook(() => useGetWishlist({ wishlistId: "wishlist_1" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockWishlist);
  });

  it("creates a wishlist", async () => {
    const newWishlist = { name: "New", description: "" };
    const createdWishlist = { id: "wishlist_2", ...newWishlist };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (axios.post as any).mockResolvedValueOnce({ data: createdWishlist });

    const { result } = renderHook(() => useCreateWishlist(), { wrapper: createWrapper() });

    result.current.mutate(newWishlist);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(createdWishlist);
  });

  it("deletes a wishlist", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (axios.delete as any).mockResolvedValueOnce({});

    const { result } = renderHook(() => useDeleteWishlist(), { wrapper: createWrapper() });

    result.current.mutate("wishlist_1");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("adds a version to a wishlist", async () => {
    const payload = { wishlistId: "wishlist_1", versionId: "v123" };
    const mockResponse = { id: "wishlist_1", ...payload };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (axios.post as any).mockResolvedValueOnce({ data: mockResponse });

    const { result } = renderHook(() => useAddToWishlist(), { wrapper: createWrapper() });

    result.current.mutate(payload);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockResponse);
  });
});
