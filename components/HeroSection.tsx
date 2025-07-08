"use client";

import { Filter, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBrandModels } from "@/hooks/useBrandModels";
import { useCarStats } from "@/hooks/useCarStats";

export default function HeroSection() {
  const router = useRouter();
  const { data: brandModelsMap = {} } = useBrandModels();
  const { stats, isLoading: statsLoading } = useCarStats();

  // Estados para los modals
  const [priceModalOpen, setPriceModalOpen] = useState(false);
  const [brandModalOpen, setBrandModalOpen] = useState(false);

  // Estados para los filtros seleccionados
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");

  // Helper function para evitar ternary anidado
  const getPriceDisplayText = (min: string, max: string) => {
    if (min && max) return `$${min} - $${max}`;
    if (min) return `Desde $${min}`;
    return `Hasta $${max}`;
  };

  const applyFilters = () => {
    const searchParams = new URLSearchParams();

    // Agregar filtros si están seleccionados
    if (selectedBrand) {
      searchParams.set("brand", selectedBrand);
    }
    if (priceMin) {
      searchParams.set("minPrice", priceMin);
    }
    if (priceMax) {
      searchParams.set("maxPrice", priceMax);
    }

    // Redireccionar a /browse con los filtros
    const url = `/browse${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    router.push(url);
  };

  const clearAllFilters = () => {
    setSelectedBrand("");
    setPriceMin("");
    setPriceMax("");
  };

  const hasFilters = selectedBrand || priceMin || priceMax;

  // Función para formatear números con separadores de miles
  const formatNumber = (num: number) => new Intl.NumberFormat("es-CL").format(num);

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-6 py-20">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-200 opacity-20" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-200 opacity-20" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <h1 className="mb-6 text-4xl leading-tight font-bold text-gray-900 md:text-6xl">
          Encuentra las mejores ofertas de autos usados en Chile —<br />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ¡todo en un solo lugar!
          </span>
        </h1>

        <p className="mb-10 text-lg text-gray-600 md:text-xl">
          Compara precios de Chileautos, Yapo y Facebook Marketplace al instante
        </p>

        {/* Search Section */}
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
            <div className="mb-6 flex items-center gap-3">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="font-medium text-gray-700">Filtros de búsqueda</span>
            </div>

            {/* Filtros */}
            <div className="mb-6 flex flex-wrap justify-center gap-3">
              {/* Modal de Precio */}
              <Dialog open={priceModalOpen} onOpenChange={setPriceModalOpen}>
                <DialogTrigger asChild>
                  <button
                    className="group relative overflow-hidden rounded-xl border-2 border-gray-200 bg-white px-6 py-3 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
                    type="button"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">Rango de Precio</span>
                      {(priceMin || priceMax) && (
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                          {getPriceDisplayText(priceMin, priceMax)}
                        </span>
                      )}
                    </div>
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Rango de Precio</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="price-min">Precio Mínimo (CLP)</Label>
                      <Input
                        id="price-min"
                        type="number"
                        value={priceMin}
                        onChange={(e) => setPriceMin(e.target.value)}
                        placeholder="Ej: 5.000.000"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price-max">Precio Máximo (CLP)</Label>
                      <Input
                        id="price-max"
                        type="number"
                        value={priceMax}
                        onChange={(e) => setPriceMax(e.target.value)}
                        placeholder="Ej: 20.000.000"
                        className="mt-2"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setPriceMin("");
                          setPriceMax("");
                        }}
                        className="flex-1"
                      >
                        Limpiar
                      </Button>
                      <Button onClick={() => setPriceModalOpen(false)} className="flex-1">
                        Aplicar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Modal de Marca */}
              <Dialog open={brandModalOpen} onOpenChange={setBrandModalOpen}>
                <DialogTrigger asChild>
                  <button
                    className="group relative overflow-hidden rounded-xl border-2 border-gray-200 bg-white px-6 py-3 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
                    type="button"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">Marca</span>
                      {selectedBrand && (
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                          {selectedBrand}
                        </span>
                      )}
                    </div>
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Seleccionar Marca</DialogTitle>
                  </DialogHeader>
                  <div className="max-h-80 space-y-2 overflow-y-auto">
                    <Button
                      variant={!selectedBrand ? "default" : "ghost"}
                      onClick={() => setSelectedBrand("")}
                      className="w-full justify-start"
                    >
                      Todas las marcas
                    </Button>
                    {Object.keys(brandModelsMap).map((brand) => (
                      <Button
                        key={brand}
                        variant={selectedBrand === brand ? "default" : "ghost"}
                        onClick={() => setSelectedBrand(brand)}
                        className="w-full justify-start"
                      >
                        {brand}
                      </Button>
                    ))}
                  </div>
                  <div className="flex gap-3 pt-6">
                    <Button variant="outline" onClick={() => setSelectedBrand("")} className="flex-1">
                      Limpiar
                    </Button>
                    <Button onClick={() => setBrandModalOpen(false)} className="flex-1">
                      Aplicar
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              {hasFilters && (
                <>
                  <Button
                    onClick={applyFilters}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3 font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
                  >
                    <Search className="h-5 w-5" />
                    Buscar Autos
                  </Button>
                  <Button variant="outline" onClick={clearAllFilters} className="bg-transparent px-6 py-3">
                    Limpiar Filtros
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Stats - Ahora dinámicas */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-xl bg-white/70 p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-blue-600">
                {statsLoading ? (
                  <div className="h-8 w-16 animate-pulse rounded bg-blue-200" />
                ) : (
                  formatNumber(stats.totalListings)
                )}
              </div>
              <div className="text-sm text-gray-600">Autos Disponibles</div>
            </div>
            <div className="rounded-xl bg-white/70 p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-green-600">
                {statsLoading ? <div className="h-8 w-8 animate-pulse rounded bg-green-200" /> : stats.totalBrands}
              </div>
              <div className="text-sm text-gray-600">Marcas Disponibles</div>
            </div>
            <div className="rounded-xl bg-white/70 p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-purple-600">
                {statsLoading ? (
                  <div className="h-8 w-12 animate-pulse rounded bg-purple-200" />
                ) : (
                  `+${formatNumber(stats.recentListings)}`
                )}
              </div>
              <div className="text-sm text-gray-600">Nuevos Hoy</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
