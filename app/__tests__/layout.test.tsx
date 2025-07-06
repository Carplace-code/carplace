import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import RootLayout from "../layout";

// Mock next/font/google
vi.mock("next/font/google", () => ({
  Inter: () => ({ className: "mock-font" }),
}));

// Mock de componentes usados en el layout
vi.mock("@/components/Navbar", () => ({
  __esModule: true,
  default: () => <nav data-testid="navbar">Navbar</nav>,
}));

vi.mock("@/components/Footer", () => ({
  __esModule: true,
  default: () => <footer data-testid="footer">Footer</footer>,
}));

vi.mock("@/components/ui/sonner", () => ({
  Toaster: () => <div data-testid="toaster">Toaster</div>,
}));

vi.mock("providers/AuthenticationProvider", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("providers/QueryClientProvider", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("@clerk/nextjs", () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe("RootLayout", () => {
  it("renders layout and children", () => {
    render(
      <RootLayout>
        <div>Test content</div>
      </RootLayout>,
    );

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(screen.getByTestId("toaster")).toBeInTheDocument();
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });
});
