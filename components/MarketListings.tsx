export default function MarketListings() {
  const listings = [
    { platform: "Yapo", price: "$35,990,000", seller: "Juan Pérez", location: "Santiago", updated: "3 hours ago" },
    {
      platform: "Facebook",
      price: "$36,700,000",
      seller: "María González",
      location: "Temuco",
      updated: "6 hours ago",
    },
    {
      platform: "Chileautos",
      price: "$39,000,000",
      seller: "Auto Import SPA",
      location: "Santiago",
      updated: "5 hours ago",
    },
  ];

  return (
    <div className="rounded-md border bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold">Available On</h2>
      <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
        {listings.map((item) => (
          <div className="space-y-2 rounded border p-4">
            <p className="font-medium">{item.platform}</p>
            <p className="font-bold text-blue-600">{item.price}</p>
            <p className="text-gray-600">Seller: {item.seller}</p>
            <p className="text-gray-600">Location: {item.location}</p>
            <p className="text-xs text-gray-500">{item.updated}</p>
            <button className="mt-2 w-full rounded-md border py-1 text-sm hover:bg-gray-100" type="button">
              View Original
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
