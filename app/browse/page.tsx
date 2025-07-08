"use client";

import type { Prisma as P } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import ActiveFilters, { ActiveFilter } from "@/components/ActiveFilters";
import Pagination from "@/components/Pagination";
import SidebarFilters from "@/components/SidebarFilters";
import VersionsGrid from "@/components/VersionsGrid";
import { useBrandModels } from "@/hooks/useBrandModels";
import { useGetVersions } from "@/hooks/useVersions";
import { cn } from "@/utils/cn";

export default function BrowsePage() {
  const searchParams = useSearchParams();

  // --- FILTER STATE ---
  const [filters, setFilters] = useState<{
    brand?: string[];
    model?: string[];
    year?: number[];
    bodyType?: string[];
    minPrice?: number;
    maxPrice?: number;
  }>({});

  // --- PAGINATION ---
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Brand -> models map
  const { data: brandModelsMap = {} } = useBrandModels();

  // Leer filtros de la URL al cargar la página
  useEffect(() => {
    const urlFilters: typeof filters = {};

    // Leer parámetros de la URL
    const brand = searchParams.get("brand");
    const bodyType = searchParams.get("bodyType");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    if (brand) {
      urlFilters.brand = [brand];
    }
    if (bodyType) {
      urlFilters.bodyType = [bodyType];
    }
    if (minPrice) {
      urlFilters.minPrice = parseInt(minPrice, 10);
    }
    if (maxPrice) {
      urlFilters.maxPrice = parseInt(maxPrice, 10);
    }

    setFilters(urlFilters);
  }, [searchParams]);

  // Opciones de tipos de vehículo para mostrar etiquetas en español
  const vehicleTypeLabels: Record<string, string> = {
    sedan: "Sedán",
    suv: "SUV",
    hatchback: "Hatchback",
    coupe: "Coupé",
    convertible: "Convertible",
    wagon: "Station Wagon",
    van: "Van",
    truck: "Camioneta",
    other: "Otro",
  };

  const modelOptions = useMemo(() => {
    if (!filters.brand?.length) return [];
    return Array.from(new Set(filters.brand.flatMap((b) => brandModelsMap[b] || [])));
  }, [filters.brand, brandModelsMap]);

  // Prisma filtering logic
  const where = useMemo<P.VersionWhereInput>(
    () => ({
      // Always include trims with at least one car listing
      trims: {
        some: {
          carListings: {
            some: {
              // Filtro de precio
              ...(filters.minPrice && { price: { gte: filters.minPrice } }),
              ...(filters.maxPrice && { price: { lte: filters.maxPrice } }),
            },
          },
        },
      },
      // Filter by year, brand, model, bodyType
      ...(filters.year && { year: { in: filters.year } }),
      ...(filters.brand && {
        model: {
          is: {
            brand: {
              is: {
                name: { in: filters.brand },
              },
            },
            // Filtro por tipo de vehículo (bodyType)
            ...(filters.bodyType && { bodyType: { in: filters.bodyType } }),
          },
        },
      }),
      ...(filters.model && {
        model: {
          is: {
            name: { in: filters.model },
          },
        },
      }),
    }),
    [filters],
  );

  const {
    data: result,
    isLoading,
    isError,
    error,
  } = useGetVersions({
    where,
    page,
    pageSize,
    include: {
      model: {
        include: {
          brand: true,
        },
      },
      trims: {
        where: {
          carListings: {
            some: {
              // Filtro de precio también en los trims
              ...(filters.minPrice && { price: { gte: filters.minPrice } }),
              ...(filters.maxPrice && { price: { lte: filters.maxPrice } }),
            },
          },
        },
        include: {
          carListings: {
            take: 1,
            where: {
              // Filtro de precio en carListings
              ...(filters.minPrice && { price: { gte: filters.minPrice } }),
              ...(filters.maxPrice && { price: { lte: filters.maxPrice } }),
            },
            include: {
              images: true,
            },
          },
        },
      },
      wishlistItems: true,
    },
  });

  const versions = useMemo(() => result?.data ?? [], [result]);
  const meta = useMemo(() => result?.meta, [result]);

  // Active filters
  const activeFilters: ActiveFilter[] = [];
  if (filters.brand?.length) {
    activeFilters.push({
      label: `Brand: ${filters.brand.join(", ")}`,
      onRemove: () => setFilters((f) => ({ ...f, brand: undefined })),
    });
  }
  if (filters.model?.length) {
    activeFilters.push({
      label: `Model: ${filters.model.join(", ")}`,
      onRemove: () => setFilters((f) => ({ ...f, model: undefined })),
    });
  }
  if (filters.year?.length) {
    activeFilters.push({
      label: `Year: ${filters.year.join(", ")}`,
      onRemove: () => setFilters((f) => ({ ...f, year: undefined })),
    });
  }
  if (filters.bodyType?.length) {
    const labels = filters.bodyType.map((type) => vehicleTypeLabels[type] || type);
    activeFilters.push({
      label: `Vehicle Type: ${labels.join(", ")}`,
      onRemove: () => setFilters((f) => ({ ...f, bodyType: undefined })),
    });
  }
  if (filters.minPrice) {
    activeFilters.push({
      label: `Min Price: $${filters.minPrice.toLocaleString()}`,
      onRemove: () => setFilters((f) => ({ ...f, minPrice: undefined })),
    });
  }
  if (filters.maxPrice) {
    activeFilters.push({
      label: `Max Price: $${filters.maxPrice.toLocaleString()}`,
      onRemove: () => setFilters((f) => ({ ...f, maxPrice: undefined })),
    });
  }

  return (
    <div className="flex w-full flex-grow flex-col px-6 py-4 lg:px-12">
      <ActiveFilters filters={activeFilters} onClear={() => setFilters({})} />
      <div className="mt-6 flex flex-grow gap-8">
        <aside className="hidden w-64 flex-shrink-0 rounded-lg p-4 shadow-sm lg:block">
          <SidebarFilters
            filters={filters}
            onChange={(field, value) => setFilters((f) => ({ ...f, [field]: value }))}
            brandOptions={Object.keys(brandModelsMap)}
            modelOptions={modelOptions}
            yearOptions={[...Array(35).keys()].map((i) => i + 1990)}
          />
        </aside>
        <div
          className={cn(
            "flex max-h-full flex-1 flex-grow flex-col justify-between",
            "overflow-x-hidden rounded-lg p-4 shadow-sm",
          )}
        >
          {isLoading && <div>Cargando...</div>}
          {isError && <div>Error al cargar las versiones.{JSON.stringify(error)}</div>}
          {!isLoading && !isError && meta && <VersionsGrid versions={versions} />}
          <Pagination page={meta?.page || 1} pageCount={meta?.pageCount || 1} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
