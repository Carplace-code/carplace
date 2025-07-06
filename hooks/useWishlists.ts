import { Prisma, Wishlist } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axios from "@/lib/axios";

type WishlistWithInclude<TInclude extends Prisma.WishlistInclude> = Prisma.WishlistGetPayload<{
  include: TInclude;
}>;

interface UseGetWishlistOptions<TInclude extends Prisma.WishlistInclude> {
  include?: TInclude;
}

export function useGetWishlists<TInclude extends Prisma.WishlistInclude>(
  { versionId, enabled, include }: { versionId?: string; enabled?: boolean } & UseGetWishlistOptions<TInclude> = {
    enabled: true,
  },
) {
  return useQuery<WishlistWithInclude<TInclude>[], Error>({
    queryKey: ["wishlists", versionId, include],
    queryFn: () =>
      axios
        .get("/wishlists", { params: { versionId, include: include ? JSON.stringify(include) : undefined } })
        .then((res) => res.data),
    enabled,
  });
}

export function useGetWishlist({ wishlistId }: { wishlistId: string }) {
  return useQuery<Wishlist, Error>({
    queryKey: ["wishlist", wishlistId],
    queryFn: () => axios.get(`/wishlists/${wishlistId}`).then((res) => res.data),
  });
}

export function useCreateWishlist() {
  const qc = useQueryClient();

  return useMutation<Wishlist, Error, Pick<Wishlist, "name" | "description">>({
    mutationFn: (newWishlist) => axios.post<Wishlist>("/wishlists", newWishlist).then((res) => res.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wishlists"] });
    },
    onError: () => {},
  });
}
export function useUpdateWishlist() {
  const qc = useQueryClient();

  return useMutation<Wishlist, Error, Pick<Wishlist, "id"> & Partial<Pick<Wishlist, "name" | "description">>>({
    mutationFn: (wishlistUpdates) =>
      axios.patch(`/wishlists/${wishlistUpdates.id}`, wishlistUpdates).then((res) => res.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wishlists"] });
    },
    onError: () => {},
  });
}

export function useDeleteWishlist() {
  const qc = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (wishlistId) => axios.delete(`/wishlists/${wishlistId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wishlists"] });
    },
    onError: () => {},
  });
}

export function useAddToWishlist() {
  const qc = useQueryClient();

  return useMutation<Wishlist, Error, { wishlistId: string; versionId: string }>({
    mutationFn: ({ wishlistId, versionId }) =>
      axios.post(`/wishlists/${wishlistId}/versions`, { versionId }).then((res) => res.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wishlists"] });
    },
    onError: () => {},
  });
}

export function useRemoveFromWishlist() {
  const qc = useQueryClient();

  return useMutation<void, Error, { wishlistId: string; versionId: string }>({
    mutationFn: ({ wishlistId, versionId }) => axios.delete(`/wishlists/${wishlistId}/versions/${versionId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wishlists"] });
    },
    onError: () => {},
  });
}
