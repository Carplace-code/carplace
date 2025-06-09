"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import PaginationControls from "./PaginationControls";

interface Filters {
  brandId: string;
  modelId: string;
  minPrice: string;
  maxPrice: string;
  transmission: string;
  fuel: string;
}

interface CarListing {
  id: string;
  title: string;
  price: number;
  mileage: number;
  location: string;
  images?: { url: string }[];
}

export default function CarGrid({ filters }: { filters: Filters }) {
  const [cars, setCars] = useState<CarListing[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const take = 8;

  const query = new URLSearchParams({
    page: page.toString(),
    take: take.toString(),
    ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== "")),
  }).toString();

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`/api/cars?${query}`);
        const data = await res.json();
        setCars(data.listings || []);
        setTotal(data.total || 0);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(total / take));

  // Generate unique keys for skeletons (zero dependency)
  const skeletonKeys = Array.from({ length: take }, () => `skeleton-${Date.now()}-${Math.random()}`);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading &&
          cars.length === 0 &&
          skeletonKeys.map((key) => (
            <div key={key} className="animate-pulse rounded-md border bg-white p-3">
              <div className="mb-3 h-36 w-full rounded bg-gray-200" />
              <div className="mb-2 h-4 rounded bg-gray-200" />
              <div className="mb-2 h-4 w-3/4 rounded bg-gray-200" />
              <div className="mb-1 h-3 w-1/2 rounded bg-gray-200" />
              <div className="h-3 w-1/3 rounded bg-gray-200" />
            </div>
          ))}

        {!loading && error && <div className="col-span-full text-center text-red-500">Error cargando autos.</div>}

        {!loading &&
          !error &&
          cars.map((car) => (
            <div key={car.id} className="rounded-md border bg-white p-3">
              <Image
                src={car.images?.[0]?.url || "/placeholder.svg"}
                alt={car.title}
                width={400}
                height={144}
                className="mb-3 h-36 w-full rounded object-cover"
              />
              <h3 className="text-sm font-semibold">{car.title}</h3>
              <p className="text-sm font-bold text-blue-600">CLP ${Number(car.price).toLocaleString("es-CL")}</p>
              <p className="text-xs text-gray-500">
                {car.location} • {Number(car.mileage).toLocaleString("es-CL")} km
              </p>
              <p className="text-xs text-gray-500">Manual, Petrol</p>
            </div>
          ))}
      </div>

      <div className="mt-8">
        <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </>
  );
}
