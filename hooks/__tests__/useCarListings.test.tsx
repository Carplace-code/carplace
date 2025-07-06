import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// ✅ Import the hooks after mocking
import { useGetCarListing, useGetCarListings } from "../useCarListings";

// ✅ Use vi.hoisted to ensure mockGet is available during mock hoisting
const mockGet = vi.hoisted(() => vi.fn());

// ✅ Mock axios with the hoisted mock
vi.mock("axios", () => ({
  default: {
    create: () => ({ get: mockGet }),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries for tests
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useCarListings hooks", () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  it("fetches car listings list", async () => {
    const mockedData = [{ id: "c1" }, { id: "c2" }];
    mockGet.mockResolvedValueOnce({ data: mockedData });

    const { result } = renderHook(() => useGetCarListings(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockedData);
    expect(mockGet).toHaveBeenCalledWith("/car_listings", {
      params: {
        include: undefined,
        pageSize: undefined,
        orderBy: undefined,
      },
    });
  });

  it("fetches a single car listing", async () => {
    const mockedData = { id: "c1", name: "Test Car" };
    mockGet.mockResolvedValueOnce({ data: mockedData });

    const { result } = renderHook(() => useGetCarListing({ id: "c1" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockedData);
    expect(mockGet).toHaveBeenCalledWith("/car_listings/c1", {
      params: { include: undefined },
    });
  });
});
