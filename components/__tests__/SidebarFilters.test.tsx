// components/__tests__/SidebarFilters.test.tsx
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import SidebarFilters from "../SidebarFilters";

describe("SidebarFilters", () => {
  it("renders correctly and matches snapshot", () => {
    const mockOnChange = vi.fn();

    const { container } = render(
      <SidebarFilters
        filters={{ brand: ["Toyota"], model: ["Corolla"], year: [2020] }}
        onChange={mockOnChange}
        brandOptions={["Toyota", "Hyundai"]}
        modelOptions={["Corolla", "Elantra"]}
        yearOptions={[2020, 2021]}
      />,
    );

    expect(container).toMatchSnapshot();
  });
});
