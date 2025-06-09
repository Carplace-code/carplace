import { render, waitFor } from "@testing-library/react";
import { expect, test, describe, vi, beforeEach } from "vitest";

import FeaturedCars from "@/components/FeaturedCars";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("FeaturedCars", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders loading state initially", () => {
    // Mock fetch to never resolve, keeping component in loading state
    mockFetch.mockImplementation(() => new Promise(() => {}));

    const { getByText, container } = render(<FeaturedCars />);

    expect(getByText("Featured Cars")).toBeTruthy();
    // Check for skeleton loading elements
    const skeletonElements = container.querySelectorAll(".animate-pulse");
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  test("renders cars successfully after fetch", async () => {
    const mockCarsData = {
      listings: [
        {
          id: "1",
          title: "Toyota Corolla 2020",
          price: 15000,
          mileage: 50000,
          images: [{ url: "https://example.com/image1.jpg" }],
          source: { name: "chileautos" },
          trim: {
            fuelType: "gasoline",
            version: {
              model: {
                brand: { name: "Toyota" },
                name: "Corolla",
              },
            },
          },
        },
        {
          id: "2",
          title: "Honda Civic 2019",
          price: 18000,
          mileage: 60000,
          images: [],
          source: { name: "yapo" },
          trim: {
            fuelType: "hybrid",
            version: {
              model: {
                brand: { name: "Honda" },
                name: "Civic",
              },
            },
          },
        },
      ],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockCarsData),
    });

    const { getByText, getByTestId } = render(<FeaturedCars />);

    await waitFor(() => {
      expect(getByTestId("featured-cars")).toBeTruthy();
    });

    expect(getByText("Toyota Corolla 2020")).toBeTruthy();
    expect(getByText("Honda Civic 2019")).toBeTruthy();
    expect(mockFetch).toHaveBeenCalledWith("/api/cars?limit=4");
  });

  test("handles fetch error gracefully", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const { getByText } = render(<FeaturedCars />);

    await waitFor(() => {
      expect(getByText("Unable to load featured cars. Please try again later.")).toBeTruthy();
    });

    expect(getByText("Network error")).toBeTruthy();
  });

  test("handles non-ok response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { getByText } = render(<FeaturedCars />);

    await waitFor(() => {
      expect(getByText("Unable to load featured cars. Please try again later.")).toBeTruthy();
    });

    expect(getByText("Failed to fetch cars")).toBeTruthy();
  });
});
