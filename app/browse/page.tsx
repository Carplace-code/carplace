import ActiveFilters from "@/components/ActiveFilters";
import CarGrid from "@/components/CarGrid";
import Footer from "@/components/Footer";
import Pagination from "@/components/Pagination";
import SidebarFilters from "@/components/SidebarFilters";

export default function BrowsePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-grow px-4 py-6 lg:px-10">
        <ActiveFilters />
        <div className="mt-6 flex gap-6">
          <aside className="hidden w-64 lg:block">
            <SidebarFilters />
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
            <CarGrid />
            <Pagination />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
