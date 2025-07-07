// components/__tests__/Pagination.test.tsx
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Pagination from "../Pagination";

describe("Pagination", () => {
  it("renders correctly and matches snapshot", () => {
    const onPageChange = vi.fn();
    const { container } = render(<Pagination page={2} pageCount={5} onPageChange={onPageChange} />);
    expect(container).toMatchSnapshot();
  });
});
