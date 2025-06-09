import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { Button } from "../button";

describe("Button", () => {
  test("Button matches snapshot", () => {
    const { container } = render(<Button />);
    expect(container).toMatchSnapshot();
  });

  test("Button with asChild=true renders as Slot", () => {
    const { container } = render(<Button asChild>Button content</Button>);
    expect(container).toMatchSnapshot();
  });
});
