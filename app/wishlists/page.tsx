// src/app/wishlists/page.tsx

"use client";

import VersionCard from "@/components/VersionCard";
import { useGetWishlists } from "@/hooks/useWishlists";

export default function WishlistsPage() {
  const {
    data: wishlists,
    isLoading,
    isError,
  } = useGetWishlists({
    include: {
      items: {
        include: {
          version: {
            include: {
              model: {
                include: {
                  brand: true,
                },
              },
              trims: {
                where: {
                  carListings: {
                    some: {},
                  },
                },
                include: {
                  carListings: {
                    take: 1,
                    include: {
                      images: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (isLoading || !wishlists)
    return (
      <div className="px-6 py-8 text-center">
        <p className="text-gray-500">Cargando tus listas de deseos...</p>
      </div>
    );

  if (isError)
    return (
      <div className="px-6 py-8 text-center text-red-500">
        <p>Error cargando tus listas de deseos</p>
      </div>
    );

  return (
    <div className="px-6 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Mis listas de deseos</h1>

      <div className="flex max-h-[calc(100vh-320px)] flex-col overflow-y-auto rounded-lg border bg-white p-4 shadow-sm">
        {wishlists.length === 0 ? (
          <p className="text-gray-500">Aún no tienes listas de deseos.</p>
        ) : (
          wishlists.map((wishlist) => (
            <div key={wishlist.id} className="mt-8">
              <h2 className="text-lg font-semibold">{wishlist.name}</h2>
              <p className="mt-1 text-sm text-gray-600">{wishlist.description ?? "-"}</p>
              <div className="my-2 h-px border-t border-gray-200" />
              <div className="flex w-full flex-wrap gap-4">
                {wishlist.items.map(({ id, version }) => (version ? <VersionCard key={id} version={version} /> : null))}
                {wishlist.items.length === 0 && (
                  <p className="mt-4 text-gray-500">Aún no tienes autos en esta lista.</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
