import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ActiveFilters, { type ActiveFilter } from "@/components/ActiveFilters";

describe("ActiveFilters", () => {
  it("renders correctly with filters", () => {
    const onClear = vi.fn();
    const filters: ActiveFilter[] = [
      { label: "Brand: Toyota", onRemove: vi.fn() },
      { label: "Year: 2020", onRemove: vi.fn() },
    ];

    const { container } = render(<ActiveFilters filters={filters} onClear={onClear} />);
    expect(container).toMatchSnapshot();
  });

  it("renders nothing when no filters are present", () => {
    const onClear = vi.fn();
    const filters: ActiveFilter[] = [];

    const { container } = render(<ActiveFilters filters={filters} onClear={onClear} />);
    expect(container).toMatchSnapshot();
  });
});
