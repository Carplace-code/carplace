/* eslint-disable @typescript-eslint/no-explicit-any */

// app/api/__tests__/wishlists-page.test.ts
import { render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useGetWishlists } from "@/hooks/useWishlists";

import WishlistsPage from "../wishlists/page";

// Mock the hook
vi.mock("@/hooks/useWishlists", () => ({
  useGetWishlists: vi.fn(),
}));

// Mock the VersionCard component using React.createElement
vi.mock("@/components/VersionCard", () => ({
  default: ({ version }: { version: any }) =>
    React.createElement(
      "div",
      { "data-testid": "version-card" },
      `${version.model.brand.name} ${version.model.name} - ${version.year}`,
    ),
}));

// Cast the mocked hook to get proper typing
const mockUseGetWishlists = vi.mocked(useGetWishlists);

describe("WishlistsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render loading state", () => {
    mockUseGetWishlists.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as any);

    render(React.createElement(WishlistsPage));

    expect(screen.getByText("Cargando tus listas de deseos...")).toBeInTheDocument();
  });

  it("should render error state", () => {
    mockUseGetWishlists.mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
    } as any);

    render(React.createElement(WishlistsPage));

    expect(screen.getByText("Error cargando tus listas de deseos")).toBeInTheDocument();
  });

  it("should render empty wishlists", () => {
    mockUseGetWishlists.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    } as any);

    render(React.createElement(WishlistsPage));

    expect(screen.getByText("Mis listas de deseos")).toBeInTheDocument();
    expect(screen.getByText("Aún no tienes listas de deseos.")).toBeInTheDocument();
  });

  it("should render wishlists with items", () => {
    const mockWishlists = [
      {
        id: "1",
        name: "Mi Lista",
        description: "Descripción de prueba",
        clerkUserId: "user_123",
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [
          {
            id: "1",
            versionId: "1",
            wishlistId: "1",
            addedAt: new Date(),
            version: {
              id: 1,
              year: 2023,
              model: {
                id: 1,
                name: "Corolla",
                brand: {
                  id: 1,
                  name: "Toyota",
                },
              },
            },
          },
        ],
        _count: { items: 1 },
      },
    ];

    mockUseGetWishlists.mockReturnValue({
      data: mockWishlists,
      isLoading: false,
      isError: false,
    } as any);

    render(React.createElement(WishlistsPage));

    expect(screen.getByText("Mis listas de deseos")).toBeInTheDocument();
    expect(screen.getByText("Mi Lista")).toBeInTheDocument();
    expect(screen.getByText("Descripción de prueba")).toBeInTheDocument();
    expect(screen.getByTestId("version-card")).toBeInTheDocument();
  });
});
