"use client";

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
  transmission: string;
  fuel: string;
}

interface ActiveFiltersProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  brands: Brand[];
}

export default function ActiveFilters({ filters, setFilters, brands }: ActiveFiltersProps) {
  const entries: string[] = [];

  if (filters.minPrice || filters.maxPrice) {
    const min = filters.minPrice ? `$${Number(filters.minPrice).toLocaleString("es-CL")}` : "";
    const max = filters.maxPrice ? `$${Number(filters.maxPrice).toLocaleString("es-CL")}` : "";
    entries.push(`${min} - ${max} CLP`);
  }

  const brand = brands.find((b) => b.id === filters.brandId);
  if (brand) {
    entries.push(`Marca: ${brand.name}`);
  }

  const model = brand?.models.find((m) => m.id === filters.modelId);
  if (model) {
    entries.push(`Modelo: ${model.name}`);
  }

  const clearFilters = () => {
    setFilters({
      brandId: "",
      modelId: "",
      minPrice: "",
      maxPrice: "",
      transmission: "",
      fuel: "",
    });
  };

  if (entries.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      {entries.map((entry) => (
        <div key={entry} className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">
          {entry}
        </div>
      ))}
      <button className="ml-2 text-sm text-red-500 underline" type="button" onClick={clearFilters}>
        Limpiar todo
      </button>
    </div>
  );
}
