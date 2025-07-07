export interface ActiveFilter {
  label: string;
  onRemove: () => void;
}

interface ActiveFiltersProps {
  filters: ActiveFilter[];
  onClear: () => void;
}

export default function ActiveFilters({ filters, onClear }: ActiveFiltersProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
      {filters.map((f) => (
        <button
          key={f.label}
          type="button"
          className="flex items-center rounded-full bg-blue-100 px-3 py-1 text-blue-700"
          onClick={f.onRemove}
        >
          {f.label}
          <span className="ml-1 font-bold">&times;</span>
        </button>
      ))}
      {filters.length > 0 && (
        <button type="button" className="ml-2 text-sm text-red-500 underline" onClick={onClear}>
          Clear All
        </button>
      )}
    </div>
  );
}
