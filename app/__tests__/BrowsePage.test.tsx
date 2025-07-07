/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Import the mocked hooks after they're defined
import { useBrandModels } from "@/hooks/useBrandModels";
import { useGetVersions } from "@/hooks/useVersions";

import BrowsePage from "../browse/page";
/* eslint-disable @typescript-eslint/no-explicit-any */
// Mock the hooks - use factory functions instead of variables
vi.mock("@/hooks/useBrandModels", () => ({
  useBrandModels: vi.fn(),
}));

vi.mock("@/hooks/useVersions", () => ({
  useGetVersions: vi.fn(),
}));

// Mock the components
vi.mock("@/components/ActiveFilters", () => ({
  default: ({ filters }: any) => <div data-testid="active-filters">ActiveFilters - {filters.length} filters</div>,
}));

vi.mock("@/components/Pagination", () => ({
  default: ({ page, pageCount }: any) => (
    <div data-testid="pagination">
      Pagination - Page {page} of {pageCount}
    </div>
  ),
}));

vi.mock("@/components/SidebarFilters", () => ({
  default: ({ brandOptions, modelOptions, yearOptions }: any) => (
    <div data-testid="sidebar-filters">
      SidebarFilters - {brandOptions.length} brands, {modelOptions.length} models, {yearOptions.length} years
    </div>
  ),
}));

vi.mock("@/components/VersionsGrid", () => ({
  default: ({ versions }: any) => <div data-testid="versions-grid">VersionsGrid - {versions.length} versions</div>,
}));

// Cast to vi.Mock for type safety
const mockUseBrandModels = useBrandModels as vi.Mock;
const mockUseGetVersions = useGetVersions as vi.Mock;

