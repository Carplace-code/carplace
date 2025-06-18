"use client";

import { useGetCarListings } from "@/hooks/useCarListings";

import CarListingCard from "./CarListingCard";

export default function FeaturedListings() {
  const {
    data: carListings,
    isLoading,
    isError,
  } = useGetCarListings({
    include: {
      source: true,
      images: true,
      trim: true,
    },
    pageSize: 4,
    orderBy: { publishedAt: "desc" },
  });

  if (isLoading)
    return (
      <section className="px-6">
        <h2 className="mb-6 text-2xl font-semibold">Featured Cars</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={`skeleton-${index + 1}`} className="h-64 animate-pulse rounded-lg border bg-gray-200 p-4" />
          ))}
        </div>
      </section>
    );

  if (isError)
    return (
      <section className="px-6">
        <h2 className="mb-6 text-2xl font-semibold">Autos Destacados</h2>
        <div className="text-center text-gray-500">
          <p>Lo sentimos, no se pudieron cargar los autos destacados en este momento.</p>
          <p>Por favor, inténtalo de nuevo más tarde.</p>
        </div>
      </section>
    );

  return (
    <section className="flex flex-col items-center px-6" data-testid="featured-cars">
      <h2 className="mb-6 text-2xl font-semibold">Autos Destacados</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {carListings?.map((carListing) => <CarListingCard key={carListing.id} carListing={carListing} />)}
      </div>
    </section>
  );
}
