import { render } from "@testing-library/react";
import { expect, test } from "vitest";

import CarDetailsPage from "@/app/cars/[id]/page";

test("CarsPage matches snapshot", () => {
  const { container } = render(<CarDetailsPage />);
  expect(container).toMatchSnapshot();
});
