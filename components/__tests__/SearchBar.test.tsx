import { fireEvent, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import SearchBar from "@/components/SearchBar";
import * as useVersions from "@/hooks/useVersions";
import { renderWithQueryClient } from "@/utils/test-utils";

vi.mock("@/hooks/useVersions");

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
}));

const mockData = {
  data: [
    {
      id: "1",
      year: 2020,
      model: {
        name: "Model S",
        brand: {
          name: "Tesla",
        },
      },
    },
    {
      id: "2",
      year: 2021,
      model: {
        name: "Model 3",
        brand: {
          name: "Tesla",
        },
      },
    },
    {
      id: "3",
      year: 2020,
      model: {
        name: "Civic",
        brand: {
          name: "Honda",
        },
      },
    },
  ],
};

describe("<SearchBar />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(useVersions, "useGetVersions").mockReturnValue({
      data: { data: mockData.data },
      isLoading: false,
      isError: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  });

  it("renders the input correctly", () => {
    renderWithQueryClient(<SearchBar />);
    const input = screen.getByPlaceholderText("Buscar por marca, modelo o año...");
    expect(input).toBeInTheDocument();
  });

  it("shows filtered results when typing a brand", async () => {
    renderWithQueryClient(<SearchBar />);

    const input = screen.getByPlaceholderText("Buscar por marca, modelo o año...");

    fireEvent.change(input, { target: { value: "Tesla" } });

    await waitFor(() => {
      const results = screen.getAllByText(/Tesla/);
      expect(results.length).toBeGreaterThan(0);
    });
  });

  it("shows no results when the search does not match", async () => {
    renderWithQueryClient(<SearchBar />);

    const input = screen.getByPlaceholderText("Buscar por marca, modelo o año...");
    fireEvent.change(input, { target: { value: "XYZ123" } });

    await waitFor(() => {
      expect(screen.getByText("No se encontraron versiones.")).toBeInTheDocument();
    });
  });

  it("clears the results when input is emptied", async () => {
    renderWithQueryClient(<SearchBar />);

    const input = screen.getByPlaceholderText("Buscar por marca, modelo o año...");
    fireEvent.change(input, { target: { value: "Tesla" } });

    await waitFor(() => {
      const results = screen.getAllByText(/Tesla/);
      expect(results.length).toBeGreaterThan(0);
    });

    fireEvent.change(input, { target: { value: "" } });

    await waitFor(() => {
      expect(screen.queryByText(/Tesla/)).toBeNull();
    });
  });
  it("matches the snapshot", () => {
    const { container } = renderWithQueryClient(<SearchBar />);
    expect(container).toMatchSnapshot();
  });

  it("clears search on Escape key press", async () => {
    renderWithQueryClient(<SearchBar />);
    const input = screen.getByPlaceholderText("Buscar por marca, modelo o año...");
    fireEvent.change(input, { target: { value: "Civic" } });

    fireEvent.keyDown(input, { key: "Escape", code: "Escape" });

    await waitFor(() => {
      expect(input).toHaveValue("");
      expect(screen.queryByText(/Civic/)).toBeNull();
    });
  });

  it("shows results on input focus if searchQuery has value", async () => {
    renderWithQueryClient(<SearchBar />);
    const input = screen.getByPlaceholderText("Buscar por marca, modelo o año...");
    fireEvent.change(input, { target: { value: "Honda" } });

    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByText("Honda Civic 2020")).toBeInTheDocument();
    });
  });

  it("handles missing data gracefully", () => {
    vi.spyOn(useVersions, "useGetVersions").mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    renderWithQueryClient(<SearchBar />);
    const input = screen.getByPlaceholderText("Buscar por marca, modelo o año...");
    expect(input).toBeInTheDocument();
  });
});
