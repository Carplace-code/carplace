/* eslint-disable */

"use client";

import { Calendar, Fuel, Gauge, MapPin, Settings } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";

import AddToWishlistModal from "./AddToWishlistModal";

interface CarHeaderProps {
  listing: any;
}

export default function CarHeader({ listing }: CarHeaderProps) {
  const { brand, model, year, location, mileage, price, images, trim } = listing;
  const imageUrl = images?.[0]?.url || null;

  const formatPrice = (price: string | number) => `CLP $${Number(price).toLocaleString()}`;

  const getTransmissionLabel = (type: string) => {
    const labels = {
      automatic: "Automática",
      manual: "Manual",
      cvt: "CVT",
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getFuelLabel = (type: string) => {
    const labels = {
      gasoline: "Gasolina",
      diesel: "Diésel",
      hybrid: "Híbrido",
      electric: "Eléctrico",
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl">
      {/* Hero Image */}
      <div className="relative h-96 w-full">
        {imageUrl ? (
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={`${brand} ${model} ${year}`}
            fill
            className="object-cover"
            unoptimized
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
            <div className="text-center text-slate-500">
              <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-lg bg-slate-400">
                <Settings className="h-8 w-8" />
              </div>
              <p className="text-sm">Imagen no disponible</p>
            </div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Vehicle Info Overlay */}
        <div className="absolute bottom-6 left-6 text-white">
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="secondary" className="border-white/30 bg-white/20 text-white backdrop-blur-sm">
              {year}
            </Badge>
            {listing.isNew && <Badge className="border-0 bg-green-500/90 text-white backdrop-blur-sm">Nuevo</Badge>}
          </div>
          <h1 className="mb-2 text-3xl font-bold drop-shadow-lg">
            {brand} {model}
          </h1>
          <div className="flex items-center gap-4 text-sm opacity-90">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Gauge className="h-4 w-4" />
              <span>{mileage?.toLocaleString()} km</span>
            </div>
          </div>
        </div>

        {/* Price and Actions */}
        <div className="absolute right-6 bottom-6 flex items-center gap-3">
          <div
            onClick={() => window.open(listing.url, "_blank", "noopener,noreferrer")}
            className="group cursor-pointer rounded-xl bg-white/95 px-4 py-2 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-xl"
          >
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900 transition-colors group-hover:text-blue-700">
                {formatPrice(price)}
              </div>
              <div className="text-xs text-slate-600 transition-colors group-hover:text-blue-600">
                Click para ver oferta →
              </div>
            </div>
          </div>
          <AddToWishlistModal versionId={trim?.version?.id || trim?.versionId || ""} />
        </div>
      </div>

      {/* Vehicle Specifications Bar */}
      <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
        <div className="flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-slate-700">
            <Calendar className="h-4 w-4 text-slate-500" />
            <span className="font-medium">Año:</span>
            <span>{year}</span>
          </div>

          {trim?.fuelType && (
            <div className="flex items-center gap-2 text-slate-700">
              <Fuel className="h-4 w-4 text-slate-500" />
              <span className="font-medium">Combustible:</span>
              <span className="capitalize">{getFuelLabel(trim.fuelType)}</span>
            </div>
          )}

          {trim?.transmissionType && (
            <div className="flex items-center gap-2 text-slate-700">
              <Settings className="h-4 w-4 text-slate-500" />
              <span className="font-medium">Transmisión:</span>
              <span className="capitalize">{getTransmissionLabel(trim.transmissionType)}</span>
            </div>
          )}

          {trim?.motorSize && trim.motorSize > 0 && (
            <div className="flex items-center gap-2 text-slate-700">
              <span className="font-medium">Motor:</span>
              <span>{trim.motorSize}L</span>
            </div>
          )}
        </div>
      </div>

      {/* Additional Info */}
      {trim?.name && (
        <div className="border-t border-slate-100 bg-white px-6 py-3">
          <div>
            <h3 className="font-semibold text-slate-900">Versión</h3>
            <p className="text-sm text-slate-600">{trim.name}</p>
          </div>
        </div>
      )}
    </div>
  );
}
