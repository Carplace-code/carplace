"use client";

import { useEffect, useState } from "react";

import CarCard from "./CarCard";

interface CarListing {
  id: string;
  title: string;
  price: number;
  mileage: number;
  images: Array<{
    url: string;
  }>;
  source: {
    name: string;
  };
  trim: {
    fuelType: string;
    version: {
      model: {
        brand: {
          name: string;
        };
        name: string;
      };
    };
  };
}

interface CarCardData {
  id: string;
  title: string;
  price: string;
  platform: string;
  km: string;
  fuel: string;
  imageUrl?: string;
}

export default function FeaturedCars() {
  const [cars, setCars] = useState<CarCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch("/api/cars?limit=4");
        if (!response.ok) throw new Error("Failed to fetch cars");

        const data = await response.json();
        // Transform the API data to match CarCard props
        const transformedCars: CarCardData[] = data.listings.map((listing: CarListing) => ({
          id: listing.id,
          title: listing.title,
          price: `$${new Intl.NumberFormat("en-US").format(listing.price)}`,
          platform: listing.source.name.charAt(0).toUpperCase() + listing.source.name.slice(1),
          km: `${new Intl.NumberFormat("en-US").format(listing.mileage)} km`,
          fuel: listing.trim.fuelType.charAt(0).toUpperCase() + listing.trim.fuelType.slice(1),
          imageUrl: listing.images.length > 0 ? listing.images[0].url : undefined,
        }));

        setCars(transformedCars);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  if (loading) {
    return (
      <section className="px-6">
        <h2 className="mb-6 text-2xl font-semibold">Featured Cars</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={`skeleton-${index + 1}`} className="h-64 animate-pulse rounded-lg border bg-gray-200 p-4" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-6">
        <h2 className="mb-6 text-2xl font-semibold">Featured Cars</h2>
        <div className="text-center text-gray-500">
          <p>Unable to load featured cars. Please try again later.</p>
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="px-6" data-testid="featured-cars">
      <h2 className="mb-6 text-2xl font-semibold">Featured Cars</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cars.map((car) => (
          <CarCard key={car.id} {...car} />
        ))}
      </div>
    </section>
  );
}
