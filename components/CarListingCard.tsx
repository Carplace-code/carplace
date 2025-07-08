import type { Prisma } from "@prisma/client";
import { Fuel, Gauge, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

export default function CarListingCard({
  carListing: { title, price, mileage: km, trim, source, images, location },
}: Props) {
  const imageUrl = images.length > 0 ? images[0].url : null;

  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:shadow-lg">
      <CardContent className="p-0">
        {/* Image Container */}
        <div className="bg-muted relative aspect-video overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />
          ) : (
            <div className="text-muted-foreground flex h-full w-full items-center justify-center">
              <div className="text-center">
                <div className="bg-muted-foreground/10 mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-sm">Sin imagen</p>
              </div>
            </div>
          )}

          {/* Source badge */}
          <div className="absolute top-2 right-2">
            <span className="bg-background/90 text-foreground rounded-full px-2 py-1 text-xs font-medium backdrop-blur-sm">
              {source.name}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <div className="mb-2">
            <h3 className="line-clamp-2 text-lg leading-tight font-semibold">{title}</h3>
          </div>

          {/* Details */}
          <div className="text-muted-foreground mb-3 flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              <Gauge className="h-3 w-3" />
              <span>{formatNumber(km, { useThousandsSeparator: true })} km</span>
            </div>
            <div className="flex items-center gap-1">
              <Fuel className="h-3 w-3" />
              <span>{formatFuelType(trim.fuelType)}</span>
            </div>
          </div>

          {/* Location */}
          {location && (
            <div className="text-muted-foreground mb-3 flex items-center gap-1 text-sm">
              <MapPin className="h-3 w-3" />
              <span className="line-clamp-1">{location}</span>
            </div>
          )}

          {/* Price */}
          <div className="mb-4">
            <p className="text-primary text-xl font-bold">{formatPrice(price.toString())}</p>
          </div>

          {/* Action Button */}
          <Button asChild className="w-full" size="sm">
            <Link href={`/versions/${trim.versionId}`}>Ver Detalles</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
