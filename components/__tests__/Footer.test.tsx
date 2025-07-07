import { render } from "@testing-library/react";
import { describe, it } from "vitest";

import Footer from "../Footer";

describe("Footer", () => {
  it("renders correctly and matches snapshot", () => {
    const { container } = render(<Footer />);
    expect(container).toMatchSnapshot();
  });
});
