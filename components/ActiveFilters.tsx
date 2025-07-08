"use client";

import { Filter, Trash2, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface ActiveFilter {
  label: string;
  onRemove: () => void;
  type?: "brand" | "model" | "year" | "bodyType" | "price" | "other";
}

interface ActiveFiltersProps {
  filters: ActiveFilter[];
  onClear: () => void;
}

export default function ActiveFilters({ filters, onClear }: ActiveFiltersProps) {
  if (filters.length === 0) {
    return null;
  }

  // Group filters by type for better organization
  const groupedFilters = filters.reduce(
    (acc, filter) => {
      const type = filter.type || "other";
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(filter);
      return acc;
    },
    {} as Record<string, ActiveFilter[]>,
  );

  const getVariantForType = (type: string) => {
    switch (type) {
      case "brand":
        return "default" as const;
      case "model":
        return "secondary" as const;
      case "year":
        return "outline" as const;
      case "bodyType":
        return "secondary" as const;
      case "price":
        return "destructive" as const;
      default:
        return "outline" as const;
    }
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="text-muted-foreground h-4 w-4" />
          <span className="text-muted-foreground text-sm font-medium">Filtros activos ({filters.length})</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-muted-foreground hover:text-destructive h-8 px-2"
        >
          <Trash2 className="mr-1 h-3 w-3" />
          Limpiar todo
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(groupedFilters).map(([type, typeFilters]) =>
          typeFilters.map((filter) => (
            <Badge
              key={filter.label}
              variant={getVariantForType(type)}
              className="group relative pr-6 transition-all duration-200 hover:pr-8"
            >
              <span className="text-xs">{filter.label}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={filter.onRemove}
                className="group-hover:bg-background/20 absolute top-0 right-0 h-full w-6 p-0 opacity-60 hover:opacity-100"
                aria-label={`Remover filtro ${filter.label}`}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )),
        )}
      </div>

      {/* Alternative: Simple version without grouping */}
      {/*
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Badge
            key={filter.label}
            variant="secondary"
            className="group relative pr-6 transition-all duration-200 hover:pr-8"
          >
            <span className="text-xs">{filter.label}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={filter.onRemove}
              className="absolute right-0 top-0 h-full w-6 p-0 opacity-60 hover:opacity-100 group-hover:bg-background/20"
              aria-label={`Remover filtro ${filter.label}`}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
      */}
    </div>
  );
}
