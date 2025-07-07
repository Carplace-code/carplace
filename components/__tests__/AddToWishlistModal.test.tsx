import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { describe, it, vi } from "vitest";

import AddToWishlistModal from "../AddToWishlistModal";

// Mock hooks
vi.mock("@/hooks/useWishlists", () => ({
  useGetWishlists: () => ({
    data: [],
    isLoading: false,
  }),
  useCreateWishlist: () => ({ mutate: vi.fn() }),
  useAddToWishlist: () => ({ mutate: vi.fn() }),
  useRemoveFromWishlist: () => ({ mutate: vi.fn() }),
}));

// Setup wrapper
const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("AddToWishlistModal", () => {
  it("renders correctly and matches snapshot", () => {
    const { container } = render(<AddToWishlistModal versionId="v123" />, { wrapper });
    expect(container).toMatchSnapshot();
  });
});
