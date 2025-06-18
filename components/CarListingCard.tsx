import { Prisma } from "@prisma/client";
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
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="mb-4 h-32 overflow-hidden rounded-md bg-gray-200">
        {imageUrl ? (
          <Image src={imageUrl} alt={title} className="h-full w-full object-cover" width={300} height={128} />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">Sin Imagen</div>
        )}
      </div>
      <div className="flex w-full items-center justify-between">
        <h3 className="mb-1 font-semibold">{title}</h3>
      </div>
      <p className="mb-2 text-sm text-gray-600">
        {formatPrice(price.toString())} • {source.name}
      </p>
      <p className="text-sm text-gray-500">
        {formatNumber(km, { useThousandsSeparator: true })} • {formatFuelType(trim.fuelType)}
      </p>
      <Link
        href={`/versions/${trim.versionId}`}
        className="mt-4 block w-full rounded-md bg-blue-600 py-2 text-center text-sm text-white hover:bg-blue-700"
      >
        Ver detalles
      </Link>
    </div>
  );
}
