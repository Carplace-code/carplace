export default function HeroSection() {
  const filters = ["Price Range", "Location", "Brand", "Vehicle Type"];

  return (
    <section className="bg-blue-50 px-6 py-16 text-center">
      <h1 className="mb-4 text-3xl font-bold md:text-5xl">
        Find the best used car deals in Chile —<br />
        all in one place!
      </h1>
      <p className="mb-6 text-gray-600">Compare prices across Chileautos, Yapo, and Facebook Marketplace instantly</p>
      <div className="flex flex-wrap justify-center gap-4">
        {filters.map((label) => (
          <button key={label} className="rounded-md border bg-white px-4 py-2 shadow-sm" type="button">
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}
