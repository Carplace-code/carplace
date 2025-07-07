// app/__tests__/HomePage.test.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { vi } from "vitest";

import HomePage from "@/app/page";

vi.mock("@/hooks/useCarListings", () => ({
  useGetCarListings: () => ({
    data: [
      {
        id: "1",
        title: "Toyota Yaris 2020",
        source: { name: "Chileautos" },
        images: [{ url: "/car1.jpg" }],
        trim: { name: "Sport", fuelType: "gasoline", versionId: "123" },
        price: 8900000,
        mileage: 45000,
      },
    ],
    isLoading: false,
    isError: false,
  }),
}));

describe("HomePage", () => {
  it("renders correctly and matches snapshot", () => {
    const queryClient = new QueryClient();

    const { asFragment } = render(
      <QueryClientProvider client={queryClient}>
        <HomePage />
      </QueryClientProvider>,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
