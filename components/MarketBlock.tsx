interface MarketBlockProps {
  title: string;
  items: string[];
}

export default function MarketBlock({ title, items }: MarketBlockProps) {
  return (
    <div className="rounded-md border bg-white p-4">
      <h4 className="mb-2 font-semibold">{title}</h4>
      <ul className="space-y-1 text-sm text-gray-700">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
