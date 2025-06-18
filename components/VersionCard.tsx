import { useAuth } from "@clerk/nextjs";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

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
    };
  }> {}

interface Props {
  version: MinimumGridVersion;
}

export default function VersionCard({ version: { id, model, trims, year } }: Props) {
  const { isSignedIn } = useAuth();

  const firstCarListingImageUrl = trims[0]?.carListings[0]?.images[0]?.url;
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="mb-4 h-32 overflow-hidden rounded-md bg-gray-200">
        {firstCarListingImageUrl ? (
          <Image
            src={firstCarListingImageUrl}
            alt={model.name}
            className="h-full w-full object-cover"
            width={300}
            height={128}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">Sin Imagen</div>
        )}
      </div>
      <div>
        <h4 className="text-xs font-semibold text-gray-500">{model.brand.name}</h4>
        <div className="flex w-full items-center justify-between">
          <h3 className="mb-1 font-semibold">{model.name}</h3>
          {isSignedIn && <AddToWishlistModal versionId={id} />}
        </div>
      </div>
      <p className="mb-2 text-sm text-gray-600">{year}</p>
      <p className="text-sm text-gray-500">{trims.map((t) => formatFuelType(t.fuelType)).join(", ")}</p>
      <Link
        href={`/versions/${id}`}
        className="mt-4 block w-full rounded-md bg-blue-600 py-2 text-center text-sm text-white hover:bg-blue-700"
      >
        Ver detalles
      </Link>
    </div>
  );
}
