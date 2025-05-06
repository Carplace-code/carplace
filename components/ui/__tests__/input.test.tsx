import { render } from "@testing-library/react";
import { expect, test } from "vitest";

import { Input } from "../input";

test("Input matches snapshot", () => {
  const { container } = render(<Input />);
  expect(container).toMatchSnapshot();
});
