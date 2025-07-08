"use client";

import { useAuth } from "@clerk/nextjs";
import type { Prisma } from "@prisma/client";
import { Calendar, Fuel } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import formatFuelType from "@/utils/formatFuelType";

import AddToWishlistModal from "./AddToWishlistModal";

export interface MinimumGridVersion
  extends Prisma.VersionGetPayload<{
    include: {
      model: {
        include: {
          brand: true;
        };
      };
      trims: {
        include: {
          carListings: {
            include: {
              images: true;
            };
          };
        };
      };
      wishlistItems: true;
    };
  }> {}

interface Props {
  version: MinimumGridVersion;
}

export default function VersionCard({ version: { id, model, trims, year } }: Props) {
  const { isSignedIn } = useAuth();
  const firstCarListingImageUrl = trims[0]?.carListings[0]?.images[0]?.url;
  const fuelTypes = [...new Set(trims.map((t) => formatFuelType(t.fuelType)))];
  const minPrice = Math.min(...trims.flatMap((t) => t.carListings.map((cl) => cl.price.toNumber())));
  const hasPrice = minPrice !== Number.POSITIVE_INFINITY;

  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:shadow-lg">
      <CardContent className="p-0">
        {/* Image Container */}
        <div className="bg-muted relative aspect-video overflow-hidden">
          {firstCarListingImageUrl ? (
            <Image
              src={firstCarListingImageUrl || "/placeholder.svg"}
              alt={`${model.brand.name} ${model.name}`}
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
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-sm">Sin imagen</p>
              </div>
            </div>
          )}

          {/* Wishlist button overlay */}
          {isSignedIn && (
            <div className="absolute top-2 right-2">
              <AddToWishlistModal versionId={id} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Brand and Model */}
          <div className="mb-2">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{model.brand.name}</p>
            <h3 className="line-clamp-1 text-lg leading-tight font-semibold">{model.name}</h3>
          </div>

          {/* Year and Fuel Type */}
          <div className="text-muted-foreground mb-3 flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{year}</span>
            </div>
            {fuelTypes.length > 0 && (
              <div className="flex items-center gap-1">
                <Fuel className="h-3 w-3" />
                <span className="line-clamp-1">{fuelTypes.join(", ")}</span>
              </div>
            )}
          </div>

          {/* Price */}
          {hasPrice && (
            <div className="mb-4">
              <p className="text-muted-foreground text-sm">Desde</p>
              <p className="text-primary text-xl font-bold">${minPrice.toLocaleString()}</p>
            </div>
          )}

          {/* Action Button */}
          <Button asChild className="w-full" size="sm">
            <Link href={`/versions/${id}`}>Ver detalles</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
