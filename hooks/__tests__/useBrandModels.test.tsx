import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// ⬇️ Importa después de mockear axios
import { useBrandModels } from "../useBrandModels";

// ✅ Hoisted mock para que esté disponible antes de los imports reales
const mockGet = vi.hoisted(() => vi.fn());

// ✅ Mock de axios como en tu ejemplo
vi.mock("axios", () => ({
  default: {
    create: () => ({ get: mockGet }),
  },
})); // Ajusta la ruta si es necesario

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useBrandModels", () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  it("fetches brand models correctly", async () => {
    const mockedData = {
      Toyota: ["Corolla", "Yaris"],
      Honda: ["Civic", "Fit"],
    };

    mockGet.mockResolvedValueOnce({ data: mockedData });

    const { result } = renderHook(() => useBrandModels(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockedData);
    expect(mockGet).toHaveBeenCalledWith("/brand-models");
  });

  it("handles errors correctly", async () => {
    mockGet.mockRejectedValueOnce(new Error("Request failed"));

    const { result } = renderHook(() => useBrandModels(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
