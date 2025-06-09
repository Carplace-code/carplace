"use client";

import { ArrowDown, ArrowUp, Car, DollarSign, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

// Types
interface Brand {
  id: string;
  name: string;
  models: { id: string; name: string }[];
}

interface Filters {
  brandId: string;
  modelId: string;
  minPrice: string;
  maxPrice: string;
}

interface SidebarFiltersProps {
  brands: Brand[];
  filters: Filters;
  setFilters: (filters: Filters | ((prev: Filters) => Filters)) => void;
}

// Utils
const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

export default function SidebarFilters({ brands, filters, setFilters }: SidebarFiltersProps) {
  const selectedBrand = brands.find((b) => b.id === filters.brandId);

  const MIN_PRICE = 1000000;
  const MAX_PRICE = 50000000;
  const STEP = 500000;

  const [minPrice, setMinPrice] = useState(filters.minPrice ? Number(filters.minPrice) : MIN_PRICE);
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice ? Number(filters.maxPrice) : MAX_PRICE);

  useEffect(() => {
    setMinPrice(filters.minPrice ? Number(filters.minPrice) : MIN_PRICE);
    setMaxPrice(filters.maxPrice ? Number(filters.maxPrice) : MAX_PRICE);
  }, [filters.minPrice, filters.maxPrice]);

  // Debounced setters
  const debouncedSetMinPrice = useDebouncedCallback((value: number) => {
    setFilters((prev) => ({
      ...prev,
      minPrice: value.toString(),
    }));
  }, 300);

  const debouncedSetMaxPrice = useDebouncedCallback((value: number) => {
    setFilters((prev) => ({
      ...prev,
      maxPrice: value.toString(),
    }));
  }, 300);

  const handleMinPriceChange = (values: number[]) => {
    const newMinPrice = values[0];
    if (newMinPrice <= maxPrice) {
      setMinPrice(newMinPrice);
      debouncedSetMinPrice(newMinPrice);
    }
  };

  const handleMaxPriceChange = (values: number[]) => {
    const newMaxPrice = values[0];
    if (newMaxPrice >= minPrice) {
      setMaxPrice(newMaxPrice);
      debouncedSetMaxPrice(newMaxPrice);
    }
  };

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
            onValueChange={(value) => setFilters({ ...filters, brandId: value, modelId: "" })}
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
            onValueChange={(value) => setFilters({ ...filters, modelId: value })}
            disabled={!filters.brandId}
          >
            <SelectTrigger className="w-full" disabled={!filters.brandId}>
              <SelectValue placeholder={!filters.brandId ? "Primero selecciona una marca" : "Seleccionar modelo"} />
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
            <p className="text-muted-foreground mt-1 text-xs">Selecciona una marca para ver los modelos disponibles</p>
          )}
        </div>

        <Separator />

        {/* Precio */}
        <div className="space-y-5">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <DollarSign className="h-4 w-4" />
            Rango de Precio
          </Label>

          {/* Mínimo */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-1 text-xs">
                <ArrowUp className="h-3 w-3" />
                Precio mínimo
              </Label>
              <span className="text-primary text-sm font-medium">{formatPrice(minPrice)}</span>
            </div>
            <Slider
              value={[minPrice]}
              onValueChange={handleMinPriceChange}
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={STEP}
              className="w-full"
            />
            <div className="text-muted-foreground flex justify-between text-xs">
              <span>{formatPrice(MIN_PRICE)}</span>
              <span>{formatPrice(MAX_PRICE)}</span>
            </div>
          </div>

          {/* Máximo */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-1 text-xs">
                <ArrowDown className="h-3 w-3" />
                Precio máximo
              </Label>
              <span className="text-primary text-sm font-medium">{formatPrice(maxPrice)}</span>
            </div>
            <Slider
              value={[maxPrice]}
              onValueChange={handleMaxPriceChange}
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={STEP}
              className="w-full"
            />
            <div className="text-muted-foreground flex justify-between text-xs">
              <span>{formatPrice(MIN_PRICE)}</span>
              <span>{formatPrice(MAX_PRICE)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
