import { render } from "@testing-library/react";
import { expect, test } from "vitest";

import BrowsePage from "@/app/browse/page";

test("BrowsePage matches snapshot", () => {
  const { container } = render(<BrowsePage />);
  expect(container).toMatchSnapshot();
});
