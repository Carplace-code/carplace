interface SidebarFiltersProps {
  filters: {
    brand?: string[];
    model?: string[];
    year?: number[];
  };
  onChange: (field: "brand" | "model" | "year", value: string[] | number[] | undefined) => void;
  brandOptions: string[];
  modelOptions: string[];
  yearOptions: number[];
}

interface MultiSelectFilterProps {
  label: string;
  options: Array<string | number>;
  selected?: Array<string | number>;
  onChange: (values: Array<string | number> | undefined) => void;
}

function MultiSelectFilter({ label, options, selected, onChange }: MultiSelectFilterProps) {
  return (
    <div>
      <h4 className="mb-2 font-semibold">{label}</h4>
      <select
        multiple
        size={4}
        className="w-full rounded border p-2 text-sm"
        value={selected?.map(String) ?? []}
        onChange={(e) => {
          const vals = Array.from(e.target.selectedOptions).map((o) => o.value);
          onChange(vals.length > 0 ? vals : undefined);
        }}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
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
  return (
    <div className="space-y-6 text-sm">
      <MultiSelectFilter
        label="Brand"
        options={brandOptions}
        selected={filters.brand}
        onChange={(vals) => onChange("brand", vals as string[] | undefined)}
      />
      <MultiSelectFilter
        label="Model"
        options={modelOptions}
        selected={filters.model}
        onChange={(vals) => onChange("model", vals as string[] | undefined)}
      />
      <MultiSelectFilter
        label="Year"
        options={yearOptions}
        selected={filters.year}
        onChange={(vals) => onChange("year", vals as number[] | undefined)}
      />
    </div>
  );
}
