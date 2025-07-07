/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useGetVersion, useGetVersions } from "@/hooks/useVersions";
import axios from "@/lib/axios";

// Mock axios
vi.mock("@/lib/axios");

const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>;
};

const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useGetVersions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches versions list", async () => {
    mockedAxios.get = vi.fn().mockResolvedValue({
      data: {
        data: [
          { id: "v1", name: "Version 1" },
          { id: "v2", name: "Version 2" },
        ],
        meta: { total: 2, page: 1, pageSize: 10, pageCount: 1 },
      },
    });

    const wrapper = createWrapper();
    const { result } = renderHook(() => useGetVersions(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.data).toHaveLength(2);
    expect(mockedAxios.get).toHaveBeenCalledWith("/versions", expect.any(Object));
  });
});

describe("useGetVersion", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches a single version", async () => {
    const mockedVersion = { id: "v1", name: "Version 1" };

    mockedAxios.get = vi.fn().mockResolvedValue({
      data: mockedVersion,
    });

    const wrapper = createWrapper();
    const { result } = renderHook(() => useGetVersion({ id: "v1" }), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockedVersion);
    expect(mockedAxios.get).toHaveBeenCalledWith("/versions/v1", expect.any(Object));
  });

  it("does not fetch if id is falsy", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useGetVersion({ id: "" }), { wrapper });

    // isIdle no está garantizado, mejor verificar que no está loading ni success ni error
    expect(result.current.fetchStatus).toBe("idle");
    expect(result.current.status).toBe("pending");
  });
});
