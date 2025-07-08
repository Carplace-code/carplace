/* eslint-disable */

export default function SellerNotes({ listing }: { listing: any }) {
  return (
    <div className="rounded-md border bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold">Seller Notes</h2>
      <p className="text-sm text-gray-700">{listing.description || "No description provided by seller."}</p>
    </div>
  );
}