// Test wrapper with QueryClient
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe("BrowsePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state", () => {
    mockUseBrandModels.mockReturnValue({
      data: {},
    });

    mockUseGetVersions.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
    });

    render(
      <TestWrapper>
        <BrowsePage />
      </TestWrapper>,
    );

    // Look for the Spanish loading text that's actually rendered
    expect(screen.getByText("Cargando...")).toBeInTheDocument();
  });

  it("renders success state with empty data", () => {
    mockUseBrandModels.mockReturnValue({
      data: {
        Toyota: ["Corolla", "Camry"],
        Ford: ["Focus", "Mustang"],
        Honda: ["Civic", "Accord"],
      },
    });

    mockUseGetVersions.mockReturnValue({
      data: {
        data: [],
        meta: {
          page: 1,
          pageCount: 1,
          total: 0,
        },
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    render(
      <TestWrapper>
        <BrowsePage />
      </TestWrapper>,
    );

    expect(screen.getByTestId("active-filters")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-filters")).toBeInTheDocument();
    expect(screen.getByTestId("versions-grid")).toBeInTheDocument();
    expect(screen.getByTestId("pagination")).toBeInTheDocument();

    // Check that empty state is rendered
    expect(screen.getByText("VersionsGrid - 0 versions")).toBeInTheDocument();
    expect(screen.getByText("Pagination - Page 1 of 1")).toBeInTheDocument();
  });

  it("renders success state with data", () => {
    mockUseBrandModels.mockReturnValue({
      data: {
        Toyota: ["Corolla", "Camry"],
        Ford: ["Focus", "Mustang"],
        Honda: ["Civic", "Accord"],
      },
    });

    mockUseGetVersions.mockReturnValue({
      data: {
        data: [
          {
            id: 1,
            year: 2020,
            model: {
              name: "Corolla",
              brand: {
                name: "Toyota",
              },
            },
            trims: [
              {
                id: 1,
                carListings: [
                  {
                    id: 1,
                    images: [],
                  },
                ],
              },
            ],
          },
          {
            id: 2,
            year: 2021,
            model: {
              name: "Civic",
              brand: {
                name: "Honda",
              },
            },
            trims: [
              {
                id: 2,
                carListings: [
                  {
                    id: 2,
                    images: [],
                  },
                ],
              },
            ],
          },
        ],
        meta: {
          page: 1,
          pageCount: 5,
          total: 40,
        },
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    render(
      <TestWrapper>
        <BrowsePage />
      </TestWrapper>,
    );

    expect(screen.getByTestId("active-filters")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-filters")).toBeInTheDocument();
    expect(screen.getByTestId("versions-grid")).toBeInTheDocument();
    expect(screen.getByTestId("pagination")).toBeInTheDocument();

    // Check that data is rendered
    expect(screen.getByText("VersionsGrid - 2 versions")).toBeInTheDocument();
    expect(screen.getByText("Pagination - Page 1 of 5")).toBeInTheDocument();
    expect(screen.getByText("SidebarFilters - 3 brands, 0 models, 35 years")).toBeInTheDocument();
  });

  it("renders with multiple pages", () => {
    mockUseBrandModels.mockReturnValue({
      data: {
        Toyota: ["Corolla", "Camry"],
        Ford: ["Focus", "Mustang"],
      },
    });

    mockUseGetVersions.mockReturnValue({
      data: {
        data: [
          {
            id: 1,
            year: 2020,
            model: {
              name: "Corolla",
              brand: {
                name: "Toyota",
              },
            },
            trims: [
              {
                id: 1,
                carListings: [
                  {
                    id: 1,
                    images: [],
                  },
                ],
              },
            ],
          },
        ],
        meta: {
          page: 2,
          pageCount: 10,
          total: 80,
        },
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    render(
      <TestWrapper>
        <BrowsePage />
      </TestWrapper>,
    );

    expect(screen.getByText("Pagination - Page 2 of 10")).toBeInTheDocument();
    expect(screen.getByText("VersionsGrid - 1 versions")).toBeInTheDocument();
  });

  it("renders without brand models data", () => {
    mockUseBrandModels.mockReturnValue({
      data: undefined,
    });

    mockUseGetVersions.mockReturnValue({
      data: {
        data: [],
        meta: {
          page: 1,
          pageCount: 1,
          total: 0,
        },
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    render(
      <TestWrapper>
        <BrowsePage />
      </TestWrapper>,
    );

    expect(screen.getByTestId("sidebar-filters")).toBeInTheDocument();
    expect(screen.getByText("SidebarFilters - 0 brands, 0 models, 35 years")).toBeInTheDocument();
  });

  it("renders with filters applied", () => {
    mockUseBrandModels.mockReturnValue({
      data: {
        Toyota: ["Corolla", "Camry"],
      },
    });

    mockUseGetVersions.mockReturnValue({
      data: {
        data: [
          {
            id: 1,
            year: 2020,
            model: {
              name: "Corolla",
              brand: {
                name: "Toyota",
              },
            },
            trims: [
              {
                id: 1,
                carListings: [
                  {
                    id: 1,
                    images: [],
                  },
                ],
              },
            ],
          },
        ],
        meta: {
          page: 1,
          pageCount: 1,
          total: 1,
        },
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    render(
      <TestWrapper>
        <BrowsePage />
      </TestWrapper>,
    );

    expect(screen.getByText("VersionsGrid - 1 versions")).toBeInTheDocument();
  });

  // Optional: Keep snapshot tests but update them
  describe("Snapshots", () => {
    it("renders loading state snapshot", () => {
      mockUseBrandModels.mockReturnValue({
        data: {},
      });

      mockUseGetVersions.mockReturnValue({
        data: null,
        isLoading: true,
        isError: false,
        error: null,
      });

      const { container } = render(
        <TestWrapper>
          <BrowsePage />
        </TestWrapper>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it("renders error state snapshot", () => {
      mockUseBrandModels.mockReturnValue({
        data: {},
      });

      mockUseGetVersions.mockReturnValue({
        data: null,
        isLoading: false,
        isError: true,
        error: { message: "Network error" },
      });

      const { container } = render(
        <TestWrapper>
          <BrowsePage />
        </TestWrapper>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it("renders success state with empty data snapshot", () => {
      mockUseBrandModels.mockReturnValue({
        data: {
          Toyota: ["Corolla", "Camry"],
          Ford: ["Focus", "Mustang"],
          Honda: ["Civic", "Accord"],
        },
      });

      mockUseGetVersions.mockReturnValue({
        data: {
          data: [],
          meta: {
            page: 1,
            pageCount: 1,
            total: 0,
          },
        },
        isLoading: false,
        isError: false,
        error: null,
      });

      const { container } = render(
        <TestWrapper>
          <BrowsePage />
        </TestWrapper>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it("renders success state with data snapshot", () => {
      mockUseBrandModels.mockReturnValue({
        data: {
          Toyota: ["Corolla", "Camry"],
          Ford: ["Focus", "Mustang"],
          Honda: ["Civic", "Accord"],
        },
      });

      mockUseGetVersions.mockReturnValue({
        data: {
          data: [
            {
              id: 1,
              year: 2020,
              model: {
                name: "Corolla",
                brand: {
                  name: "Toyota",
                },
              },
              trims: [
                {
                  id: 1,
                  carListings: [
                    {
                      id: 1,
                      images: [],
                    },
                  ],
                },
              ],
            },
            {
              id: 2,
              year: 2021,
              model: {
                name: "Civic",
                brand: {
                  name: "Honda",
                },
              },
              trims: [
                {
                  id: 2,
                  carListings: [
                    {
                      id: 2,
                      images: [],
                    },
                  ],
                },
              ],
            },
          ],
          meta: {
            page: 1,
            pageCount: 5,
            total: 40,
          },
        },
        isLoading: false,
        isError: false,
        error: null,
      });

      const { container } = render(
        <TestWrapper>
          <BrowsePage />
        </TestWrapper>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it("renders with filters applied snapshot", () => {
      mockUseBrandModels.mockReturnValue({
        data: {
          Toyota: ["Corolla", "Camry"],
        },
      });

      mockUseGetVersions.mockReturnValue({
        data: {
          data: [
            {
              id: 1,
              year: 2020,
              model: {
                name: "Corolla",
                brand: {
                  name: "Toyota",
                },
              },
              trims: [
                {
                  id: 1,
                  carListings: [
                    {
                      id: 1,
                      images: [],
                    },
                  ],
                },
              ],
            },
          ],
          meta: {
            page: 1,
            pageCount: 1,
            total: 1,
          },
        },
        isLoading: false,
        isError: false,
        error: null,
      });

      const { container } = render(
        <TestWrapper>
          <BrowsePage />
        </TestWrapper>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it("renders with multiple pages snapshot", () => {
      mockUseBrandModels.mockReturnValue({
        data: {
          Toyota: ["Corolla", "Camry"],
          Ford: ["Focus", "Mustang"],
        },
      });

      mockUseGetVersions.mockReturnValue({
        data: {
          data: [
            {
              id: 1,
              year: 2020,
              model: {
                name: "Corolla",
                brand: {
                  name: "Toyota",
                },
              },
              trims: [
                {
                  id: 1,
                  carListings: [
                    {
                      id: 1,
                      images: [],
                    },
                  ],
                },
              ],
            },
          ],
          meta: {
            page: 2,
            pageCount: 10,
            total: 80,
          },
        },
        isLoading: false,
        isError: false,
        error: null,
      });

      const { container } = render(
        <TestWrapper>
          <BrowsePage />
        </TestWrapper>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it("renders without brand models data snapshot", () => {
      mockUseBrandModels.mockReturnValue({
        data: undefined,
      });

      mockUseGetVersions.mockReturnValue({
        data: {
          data: [],
          meta: {
            page: 1,
            pageCount: 1,
            total: 0,
          },
        },
        isLoading: false,
        isError: false,
        error: null,
      });

      const { container } = render(
        <TestWrapper>
          <BrowsePage />
        </TestWrapper>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
