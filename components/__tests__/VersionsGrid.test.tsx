// components/__tests__/VersionsGrid.test.tsx
import { Decimal } from "@prisma/client/runtime/library";
import { describe, expect, it, vi } from "vitest";

import { renderWithQueryClient } from "@/utils/test-utils";

import type { MinimumGridVersion } from "../VersionCard";
import VersionsGrid from "../VersionsGrid";

// Mock de Clerk
vi.mock("@clerk/nextjs", () => ({
  useAuth: () => ({ isSignedIn: true }),
}));

describe("VersionsGrid", () => {
  it("renders a grid of version cards", () => {
    const mockVersions: MinimumGridVersion[] = [
      {
        id: "version-1",
        year: 2023,
        modelId: "model-1",
        model: {
          id: "model-1",
          name: "C200",
          bodyType: "sedan",
          brandId: "brand-1",
          brand: {
            id: "brand-1",
            name: "Mercedes-Benz",
          },
        },
        trims: [
          {
            id: "trim-1",
            name: "Base",
            motorSize: 2000,
            fuelType: "gas",
            transmissionType: "automatic",
            versionId: "version-1",
            carListings: [
              {
                id: "listing-1",
                sellerId: "seller-1",
                sourceId: "source-1",
                url: "https://example.com",
                title: "C200 2023",
                description: "En excelente estado",
                price: new Decimal(35990000),
                priceCurrency: "CLP",
                trimId: "trim-1",
                year: 2023,
                mileage: 10000,
                exteriorColor: "Silver",
                interiorColor: "Black",
                isNew: false,
                location: "Santiago",
                publishedAt: new Date(),
                scrapedAt: new Date(),
                images: [
                  {
                    id: "img-1",
                    url: "https://example.com/image.jpg",
                    listingId: "listing-1",
                  },
                ],
              },
            ],
          },
        ],
        wishlistItems: [],
      },
    ];

    const { container } = renderWithQueryClient(<VersionsGrid versions={mockVersions} />);
    expect(container).toMatchSnapshot();
  });

  it("renders message when no versions are available", () => {
    const { getByText } = renderWithQueryClient(<VersionsGrid versions={[]} />);
    expect(getByText("No hay versiones disponibles")).toBeInTheDocument();
  });
});
