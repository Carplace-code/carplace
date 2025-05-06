export default function SimilarVehicles() {
  const similar = [
    { title: "Mercedes-Benz C200 2022", km: "12,000 km", price: "$29,900,000" },
    { title: "Mercedes-Benz C200 2019", km: "18,000 km", price: "$24,900,000" },
    { title: "Mercedes-Benz C200 2020", km: "15,000 km", price: "$35,500,000" },
  ];

  return (
    <div className="rounded-md border bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold">Similar Vehicles</h2>
      <ul className="space-y-3 text-sm">
        {similar.map((car) => (
          <li className="flex items-start justify-between">
            <div>
              <p className="font-medium">{car.title}</p>
              <p className="text-xs text-gray-500">{car.km}</p>
            </div>
            <p className="font-bold text-blue-600">{car.price}</p>
          </li>
        ))}
      </ul>
      <button className="mt-4 w-full rounded-md border py-1 text-sm hover:bg-gray-100" type="button">
        Compare Selected
      </button>
    </div>
  );
}
