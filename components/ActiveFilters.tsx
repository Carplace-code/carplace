export default function ActiveFilters() {
  const filters = ["$5M - $15M CLP", "Santiago", "Toyota"];

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      {filters.map((f) => (
        <div className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">{f}</div>
      ))}
      <button className="ml-2 text-sm text-red-500 underline" type="button">
        Clear All
      </button>
    </div>
  );
}
