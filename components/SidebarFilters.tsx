"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SidebarFiltersProps {
  filters: {
    brand?: string[];
    model?: string[];
    year?: number[];
    bodyType?: string[];
    minPrice?: number;
    maxPrice?: number;
  };
  onChange: (
    field: "brand" | "model" | "year" | "bodyType" | "minPrice" | "maxPrice",
    value: string[] | number[] | number | undefined,
  ) => void;
  brandOptions: string[];
  modelOptions: string[];
  yearOptions: number[];
}

interface SingleSelectFilterProps {
  label: string;
  options: Array<string | number>;
  selected?: string | number;
  onChange: (value: string | number | undefined) => void;
  placeholder?: string;
}

interface PriceRangeFilterProps {
  label: string;
  minValue?: number;
  maxValue?: number;
  onMinChange: (value: number | undefined) => void;
  onMaxChange: (value: number | undefined) => void;
}

function SingleSelectFilter({
  label,
  options,
  selected,
  onChange,
  placeholder = "Seleccionar...",
}: SingleSelectFilterProps) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <Select
        value={selected?.toString() || "all"}
        onValueChange={(value) => {
          if (value === "all") {
            onChange(undefined);
          } else if (typeof options[0] === "number") {
            onChange(Number(value));
          } else {
            onChange(value);
          }
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt.toString()}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function PriceRangeFilter({ label, minValue, maxValue, onMinChange, onMaxChange }: PriceRangeFilterProps) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <div className="space-y-3">
        <div>
          <Label htmlFor="min-price" className="mb-1 block text-xs text-gray-500">
            Precio mínimo
          </Label>
          <Input
            id="min-price"
            type="number"
            placeholder="0"
            value={minValue || ""}
            onChange={(e) => {
              const val = e.target.value;
              onMinChange(val ? Number(val) : undefined);
            }}
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="max-price" className="mb-1 block text-xs text-gray-500">
            Precio máximo
          </Label>
          <Input
            id="max-price"
            type="number"
            placeholder="Sin límite"
            value={maxValue || ""}
            onChange={(e) => {
              const val = e.target.value;
              onMaxChange(val ? Number(val) : undefined);
            }}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

export default function SidebarFilters({
  filters,
  onChange,
  brandOptions,
  modelOptions,
  yearOptions,
}: SidebarFiltersProps) {
  // Opciones de tipos de vehículo

  return (
    <Card className="w-full">
      <CardContent className="space-y-6 p-6">
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
          <p className="mt-1 text-sm text-gray-500">Refina tu búsqueda</p>
        </div>

        <SingleSelectFilter
          label="Marca"
          options={brandOptions}
          selected={filters.brand?.[0]}
          onChange={(val) => (typeof val === "string" && val ? onChange("brand", [val]) : onChange("brand", undefined))}
          placeholder="Seleccionar marca"
        />

        <SingleSelectFilter
          label="Modelo"
          options={modelOptions}
          selected={filters.model?.[0]}
          onChange={(val) => (typeof val === "string" && val ? onChange("model", [val]) : onChange("model", undefined))}
          placeholder="Seleccionar modelo"
        />

        <SingleSelectFilter
          label="Año"
          options={yearOptions}
          selected={filters.year?.[0]}
          onChange={(val) =>
            typeof val === "number" && !Number.isNaN(val) ? onChange("year", [val]) : onChange("year", undefined)
          }
          placeholder="Seleccionar año"
        />

        <PriceRangeFilter
          label="Rango de Precio (CLP)"
          minValue={filters.minPrice}
          maxValue={filters.maxPrice}
          onMinChange={(val) => onChange("minPrice", val)}
          onMaxChange={(val) => onChange("maxPrice", val)}
        />
      </CardContent>
    </Card>
  );
}
