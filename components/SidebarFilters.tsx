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

interface SingleSelectFilterProps {
  label: string;
  options: Array<string | number>;
  selected?: string | number;
  onChange: (value: string | number | undefined) => void;
}

function SingleSelectFilter({ label, options, selected, onChange }: SingleSelectFilterProps) {
  return (
    <div className="space-y-1">
      <h4 className="mb-1 text-xs font-semibold tracking-wide text-gray-600 uppercase">{label}</h4>
      <select
        // eslint-disable-next-line max-len
        className="w-full rounded-md border border-gray-200 bg-gray-50 p-2 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none"
        value={selected === undefined ? "" : selected}
        onChange={(e) => {
          const val = e.target.value;
          let parsed: string | number | undefined;
          if (val === "") {
            parsed = undefined;
          } else if (typeof options[0] === "number") {
            parsed = Number(val);
          } else {
            parsed = val;
          }
          onChange(parsed);
        }}
      >
        <option value="">-</option>
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
    <div className="space-y-6 rounded-lg border bg-white p-6 text-sm shadow-sm">
      <SingleSelectFilter
        label="Marca"
        options={brandOptions}
        selected={filters.brand?.[0]}
        onChange={(val) => (typeof val === "string" && val ? onChange("brand", [val]) : onChange("brand", undefined))}
      />
      <SingleSelectFilter
        label="Modelo"
        options={modelOptions}
        selected={filters.model?.[0]}
        onChange={(val) => (typeof val === "string" && val ? onChange("model", [val]) : onChange("model", undefined))}
      />
      <SingleSelectFilter
        label="Año"
        options={yearOptions}
        selected={filters.year?.[0]}
        onChange={(val) =>
          typeof val === "number" && !Number.isNaN(val) ? onChange("year", [val]) : onChange("year", undefined)
        }
      />
    </div>
  );
}
