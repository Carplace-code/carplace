/* eslint-disable */
"use client"

import type { BodyType, Prisma as P } from "@prisma/client"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useMemo, useState } from "react"

import ActiveFilters, { type ActiveFilter } from "@/components/ActiveFilters"
import PaginationComponent from "@/components/Pagination"
import SidebarFilters from "@/components/SidebarFilters"
import VersionsGrid from "@/components/VersionsGrid"
import VersionsGridSkeleton from "@/components/VersionsGridSkeleton"
import { useAvailableFilters } from "@/hooks/useAvailableFilters"
import { useBrandModels } from "@/hooks/useBrandModels"
import { useGetVersions } from "@/hooks/useVersions"
import { cn } from "@/utils/cn"

function BrowsePageContent() {
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState<{
    brand?: string[]
    model?: string[]
    year?: number[]
    bodyType?: BodyType[]
    minPrice?: number
    maxPrice?: number
  }>({})

  const [page, setPage] = useState(1)
  const pageSize = 8 // solo para mostrar en frontend

  const { data: brandModelsMap = {} } = useBrandModels()

  useEffect(() => {
    if (!searchParams) return

    const urlFilters: typeof filters = {}

    const brand = searchParams.get("brand")
    const bodyType = searchParams.get("bodyType")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")

    if (brand) urlFilters.brand = [brand]
    if (bodyType) urlFilters.bodyType = [bodyType as BodyType]
    if (minPrice) urlFilters.minPrice = Number.parseInt(minPrice, 10)
    if (maxPrice) urlFilters.maxPrice = Number.parseInt(maxPrice, 10)

    setFilters(urlFilters)
  }, [searchParams])

  const vehicleTypeLabels: Record<BodyType, string> = {
    sedan: "Sedán",
    suv: "SUV",
    hatchback: "Hatchback",
    coupe: "Coupé",
    convertible: "Convertible",
    wagon: "Station Wagon",
    van: "Van",
    truck: "Camioneta",
    other: "Otro",
  }

  const modelOptions = useMemo(() => {
    if (!filters.brand?.length) return []
    return Array.from(new Set(filters.brand.flatMap((b) => brandModelsMap[b] || [])))
  }, [filters.brand, brandModelsMap])

  const priceFilter =
    filters.minPrice !== undefined || filters.maxPrice !== undefined
      ? {
          price: {
            ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
            ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}),
          },
        }
      : {}

  const where = useMemo<P.VersionWhereInput>(() => {
    const baseWhere: P.VersionWhereInput = {
      trims: {
        some: {
          carListings: {
            some: priceFilter,
          },
        },
      },
      ...(filters.year && { year: { in: filters.year } }),
    }

    if (filters.brand || filters.model || filters.bodyType) {
      const modelConditions: P.ModelWhereInput = {}

      if (filters.brand) {
        modelConditions.brand = {
          is: {
            name: { in: filters.brand },
          },
        }
      }

      if (filters.model) {
        modelConditions.name = { in: filters.model }
      }

      if (filters.bodyType) {
        modelConditions.bodyType = { in: filters.bodyType as BodyType[] }
      }

      baseWhere.model = {
        is: modelConditions,
      }
    }

    return baseWhere
  }, [filters, priceFilter])

  // ✅ Solicitamos todos los resultados desde el backend
  const {
    data: result,
    isLoading,
    isError,
    error,
  } = useGetVersions({
    where,
    page: 1,
    pageSize: 5000,
    include: {
      model: { include: { brand: true } },
      trims: {
        where: {
          carListings: {
            some: priceFilter,
          },
        },
        include: {
          carListings: {
            take: 1,
            where: priceFilter,
            include: { images: true },
          },
        },
      },
      wishlistItems: true,
    },
  })

  const allVersions = useMemo(() => result?.data ?? [], [result])

  // ✅ Calculamos paginación en el frontend
  const paginatedVersions = useMemo(
    () => allVersions.slice((page - 1) * pageSize, page * pageSize),
    [allVersions, page, pageSize],
  )

  const meta = useMemo(() => {
    const total = allVersions.length
    return {
      page,
      pageCount: Math.ceil(total / pageSize),
      total,
      pageSize,
    }
  }, [allVersions.length, page, pageSize])

  const { data: availableFiltersData, isLoading: filtersLoading } = useAvailableFilters(where)

  const availableBrands = availableFiltersData?.brands ?? []
  const availableModels = availableFiltersData?.models ?? []
  const availableYears = availableFiltersData?.years ?? []

  const activeFilters: ActiveFilter[] = []

  if (filters.brand?.length) {
    activeFilters.push({
      label: `Marca: ${filters.brand.join(", ")}`,
      type: "brand",
      onRemove: () => setFilters((f) => ({ ...f, brand: undefined })),
    })
  }

  if (filters.model?.length) {
    activeFilters.push({
      label: `Modelo: ${filters.model.join(", ")}`,
      type: "model",
      onRemove: () => setFilters((f) => ({ ...f, model: undefined })),
    })
  }

  if (filters.year?.length) {
    activeFilters.push({
      label: `Año: ${filters.year.join(", ")}`,
      type: "year",
      onRemove: () => setFilters((f) => ({ ...f, year: undefined })),
    })
  }

  if (filters.bodyType?.length) {
    const labels = filters.bodyType.map((type) => vehicleTypeLabels[type as BodyType] || type)
    activeFilters.push({
      label: `Tipo: ${labels.join(", ")}`,
      type: "bodyType",
      onRemove: () => setFilters((f) => ({ ...f, bodyType: undefined })),
    })
  }

  if (filters.minPrice) {
    activeFilters.push({
      label: `Precio mín: $${filters.minPrice.toLocaleString()}`,
      type: "price",
      onRemove: () => setFilters((f) => ({ ...f, minPrice: undefined })),
    })
  }

  if (filters.maxPrice) {
    activeFilters.push({
      label: `Precio máx: $${filters.maxPrice.toLocaleString()}`,
      type: "price",
      onRemove: () => setFilters((f) => ({ ...f, maxPrice: undefined })),
    })
  }

  return (
    <div className="flex w-full flex-grow flex-col px-6 py-4 lg:px-12">
      <ActiveFilters filters={activeFilters} onClear={() => setFilters({})} />

      <div className="mt-6 flex flex-grow gap-8">
        <aside className="hidden w-64 flex-shrink-0 rounded-lg p-4 shadow-sm lg:block">
          <SidebarFilters
            filters={filters}
            onChange={(field, value) => setFilters((f) => ({ ...f, [field]: value }))}
            brandOptions={availableBrands}
            modelOptions={availableModels}
            yearOptions={availableYears}
          />
        </aside>

        <div className={cn("flex max-h-full flex-1 flex-grow flex-col justify-between", "overflow-x-hidden rounded-lg p-4 shadow-sm")}>
          {isLoading ? (
            <VersionsGridSkeleton count={pageSize} />
          ) : isError ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-lg font-medium text-red-600">Error al cargar las versiones</p>
                <p className="mt-2 text-sm text-gray-500">{error?.message || "Ha ocurrido un error inesperado"}</p>
              </div>
            </div>
          ) : (
            <VersionsGrid versions={paginatedVersions} />
          )}

          {meta && (
            <div className="mt-6">
              <PaginationComponent
                page={meta.page}
                pageCount={meta.pageCount}
                onPageChange={setPage}
                disabled={isLoading}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Cargando...</div>}>
      <BrowsePageContent />
    </Suspense>
  )
}
