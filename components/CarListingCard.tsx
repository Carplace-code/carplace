import type { Prisma } from "@prisma/client";
import { Fuel, Gauge } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import formatFuelType from "@/utils/formatFuelType";
import formatNumber from "@/utils/formatNumber";
import formatPrice from "@/utils/formatPrice";

interface MinimumCarListing
  extends Prisma.CarListingGetPayload<{
    include: {
      images: true;
      source: true;
      trim: true;
    };
  }> {}

interface Props {
  carListing: MinimumCarListing;
}

export default function CarListingCard({ carListing: { title, price, mileage: km, trim, source, images } }: Props) {
  const imageUrl = images.length > 0 ? images[0].url : null;

  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      {/* Image container */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        {imageUrl ? (
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            width={400}
            height={192}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="mb-2 text-4xl">🚗</div>
              <div className="text-sm">Sin Imagen</div>
            </div>
          </div>
        )}

        {/* Source badge */}
        <div className="absolute top-3 right-3">
          <span className="rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-gray-700 backdrop-blur-sm">
            {source.name}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="mb-3 line-clamp-2 font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
          {title}
        </h3>

        <div className="mb-4 text-2xl font-bold text-blue-600">{formatPrice(price.toString())}</div>

        {/* Details */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Gauge className="h-4 w-4" />
            <span>{formatNumber(km, { useThousandsSeparator: true })} km</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Fuel className="h-4 w-4" />
            <span>{formatFuelType(trim.fuelType)}</span>
          </div>
        </div>

        {/* Action button */}
        <Link
          href={`/versions/${trim.versionId}`}
          className="block w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 py-3 text-center font-medium text-white transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-lg"
        >
          Ver Detalles
        </Link>
      </div>
    </div>
  );
}
