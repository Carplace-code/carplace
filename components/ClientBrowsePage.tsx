"use client";

import { useState } from "react";

import ActiveFilters from "./ActiveFilters";
import CarGrid from "./CarGrid";
import Footer from "./Footer";
import SidebarFilters from "./SidebarFilters";

interface Brand {
  id: string;
  name: string;
  models: { id: string; name: string }[];
}

interface Props {
  brands: Brand[];
}

export default function ClientBrowsePage({ brands }: Props) {
  const [filters, setFilters] = useState({
    brandId: "",
    modelId: "",
    minPrice: "",
    maxPrice: "",
    location: "",
    transmission: "",
    fuel: "",
  });

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-grow px-4 py-6 lg:px-10">
        <ActiveFilters filters={filters} setFilters={setFilters} brands={brands} />
        <div className="mt-6 flex gap-6">
          <aside className="hidden w-64 lg:block">
            <SidebarFilters brands={brands} filters={filters} setFilters={setFilters} />
          </aside>
          <main className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select className="rounded-md border p-2 text-sm">
                <option>Relevance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </div>
            <CarGrid filters={filters} />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
