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

  const [page, setPage] = useState(1);

  // 🔄 Resetear página cuando cambian los filtros
  const handleSetFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(1); // Reinicia a la página 1
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-grow px-4 py-6 lg:px-10">
        <ActiveFilters filters={filters} setFilters={handleSetFilters} brands={brands} />
        <div className="mt-6 flex gap-6">
          <aside className="hidden w-64 lg:block">
            <SidebarFilters brands={brands} filters={filters} setFilters={handleSetFilters} />
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
            <CarGrid filters={filters} page={page} setPage={setPage} />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
