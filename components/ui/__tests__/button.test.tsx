import { render } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { expect, test } from "vitest";

import { Button } from "../button";

test("Button matches snapshot", async () => {
  let container: HTMLElement | undefined;
  await act(async () => {
    const result = render(<Button />);
    container = result.container;
  });
  if (!container) throw new Error("Container was not set by render");
  expect(container).toMatchSnapshot();
});
