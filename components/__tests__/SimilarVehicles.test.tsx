// components/__tests__/SimilarVehicles.test.tsx
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import SimilarVehicles from "../SimilarVehicles";

describe("SimilarVehicles", () => {
  it("renders correctly and matches snapshot", () => {
    const { container } = render(<SimilarVehicles />);
    expect(container).toMatchSnapshot();
  });
});
