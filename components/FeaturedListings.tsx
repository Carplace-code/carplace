"use client";

import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";

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
    pageSize: 8,
    orderBy: { publishedAt: "desc" },
  });

  if (isLoading)
    return (
      <section className="bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">Autos Destacados</h2>
            <div className="mx-auto h-1 w-20 bg-blue-600" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={`skeleton-${index + 1}`} className="h-80 animate-pulse rounded-xl border bg-gray-200" />
            ))}
          </div>
        </div>
      </section>
    );

  if (isError)
    return (
      <section className="bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">Autos Destacados</h2>
            <div className="mx-auto h-1 w-20 bg-blue-600" />
          </div>
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <span className="text-2xl">😔</span>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">¡Ups! Algo salió mal</h3>
            <p className="text-gray-600">No pudimos cargar los autos destacados en este momento.</p>
            <p className="text-gray-600">Por favor, inténtalo nuevamente más tarde.</p>
          </div>
        </div>
      </section>
    );

  return (
    <section className="bg-gray-50 px-6 py-16" data-testid="featured-cars">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Star className="h-6 w-6 fill-current text-yellow-500" />
            <h2 className="text-3xl font-bold text-gray-900">Autos Destacados</h2>
            <Star className="h-6 w-6 fill-current text-yellow-500" />
          </div>
          <div className="mx-auto h-1 w-20 bg-gradient-to-r from-blue-600 to-purple-600" />
          <p className="mt-4 text-lg text-gray-600">Descubre las mejores ofertas seleccionadas especialmente para ti</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {carListings?.map((carListing) => <CarListingCard key={carListing.id} carListing={carListing} />)}
        </div>

        {/* Call to action */}
        <div className="mt-12 text-center">
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
          >
            Ver Todos los Autos
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="mb-2 font-semibold text-gray-900">Búsqueda Inteligente</h3>
            <p className="text-sm text-gray-600">Encuentra el auto perfecto con nuestros filtros avanzados</p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="mb-2 font-semibold text-gray-900">Información Verificada</h3>
            <p className="text-sm text-gray-600">Todos los anuncios son verificados y actualizados constantemente</p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="mb-2 font-semibold text-gray-900">Mejores Precios</h3>
            <p className="text-sm text-gray-600">Compara precios de múltiples plataformas al instante</p>
          </div>
        </div>
      </div>
    </section>
  );
}
