/* eslint-disable */

"use client";

import axios from "axios";
import { AlertCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import CarHeader from "@/components/CarHeader";
import PriceHistoryChart from "@/components/PriceHistoryChart";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

const friendlyValue = (value: any, fallback = "No especificado") => {
  if (
    value === null ||
    value === undefined ||
    value === "null" ||
    value === "Null" ||
    value === "placeholder" ||
    value === ""
  ) {
    return fallback;
  }
  return value;
};

export default function CarDetailsPage() {
  const { id: versionId } = useParams();
  const [listings, setListings] = useState<any[]>([]);
  const [selectedListing, setSelectedListing] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!versionId) return;

    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`/api/car_listings/by-version/${versionId}`);
        const { brand, model, year, listings: allListings } = res.data;

        if (!allListings || allListings.length === 0) {
          setListings([]);
          setSelectedListing(null);
          return;
        }

        const cheapest = allListings.reduce((min: any, curr: any) =>
          Number(curr.price) < Number(min.price) ? curr : min
        );

        const normalizedCheapest = { ...cheapest, brand, model, year };
        const normalizedListings = allListings.map((l: any) => ({
          ...l,
          brand,
          model,
          year,
        }));

        setListings(normalizedListings);
        setSelectedListing(normalizedCheapest);
      } catch (err) {
        console.error("Failed to fetch listings", err);
        setError("Error al cargar los datos del vehículo. Por favor, intenta nuevamente.");
        setListings([]);
        setSelectedListing(null);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [versionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="space-y-8">
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl">
              <Skeleton className="h-96 w-full" />
              <div className="absolute bottom-6 left-6 space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="absolute right-6 bottom-6 flex items-center space-x-3">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <Skeleton className="h-64 w-full rounded-xl" />
                <Skeleton className="h-48 w-full rounded-xl" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-48 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto max-w-md px-4">
          <Alert variant="destructive" className="bg-white shadow-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-base">{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!selectedListing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto max-w-md px-4 text-center">
          <div className="rounded-2xl bg-white p-8 shadow-xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <AlertCircle className="h-8 w-8 text-slate-400" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-slate-900">No se encontraron vehículos</h2>
            <p className="text-slate-600">No hay listados disponibles para este modelo en este momento.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="space-y-8">
          <CarHeader listing={selectedListing} />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="rounded-2xl bg-white p-6 shadow-lg">
                <h2 className="mb-6 text-2xl font-bold text-slate-900">Detalles del Vehículo</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 py-2">
                      <span className="font-medium text-slate-600">Año</span>
                      <span className="text-slate-900">{selectedListing.year}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 py-2">
                      <span className="font-medium text-slate-600">Kilometraje</span>
                      <span className="text-slate-900">{selectedListing.mileage?.toLocaleString()} km</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 py-2">
                      <span className="font-medium text-slate-600">Color Exterior</span>
                      <span className="text-slate-900">{friendlyValue(selectedListing.exteriorColor)}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 py-2">
                      <span className="font-medium text-slate-600">Color Interior</span>
                      <span className="text-slate-900">{friendlyValue(selectedListing.interiorColor)}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 py-2">
                      <span className="font-medium text-slate-600">Combustible</span>
                      <span className="text-slate-900 capitalize">{friendlyValue(selectedListing.trim?.fuelType, "N/A")}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 py-2">
                      <span className="font-medium text-slate-600">Transmisión</span>
                      <span className="text-slate-900 capitalize">{friendlyValue(selectedListing.trim?.transmissionType, "N/A")}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 py-2">
                      <span className="font-medium text-slate-600">Motor</span>
                      <span className="text-slate-900">
                        {(() => {
                          const motor = selectedListing.trim?.motorSize;
                          const numeric = parseFloat(String(motor).replace(/[^\d.-]/g, ""));
                          return numeric > 0 ? `${numeric}L` : "No especificado";
                        })()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 py-2">
                      <span className="font-medium text-slate-600">Condición</span>
                      <span className="text-slate-900">{selectedListing.isNew ? "Nuevo" : "Usado"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-xl font-bold text-slate-900">Descripción</h3>
                <p className="leading-relaxed text-slate-700">
                  {friendlyValue(
                    selectedListing.description,
                    "Este vehículo se encuentra en excelente estado y ha sido mantenido regularmente. Ideal para familias que buscan comodidad, seguridad y eficiencia en el consumo de combustible."
                  )}
                </p>
              </div>

              <PriceHistoryChart currentPrice={Number(selectedListing.price)} listings={listings} />
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">Información del Vendedor</h3>
                <div className="space-y-4">
                  <div>
                    <span className="mb-1 block font-medium text-slate-600">Nombre</span>
                    <span className="text-slate-900">{friendlyValue(selectedListing.seller?.name, "Nombre no disponible")}</span>
                  </div>
                  <div>
                    <span className="mb-1 block font-medium text-slate-600">Ubicación</span>
                    <span className="text-slate-900">{friendlyValue(selectedListing.location, "Ubicación no disponible")}</span>
                  </div>
                  <div>
                    <span className="mb-1 block font-medium text-slate-600">Tipo</span>
                    <span className="text-slate-900 capitalize">{friendlyValue(selectedListing.seller?.type, "Particular")}</span>
                  </div>
                  <div>
                    <span className="mb-1 block font-medium text-slate-600">Publicado</span>
                    <span className="text-slate-900">
                      {selectedListing.publishedAt ? new Date(selectedListing.publishedAt).toLocaleDateString("es-CL") : "Fecha no disponible"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Otras Ofertas */}
              {listings.length > 1 && (
                <div className="rounded-2xl bg-white p-6 shadow-lg">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">Otras Ofertas Disponibles</h3>
                  <div className="space-y-3">
                    {listings
                      .filter((listing) => listing.id !== selectedListing.id)
                      .slice(0, 4)
                      .map((listing) => (
                        <div
                          key={listing.id}
                          onClick={() => window.open(listing.url, "_blank", "noopener,noreferrer")}
                          className="group cursor-pointer rounded-xl border border-slate-200 bg-gradient-to-r from-white to-slate-50 p-4 transition-all duration-200 hover:border-blue-300 hover:shadow-md"
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <div className="flex-1">
                              <div className="mb-2 flex items-center gap-2">
                                <span className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                                  {listing.source?.name || "Sitio Web"}
                                </span>
                                <div className="h-1 w-1 rounded-full bg-slate-300" />
                                <span className="text-xs text-slate-500">{listing.location}</span>
                              </div>
                              <p className="mb-1 line-clamp-2 text-sm font-medium text-slate-900 transition-colors group-hover:text-blue-700">
                                {listing.title}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-slate-600">
                                <span>{listing.mileage?.toLocaleString()} km</span>
                                <span>•</span>
                                <span>{listing.year}</span>
                              </div>
                            </div>
                            <div className="ml-4 text-right">
                              <div className="mb-1 text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-700">
                                CLP ${Number(listing.price).toLocaleString()}
                              </div>
                              <div className="text-xs text-slate-500 transition-colors group-hover:text-blue-600">
                                Click para ver →
                              </div>
                            </div>
                          </div>
                          {/* Comparación de precio */}
                          {Number(listing.price) !== Number(selectedListing.price) && (
                            <div className="border-t border-slate-100 pt-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-500">vs. oferta principal:</span>
                                <span
                                  className={`font-medium ${
                                    Number(listing.price) < Number(selectedListing.price)
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {Number(listing.price) < Number(selectedListing.price) ? "-" : "+"}
                                  CLP $
                                  {Math.abs(Number(listing.price) - Number(selectedListing.price)).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                  {listings.length > 5 && (
                    <div className="mt-4 text-center">
                      <p className="text-sm text-slate-500">+{listings.length - 4} ofertas más disponibles</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
