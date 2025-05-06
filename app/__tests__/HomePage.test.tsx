import { render } from "@testing-library/react";
import { expect, test } from "vitest";

import HomePage from "@/app/page";

test("HomePage matches snapshot", () => {
  const { container } = render(<HomePage />);
  expect(container).toMatchSnapshot();
});
