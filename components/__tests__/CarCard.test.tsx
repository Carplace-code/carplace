import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import CarVersionCard from "@/components/VersionCard";

const mockCarProps = {
  id: "test-car-id",
  title: "Toyota Corolla 2024",
  price: "$18,990",
  platform: "Chileautos",
  km: "15,000 km",
  fuel: "Gas",
};

describe("CarCard", () => {
  test("renders CarCard with image", () => {
    const { container } = render(<CarVersionCard {...mockCarProps} imageUrl="https://example.com/car-image.jpg" />);

    expect(container).toMatchSnapshot();
  });

  test("renders CarCard without image (shows fallback)", () => {
    const { container, getByText } = render(<CarVersionCard {...mockCarProps} />);

    // Check that the "No Image" fallback is rendered
    expect(getByText("No Image")).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  test("renders CarCard with all required props", () => {
    const { getByText } = render(<CarVersionCard {...mockCarProps} />);

    expect(getByText("Toyota Corolla 2024")).toBeTruthy();
    expect(getByText("$18,990 • Chileautos")).toBeTruthy();
    expect(getByText("15,000 km • Gas")).toBeTruthy();
    expect(getByText("View Details")).toBeTruthy();
  });

  test("generates correct link href", () => {
    const { container } = render(<CarVersionCard {...mockCarProps} />);

    const link = container.querySelector('a[href="/cars/test-car-id"]');
    expect(link).toBeTruthy();
  });
});
