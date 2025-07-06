"use client";

import type { Prisma as P } from "@prisma/client";
import { useMemo, useState } from "react";

import ActiveFilters, { ActiveFilter } from "@/components/ActiveFilters";
import Pagination from "@/components/Pagination";
import SidebarFilters from "@/components/SidebarFilters";
import VersionsGrid from "@/components/VersionsGrid";
import { useBrandModels } from "@/hooks/useBrandModels";
import { useGetVersions } from "@/hooks/useVersions";
import { cn } from "@/utils/cn";

export default function BrowsePage() {
  // --- FILTER STATE ---
  const [filters, setFilters] = useState<{
    brand?: string[];
    model?: string[];
    year?: number[];
  }>({});

  // --- PAGINATION ---
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Brand -> models map
  // const brandModelsMap: Record<string, string[]> = {
  //   Toyota: ["Corolla", "Camry"],
  //   Ford: ["Focus", "Mustang"],
  //   Honda: ["Civic", "Accord"],
  // };

  const { data: brandModelsMap = {} } = useBrandModels();

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
            some: {},
          },
        },
      },
      // Filter by year, brand, model
      ...(filters.year && { year: { in: filters.year } }),
      ...(filters.brand && {
        model: {
          is: {
            brand: {
              is: {
                name: { in: filters.brand },
              },
            },
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
