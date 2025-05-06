import { render } from "@testing-library/react";
import { expect, test } from "vitest";

import { Button } from "../button";

test("Button matches snapshot", () => {
  const { container } = render(<Button />);
  expect(container).toMatchSnapshot();
});
