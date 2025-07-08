/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Import the mocked hooks after they're defined
import { useBrandModels } from "@/hooks/useBrandModels";
import { useGetVersions } from "@/hooks/useVersions";

import BrowsePage from "../browse/page";

// Mock de Next.js navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(() => null),
    has: vi.fn(() => false),
    toString: vi.fn(() => ""),
    entries: vi.fn(() => []),
    forEach: vi.fn(),
    getAll: vi.fn(() => []),
    keys: vi.fn(() => []),
    values: vi.fn(() => []),
  }),
}));

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

    // Look for the Spanish loading text
    expect(screen.getByText("Cargando...")).toBeInTheDocument();
  });

  it("renders success state with empty data", () => {
    mockUseBrandModels.mockReturnValue({
      data: { Toyota: ["Corolla"], Honda: ["Civic"] },
    });

    mockUseGetVersions.mockReturnValue({
      data: { data: [], meta: { page: 1, pageCount: 1 } },
      isLoading: false,
      isError: false,
      error: null,
    });

    render(
      <TestWrapper>
        <BrowsePage />
      </TestWrapper>,
    );

    expect(screen.getByTestId("versions-grid")).toBeInTheDocument();
    expect(screen.getByTestId("pagination")).toBeInTheDocument();
  });

  it("renders success state with data", () => {
    mockUseBrandModels.mockReturnValue({
      data: { Toyota: ["Corolla"], Honda: ["Civic"] },
    });

    mockUseGetVersions.mockReturnValue({
      data: {
        data: [{ id: "1", year: 2020, model: { name: "Corolla", brand: { name: "Toyota" } } }],
        meta: { page: 1, pageCount: 1 },
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

    expect(screen.getByTestId("versions-grid")).toBeInTheDocument();
    expect(screen.getByTestId("pagination")).toBeInTheDocument();
  });

  it("renders with multiple pages", () => {
    mockUseBrandModels.mockReturnValue({
      data: { Toyota: ["Corolla"] },
    });

    mockUseGetVersions.mockReturnValue({
      data: {
        data: [{ id: "1", year: 2020, model: { name: "Corolla", brand: { name: "Toyota" } } }],
        meta: { page: 1, pageCount: 5 },
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

    expect(screen.getByTestId("pagination")).toBeInTheDocument();
  });

  it("renders without brand models data", () => {
    mockUseBrandModels.mockReturnValue({
      data: undefined,
    });

    mockUseGetVersions.mockReturnValue({
      data: { data: [], meta: { page: 1, pageCount: 1 } },
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
  });

  it("renders with filters applied", () => {
    mockUseBrandModels.mockReturnValue({
      data: { Toyota: ["Corolla"], Honda: ["Civic"] },
    });

    mockUseGetVersions.mockReturnValue({
      data: { data: [], meta: { page: 1, pageCount: 1 } },
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
  });

  // Snapshots section
  describe("Snapshots", () => {
    it("renders loading state snapshot", () => {
      mockUseBrandModels.mockReturnValue({ data: {} });
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

      expect(container).toMatchSnapshot();
    });

    it("renders error state snapshot", () => {
      mockUseBrandModels.mockReturnValue({ data: {} });
      mockUseGetVersions.mockReturnValue({
        data: null,
        isLoading: false,
        isError: true,
        error: new Error("Test error"),
      });

      const { container } = render(
        <TestWrapper>
          <BrowsePage />
        </TestWrapper>,
      );

      expect(container).toMatchSnapshot();
    });

    it("renders success state with empty data snapshot", () => {
      mockUseBrandModels.mockReturnValue({ data: { Toyota: ["Corolla"] } });
      mockUseGetVersions.mockReturnValue({
        data: { data: [], meta: { page: 1, pageCount: 1 } },
        isLoading: false,
        isError: false,
        error: null,
      });

      const { container } = render(
        <TestWrapper>
          <BrowsePage />
        </TestWrapper>,
      );

      expect(container).toMatchSnapshot();
    });

    it("renders success state with data snapshot", () => {
      mockUseBrandModels.mockReturnValue({ data: { Toyota: ["Corolla"] } });
      mockUseGetVersions.mockReturnValue({
        data: {
          data: [{ id: "1", year: 2020, model: { name: "Corolla", brand: { name: "Toyota" } } }],
          meta: { page: 1, pageCount: 1 },
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

      expect(container).toMatchSnapshot();
    });

    it("renders with filters applied snapshot", () => {
      mockUseBrandModels.mockReturnValue({ data: { Toyota: ["Corolla"] } });
      mockUseGetVersions.mockReturnValue({
        data: { data: [], meta: { page: 1, pageCount: 1 } },
        isLoading: false,
        isError: false,
        error: null,
      });

      const { container } = render(
        <TestWrapper>
          <BrowsePage />
        </TestWrapper>,
      );

      expect(container).toMatchSnapshot();
    });

    it("renders with multiple pages snapshot", () => {
      mockUseBrandModels.mockReturnValue({ data: { Toyota: ["Corolla"] } });
      mockUseGetVersions.mockReturnValue({
        data: {
          data: [{ id: "1", year: 2020, model: { name: "Corolla", brand: { name: "Toyota" } } }],
          meta: { page: 1, pageCount: 5 },
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

      expect(container).toMatchSnapshot();
    });

    it("renders without brand models data snapshot", () => {
      mockUseBrandModels.mockReturnValue({ data: undefined });
      mockUseGetVersions.mockReturnValue({
        data: { data: [], meta: { page: 1, pageCount: 1 } },
        isLoading: false,
        isError: false,
        error: null,
      });

      const { container } = render(
        <TestWrapper>
          <BrowsePage />
        </TestWrapper>,
      );

      expect(container).toMatchSnapshot();
    });
  });
});
