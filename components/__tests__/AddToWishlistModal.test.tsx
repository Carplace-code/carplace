import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, it, vi } from "vitest";

import AddToWishlistModal from "../AddToWishlistModal";

// Mutate mocks (compartidos)
const mockCreateWishlist = vi.fn();
const mockAddToWishlist = vi.fn();
const mockRemoveFromWishlist = vi.fn();

const mockWishlist = {
  id: "w1",
  name: "Favoritos",
  description: "Mis autos favoritos",
  items: [{ versionId: "v123" }],
};

// ✅ Todos los mocks deben estar dentro del factory para evitar errores de hoisting
vi.mock("@/hooks/useWishlists", () => ({
  useGetWishlists: vi.fn(() => ({
    data: [mockWishlist],
    isLoading: false,
  })),
  useCreateWishlist: vi.fn(() => ({ mutate: mockCreateWishlist })),
  useAddToWishlist: vi.fn(() => ({ mutate: mockAddToWishlist })),
  useRemoveFromWishlist: vi.fn(() => ({ mutate: mockRemoveFromWishlist })),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("AddToWishlistModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly and matches snapshot", () => {
    const { container } = render(<AddToWishlistModal versionId="v123" />, { wrapper });
    expect(container).toMatchSnapshot();
  });

  it("removes item from wishlist if already present", async () => {
    render(<AddToWishlistModal versionId="v123" />, { wrapper });

    const heartButton = screen.getByRole("button");
    fireEvent.click(heartButton);

    await waitFor(() => {
      expect(mockRemoveFromWishlist).toHaveBeenCalledWith(
        { wishlistId: "w1", versionId: "v123" },
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        }),
      );
    });
  });

  it("creates new wishlist and adds version", async () => {
    // Simula la respuesta exitosa de crear
    mockCreateWishlist.mockImplementation(({ name, description }, { onSuccess }) => {
      onSuccess({ id: "new-id", name, description });
    });

    render(<AddToWishlistModal versionId="v999" />, { wrapper });

    fireEvent.click(screen.getByRole("button")); // abre modal

    fireEvent.change(screen.getByPlaceholderText("Nombre"), { target: { value: "Nueva" } });
    fireEvent.change(screen.getByPlaceholderText("Descripción"), { target: { value: "Mi lista" } });

    fireEvent.click(screen.getByText("Crear y añadir"));

    await waitFor(() => {
      expect(mockCreateWishlist).toHaveBeenCalled();
      expect(mockAddToWishlist).toHaveBeenCalledWith(
        { wishlistId: "new-id", versionId: "v999" },
        expect.objectContaining({ onSuccess: expect.any(Function) }),
      );
    });
  });
});
