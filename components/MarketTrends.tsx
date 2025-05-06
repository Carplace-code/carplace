import MarketBlock from "./MarketBlock";

export default function MarketTrends() {
  return (
    <section className="bg-gray-50 px-6 py-12 text-center">
      <h2 className="mb-2 text-2xl font-semibold">Market Trends</h2>
      <p className="mb-6 text-sm text-gray-600">Stay informed with real-time market analytics and price trends</p>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 text-left md:grid-cols-3">
        <MarketBlock title="Popular Brands" items={["Toyota - 32%", "Hyundai - 26%", "Kia - 24%"]} />
        <MarketBlock title="Price Trends" items={["SUVs: +5.2%", "Sedans: -2.1%", "Electric: +7.7%"]} />
        <MarketBlock
          title="Market Activity"
          items={["New Listings: 234", "Avg. Days Listed: 45", "Total Active: 12,458"]}
        />
      </div>
    </section>
  );
}
