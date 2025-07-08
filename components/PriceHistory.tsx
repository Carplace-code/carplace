/* eslint-disable */

export default function PriceHistory({ history }: { history: any[] }) {
  return (
    <div className="flex h-64 items-center justify-center rounded-md border bg-white p-6">
      <p className="text-sm text-gray-500">
        {history.length === 0 ? "No price history available." : `[Price Chart Placeholder]`}
      </p>
    </div>
  );
}
