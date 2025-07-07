import { render } from "@testing-library/react";
import { describe, it, vi } from "vitest";

import CarHeader from "../CarHeader";

// Mock AddToWishlistModal
vi.mock("../AddToWishlistModal", () => ({
  default: ({ versionId }: { versionId: string }) => <div data-testid="mock-wishlist">Mock Modal for {versionId}</div>,
}));

describe("CarHeader", () => {
  it("renders correctly and matches snapshot", () => {
    const { container } = render(<CarHeader carId="car_123" />);
    expect(container).toMatchSnapshot();
  });
});
