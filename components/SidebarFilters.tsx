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
}

interface PriceRangeFilterProps {
  label: string;
  minValue?: number;
  maxValue?: number;
  onMinChange: (value: number | undefined) => void;
  onMaxChange: (value: number | undefined) => void;
}

function SingleSelectFilter({ label, options, selected, onChange }: SingleSelectFilterProps) {
  return (
    <div className="space-y-1">
      <h4 className="mb-1 text-xs font-semibold tracking-wide text-gray-600 uppercase">{label}</h4>
      <select
        className={[
          "w-full rounded-md border border-gray-200 bg-gray-50 p-2 text-sm",
          "focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none",
        ].join(" ")}
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

function PriceRangeFilter({ label, minValue, maxValue, onMinChange, onMaxChange }: PriceRangeFilterProps) {
  return (
    <div className="space-y-2">
      <h4 className="mb-1 text-xs font-semibold tracking-wide text-gray-600 uppercase">{label}</h4>
      <div className="space-y-2">
        <input
          type="number"
          placeholder="Precio mínimo"
          value={minValue || ""}
          onChange={(e) => {
            const val = e.target.value;
            onMinChange(val ? Number(val) : undefined);
          }}
          className={[
            "w-full rounded-md border border-gray-200 bg-gray-50 p-2 text-sm",
            "focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none",
          ].join(" ")}
        />
        <input
          type="number"
          placeholder="Precio máximo"
          value={maxValue || ""}
          onChange={(e) => {
            const val = e.target.value;
            onMaxChange(val ? Number(val) : undefined);
          }}
          className={[
            "w-full rounded-md border border-gray-200 bg-gray-50 p-2 text-sm",
            "focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none",
          ].join(" ")}
        />
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
  const vehicleTypeOptions = [
    { value: "sedan", label: "Sedán" },
    { value: "suv", label: "SUV" },
    { value: "hatchback", label: "Hatchback" },
    { value: "coupe", label: "Coupé" },
    { value: "convertible", label: "Convertible" },
    { value: "wagon", label: "Station Wagon" },
    { value: "van", label: "Van" },
    { value: "truck", label: "Camioneta" },
    { value: "other", label: "Otro" },
  ];

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

      <div className="space-y-1">
        <h4 className="mb-1 text-xs font-semibold tracking-wide text-gray-600 uppercase">Tipo de Vehículo</h4>
        <select
          className={[
            "w-full rounded-md border border-gray-200 bg-gray-50 p-2 text-sm",
            "focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none",
          ].join(" ")}
          value={filters.bodyType?.[0] || ""}
          onChange={(e) => {
            const val = e.target.value;
            onChange("bodyType", val ? [val] : undefined);
          }}
        >
          <option value="">-</option>
          {vehicleTypeOptions.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <PriceRangeFilter
        label="Rango de Precio (CLP)"
        minValue={filters.minPrice}
        maxValue={filters.maxPrice}
        onMinChange={(val) => onChange("minPrice", val)}
        onMaxChange={(val) => onChange("maxPrice", val)}
      />
    </div>
  );
}
