// components/__tests__/PriceHistory.test.tsx
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PriceHistory from "../PriceHistory";

describe("PriceHistory", () => {
  it("renders correctly and matches snapshot", () => {
    const { container } = render(<PriceHistory />);
    expect(container).toMatchSnapshot();
  });
});
