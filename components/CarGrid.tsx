export default function CarGrid() {
  const cars = Array(8).fill(0);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cars.map(() => (
        <div className="relative rounded-md border bg-white p-3">
          <div className="mb-3 h-36 rounded bg-gray-200" />
          <h3 className="text-sm font-semibold">Toyota Corolla 2020</h3>
          <p className="text-sm font-bold text-blue-600">CLP $12,500,000</p>
          <p className="text-xs text-gray-500">Santiago, Chile • 45,000 km</p>
          <p className="text-xs text-gray-500">Manual, Petrol</p>
          <div className="mt-3 flex items-center justify-between">
            <button className="text-sm font-medium text-blue-600 hover:underline" type="button">
              Compare
            </button>
            <button className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700" type="button">
              View Details
            </button>
          </div>
          <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-red-300" />
        </div>
      ))}
    </div>
  );
}
