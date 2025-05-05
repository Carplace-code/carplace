import CarCard from "./CarCard";

export default function FeaturedCars() {
  const cars = [
    {
      title: "Toyota Corolla 2024",
      price: "$18,990",
      platform: "Chileautos",
      km: "15,000 km",
      fuel: "Gasoline",
    },
    {
      title: "Honda Civic 2023",
      price: "$21,500",
      platform: "Yapo",
      km: "8,000 km",
      fuel: "Gasoline",
    },
    {
      title: "Hyundai Tucson 2024",
      price: "$25,990",
      platform: "Facebook",
      km: "12,000 km",
      fuel: "Hybrid",
    },
    {
      title: "Mazda 3 2024",
      price: "$23,500",
      platform: "Chileautos",
      km: "5,000 km",
      fuel: "Gasoline",
    },
  ];

  return (
    <section className="px-6">
      <h2 className="mb-6 text-2xl font-semibold">Featured Cars</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cars.map((car) => (
          <CarCard key={JSON.stringify(car)} {...car} />
        ))}
      </div>
    </section>
  );
}
