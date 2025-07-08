"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useBrandModels } from "@/hooks/useBrandModels";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function FilterModal({ isOpen, onClose, title, children }: FilterModalProps) {
  if (!isOpen) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" type="button">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function HeroSection() {
  const router = useRouter();
  const { data: brandModelsMap = {} } = useBrandModels();

  // Estados para los modals
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Estados para los filtros seleccionados
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>("");
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");

  // Opciones de tipos de vehículo
  const vehicleTypes = [
    { value: "sedan", label: "Sedán" },
    { value: "suv", label: "SUV" },
    { value: "hatchback", label: "Hatchback" },
    { value: "coupe", label: "Coupé" },
    { value: "convertible", label: "Convertible" },
    { value: "wagon", label: "Station Wagon" },
    { value: "van", label: "Van" },
    { value: "truck", label: "Camioneta" },
    { value: "other", label: "Otro" },
  ];

  // Helper function para evitar ternary anidado
  const getPriceDisplayText = (min: string, max: string) => {
    if (min && max) return `${min} - ${max}`;
    if (min) return `Desde ${min}`;
    return `Hasta ${max}`;
  };

  const openModal = (modalName: string) => {
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const applyFilters = () => {
    const searchParams = new URLSearchParams();

    // Agregar filtros si están seleccionados
    if (selectedBrand) {
      searchParams.set("brand", selectedBrand);
    }
    if (selectedVehicleType) {
      searchParams.set("bodyType", selectedVehicleType);
    }
    if (priceMin) {
      searchParams.set("minPrice", priceMin);
    }
    if (priceMax) {
      searchParams.set("maxPrice", priceMax);
    }

    // Redireccionar a /browse con los filtros
    const url = `/browse${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    router.push(url);
  };

  const hasFilters = selectedBrand || selectedVehicleType || priceMin || priceMax;

  return (
    <section className="bg-blue-50 px-6 py-16 text-center">
      <h1 className="mb-4 text-3xl font-bold md:text-5xl">
        Find the best used car deals in Chile —<br />
        all in one place!
      </h1>
      <p className="mb-6 text-gray-600">Compare prices across Chileautos, Yapo, and Facebook Marketplace instantly</p>

      {/* Filtros */}
      <div className="mb-6 flex flex-wrap justify-center gap-4">
        <button
          onClick={() => openModal("price")}
          className="rounded-md border bg-white px-4 py-2 shadow-sm transition-shadow hover:shadow-md"
          type="button"
        >
          Price Range
          {(priceMin || priceMax) && (
            <span className="ml-2 font-medium text-blue-600">{getPriceDisplayText(priceMin, priceMax)}</span>
          )}
        </button>

        <button
          onClick={() => openModal("brand")}
          className="rounded-md border bg-white px-4 py-2 shadow-sm transition-shadow hover:shadow-md"
          type="button"
        >
          Brand
          {selectedBrand && <span className="ml-2 font-medium text-blue-600">{selectedBrand}</span>}
        </button>

        <button
          onClick={() => openModal("vehicle")}
          className="rounded-md border bg-white px-4 py-2 shadow-sm transition-shadow hover:shadow-md"
          type="button"
        >
          Vehicle Type
          {selectedVehicleType && (
            <span className="ml-2 font-medium text-blue-600">
              {vehicleTypes.find((v) => v.value === selectedVehicleType)?.label}
            </span>
          )}
        </button>
      </div>

      {/* Botón de búsqueda */}
      {hasFilters && (
        <button
          onClick={applyFilters}
          className="rounded-md bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          type="button"
        >
          Buscar Autos
        </button>
      )}

      {/* Modal de Precio */}
      <FilterModal isOpen={activeModal === "price"} onClose={closeModal} title="Rango de Precio">
        <div className="space-y-4">
          <div>
            <label htmlFor="price-min" className="mb-1 block text-sm font-medium text-gray-700">
              Precio Mínimo (CLP)
            </label>
            <input
              id="price-min"
              type="number"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              placeholder="Ej: 5000000"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500"
            />
          </div>
        </div>
        <div>
          <label htmlFor="price-max" className="mb-1 block text-sm font-medium text-gray-700">
            Precio Máximo (CLP)
          </label>
          <input
            id="price-max"
            type="number"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            placeholder="Ej: 20000000"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div className="flex gap-3 pt-4">
          <button
            onClick={() => {
              setPriceMin("");
              setPriceMax("");
            }}
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            type="button"
          >
            Limpiar
          </button>
          <button
            onClick={closeModal}
            className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            type="button"
          >
            Aplicar
          </button>
        </div>
      </FilterModal>

      {/* Modal de Marca */}
      <FilterModal isOpen={activeModal === "brand"} onClose={closeModal} title="Seleccionar Marca">
        <div className="max-h-60 space-y-2 overflow-y-auto">
          <button
            onClick={() => setSelectedBrand("")}
            className={`w-full rounded-md px-3 py-2 text-left hover:bg-gray-100 ${
              !selectedBrand ? "bg-blue-100 text-blue-800" : ""
            }`}
            type="button"
          >
            Todas las marcas
          </button>
          {Object.keys(brandModelsMap).map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`w-full rounded-md px-3 py-2 text-left hover:bg-gray-100 ${
                selectedBrand === brand ? "bg-blue-100 text-blue-800" : ""
              }`}
              type="button"
            >
              {brand}
            </button>
          ))}
        </div>
        <div className="flex gap-3 pt-4">
          <button
            onClick={() => setSelectedBrand("")}
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            type="button"
          >
            Limpiar
          </button>
          <button
            onClick={closeModal}
            className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            type="button"
          >
            Aplicar
          </button>
        </div>
      </FilterModal>

      {/* Modal de Tipo de Vehículo */}
      <FilterModal isOpen={activeModal === "vehicle"} onClose={closeModal} title="Tipo de Vehículo">
        <div className="space-y-2">
          <button
            onClick={() => setSelectedVehicleType("")}
            className={`w-full rounded-md px-3 py-2 text-left hover:bg-gray-100 ${
              !selectedVehicleType ? "bg-blue-100 text-blue-800" : ""
            }`}
            type="button"
          >
            Todos los tipos
          </button>
          {vehicleTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedVehicleType(type.value)}
              className={`w-full rounded-md px-3 py-2 text-left hover:bg-gray-100 ${
                selectedVehicleType === type.value ? "bg-blue-100 text-blue-800" : ""
              }`}
              type="button"
            >
              {type.label}
            </button>
          ))}
        </div>
        <div className="flex gap-3 pt-4">
          <button
            onClick={() => setSelectedVehicleType("")}
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            type="button"
          >
            Limpiar
          </button>
          <button
            onClick={closeModal}
            className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            type="button"
          >
            Aplicar
          </button>
        </div>
      </FilterModal>
    </section>
  );
}
