import { render } from "@testing-library/react";
import { describe, it } from "vitest";

import MarketListings from "../MarketListings";

describe("MarketListings", () => {
  it("renders correctly and matches snapshot", () => {
    const { container } = render(<MarketListings />);
    expect(container).toMatchSnapshot();
  });
});
