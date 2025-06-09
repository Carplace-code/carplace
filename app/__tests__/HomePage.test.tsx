import { render, waitFor } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";

import HomePage from "@/app/page";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  vi.clearAllMocks();

  // Mock successful API response
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => ({
      listings: [
        {
          id: "1",
          title: "Toyota Corolla 2024",
          price: 18990,
          mileage: 15000,
          images: [{ url: "https://example.com/car1.jpg" }],
          source: { name: "chileautos" },
          trim: {
            fuelType: "gas",
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
          title: "Honda Civic 2023",
          price: 16500,
          mileage: 25000,
          images: [{ url: "https://example.com/car2.jpg" }],
          source: { name: "yapo" },
          trim: {
            fuelType: "gas",
            version: {
              model: {
                brand: { name: "Honda" },
                name: "Civic",
              },
            },
          },
        },
      ],
    }),
  });
});

test("HomePage matches snapshot", async () => {
  const { container } = render(<HomePage />);

  // Wait for the async fetch to complete
  await waitFor(() => {
    expect(mockFetch).toHaveBeenCalledWith("/api/cars?limit=4");
  });

  // Wait a bit more for state updates to complete
  await waitFor(
    () => {
      expect(container.querySelector('[data-testid="featured-cars"]')).toBeTruthy();
    },
    { timeout: 1000 },
  );

  expect(container).toMatchSnapshot();
});
