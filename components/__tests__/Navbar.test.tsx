import { describe, it, vi } from "vitest";

import { renderWithQueryClient } from "@/utils/test-utils";

import Navbar from "../Navbar";

// Mock Clerk components
vi.mock("@clerk/nextjs", () => ({
  SignedIn: ({ children }: { children: React.ReactNode }) => children,
  SignedOut: ({ children }: { children: React.ReactNode }) => children,
  SignInButton: ({ children }: { children: React.ReactNode }) => <button type="button">{children}</button>,
  SignUpButton: ({ children }: { children: React.ReactNode }) => <button type="button">{children}</button>,

  UserButton: () => <div>User</div>,
}));

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Car: () => <div>CarIcon</div>,
  Heart: () => <div>HeartIcon</div>,
  LineChart: () => <div>LineChartIcon</div>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Menu: (props: any) => <div {...props}>MenuIcon</div>,
  Search: () => <div>SearchIcon</div>,
}));

describe("Navbar", () => {
  it("renders correctly and matches snapshot", () => {
    const { container } = renderWithQueryClient(<Navbar />);
    expect(container).toMatchSnapshot();
  });
});
