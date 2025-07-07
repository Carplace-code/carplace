import { render } from "@testing-library/react";
import { describe, it } from "vitest";

import CarSpecs from "../CarSpecs";

describe("CarSpecs", () => {
  it("renders correctly and matches snapshot", () => {
    const { container } = render(<CarSpecs />);
    expect(container).toMatchSnapshot();
  });
});
