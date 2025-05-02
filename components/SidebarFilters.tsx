export default function SidebarFilters() {
  return (
    <div className="space-y-6 text-sm">
      <div>
        <h4 className="mb-2 font-semibold">Price Range</h4>
        <div className="flex gap-2">
          <input className="w-full rounded border p-1" placeholder="Min" />
          <input className="w-full rounded border p-1" placeholder="Max" />
        </div>
      </div>

      <div>
        <h4 className="mb-2 font-semibold">Location</h4>
        <select className="w-full rounded border p-2">
          <option>All Regions</option>
        </select>
      </div>

      <div>
        <h4 className="mb-2 font-semibold">Brand & Model</h4>
        <input className="w-full rounded border p-2" placeholder="Search brands..." />
        <select className="mt-2 w-full rounded border p-2">
          <option>All Models</option>
        </select>
      </div>

      <div>
        <h4 className="mb-2 font-semibold">Year</h4>
        <select className="w-full rounded border p-2">
          <option>Any Year</option>
        </select>
      </div>

      <div>
        <h4 className="mb-2 font-semibold">Transmission</h4>
        <select className="w-full rounded border p-2">
          <option>Any Transmission</option>
        </select>
      </div>

      <div>
        <h4 className="mb-2 font-semibold">Fuel Type</h4>
        <select className="w-full rounded border p-2">
          <option>Any Fuel Type</option>
        </select>
      </div>
    </div>
  );
}
