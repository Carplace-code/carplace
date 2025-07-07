// components/__tests__/SellerNotes.test.tsx
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import SellerNotes from "../SellerNotes";

describe("SellerNotes", () => {
  it("renders correctly and matches snapshot", () => {
    const { container } = render(<SellerNotes />);
    expect(container).toMatchSnapshot();
  });
});
