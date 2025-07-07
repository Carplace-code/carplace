import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import CarDetailsPage from "@/app/versions/[id]/page"; // ajusta esta ruta según tu estructura

// Mock de los componentes hijos
vi.mock("@/components/CarHeader", () => ({
  default: () => <div>CarHeader</div>,
}));
vi.mock("@/components/CarSpecs", () => ({
  default: () => <div>CarSpecs</div>,
}));
vi.mock("@/components/SellerNotes", () => ({
  default: () => <div>SellerNotes</div>,
}));
vi.mock("@/components/MarketListings", () => ({
  default: () => <div>MarketListings</div>,
}));
vi.mock("@/components/PriceHistory", () => ({
  default: () => <div>PriceHistory</div>,
}));
vi.mock("@/components/SimilarVehicles", () => ({
  default: () => <div>SimilarVehicles</div>,
}));

describe("CarDetailsPage", () => {
  it("should match snapshot", async () => {
    const params = Promise.resolve({ id: "123" });
    const { container } = render(<CarDetailsPage params={params} />);
    // esperar a que el componente resuelva la promesa
    await params;

    expect(container).toMatchSnapshot();
  });
});
