"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Car, DollarSign, MapPin, Settings } from "lucide-react"
import { useEffect, useState } from "react"

interface Brand {
  id: string
  name: string
  models: { id: string; name: string }[]
}

interface SidebarFiltersProps {
  brands: Brand[]
  filters: any
  setFilters: (filters: any) => void
}

// Función para formatear precio en CLP
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export default function SidebarFilters({ brands, filters, setFilters }: SidebarFiltersProps) {
  const selectedBrand = brands.find((b) => b.id === filters.brandId)

  // Configuración del rango de precios
  const MIN_PRICE = 1000000 // 1 millón CLP
  const MAX_PRICE = 50000000 // 50 millones CLP
  const STEP = 500000 // 500 mil CLP

  // Estado local para los sliders
  const [minPrice, setMinPrice] = useState(filters.minPrice ? Number(filters.minPrice) : MIN_PRICE)
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice ? Number(filters.maxPrice) : MAX_PRICE)

  // Actualizar el estado local cuando cambian los filtros externos
  useEffect(() => {
    setMinPrice(filters.minPrice ? Number(filters.minPrice) : MIN_PRICE);
    setMaxPrice(filters.maxPrice ? Number(filters.maxPrice) : MAX_PRICE);
  }, [filters.minPrice, filters.maxPrice]);

  // Manejadores para los sliders
  const handleMinPriceChange = (values: number[]) => {
    const newMinPrice = values[0]
    // Asegurarse de que el precio mínimo no supere el máximo
    if (newMinPrice <= maxPrice) {
      setMinPrice(newMinPrice)
      setFilters({
        ...filters,
        minPrice: newMinPrice.toString(),
      })
    }
  }

  const handleMaxPriceChange = (values: number[]) => {
    const newMaxPrice = values[0]
    // Asegurarse de que el precio máximo no sea menor que el mínimo
    if (newMaxPrice >= minPrice) {
      setMaxPrice(newMaxPrice)
      setFilters({
        ...filters,
        maxPrice: newMaxPrice.toString(),
      })
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="h-5 w-5" />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Marca */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Car className="h-4 w-4" />
            Marca
          </Label>
          <Select
            value={filters.brandId}
            onValueChange={(value) =>
              setFilters({
                ...filters,
                brandId: value === "all" ? "" : value,
                modelId: "", // limpiar modelo cuando se cambia de marca
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar marca" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las marcas</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Modelo */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Modelo</Label>
          <Select
            value={filters.modelId}
            onValueChange={(value) =>
              setFilters({ ...filters, modelId: value === "all" ? "" : value })
            }
            disabled={!filters.brandId}
          >
            <SelectTrigger className="w-full" disabled={!filters.brandId}>
              <SelectValue
                placeholder={!filters.brandId ? "Primero selecciona una marca" : "Seleccionar modelo"}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los modelos</SelectItem>
              {selectedBrand?.models.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!filters.brandId && (
            <p className="text-xs text-muted-foreground mt-1">Selecciona una marca para ver los modelos disponibles</p>
          )}
        </div>

        <Separator />

        {/* Ubicación */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <MapPin className="h-4 w-4" />
            Ubicación
          </Label>
          <Input
            type="text"
            placeholder="Ej: Santiago, Valparaíso..."
            value={filters.location || ""}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="w-full"
          />
        </div>

        <Separator />

        {/* Precio con dos Sliders unidos */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <DollarSign className="h-4 w-4" />
            Rango de Precio
          </Label>

          {/* Valores actuales */}
          <div className="flex justify-between items-center bg-muted/30 p-2 rounded-md">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Mínimo</p>
              <p className="text-sm font-semibold text-primary">{formatPrice(minPrice)}</p>
            </div>
            <div className="text-xs text-muted-foreground">-</div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Máximo</p>
              <p className="text-sm font-semibold text-primary">{formatPrice(maxPrice)}</p>
            </div>
          </div>

          {/* Sliders unidos */}
          <div className="space-y-2">
            {/* Slider mínimo */}
            <div className="relative">
              <Label className="text-xs text-muted-foreground mb-1 block">Precio mínimo</Label>
              <Slider
                value={[minPrice]}
                onValueChange={handleMinPriceChange}
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={STEP}
                className="w-full"
              />
            </div>

            {/* Slider máximo */}
            <div className="relative">
              <Label className="text-xs text-muted-foreground mb-1 block">Precio máximo</Label>
              <Slider
                value={[maxPrice]}
                onValueChange={handleMaxPriceChange}
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={STEP}
                className="w-full"
              />
            </div>

            {/* Etiquetas de rango compartidas */}
            <div className="flex justify-between text-xs text-muted-foreground pt-1">
              <span>{formatPrice(MIN_PRICE)}</span>
              <span>{formatPrice(MAX_PRICE)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
