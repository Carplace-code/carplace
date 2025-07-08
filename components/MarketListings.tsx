/* eslint-disable */

interface MarketListingsProps {
  listings: any[];
  selectedId: string;
  onSelect: (listing: any) => void;
}

export default function MarketListings({ listings, selectedId, onSelect }: MarketListingsProps) {
  return (
    <div className="rounded-md border bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold">Available On</h2>
      <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
        {listings.map((item) => {
          const isSelected = item.id === selectedId;
          return (
            <div key={item.id} className={`space-y-2 rounded border p-4 ${isSelected ? "border-blue-500" : ""}`}>
              <p className="font-medium">{item.source?.name}</p>
              <p className="font-bold text-blue-600">CLP ${Number(item.price).toLocaleString()}</p>
              <p className="text-gray-600">Seller: {item.seller?.name}</p>
              <p className="text-gray-600">Location: {item.location}</p>
              <p className="text-xs text-gray-500">Updated: {new Date(item.scrapedAt).toLocaleString()}</p>
              <button
                onClick={() => onSelect(item)}
                className="mt-2 w-full rounded-md border py-1 text-sm hover:bg-gray-100"
              >
                {isSelected ? "Selected" : "View Listing"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
