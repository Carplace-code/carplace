import Image from "next/image";
import Link from "next/link";

interface CarCardProps {
  id: string;
  title: string;
  price: string;
  platform: string;
  km: string;
  fuel: string;
  imageUrl?: string;
}

export default function CarCard({ id, title, price, platform, km, fuel, imageUrl }: CarCardProps) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="mb-4 h-32 overflow-hidden rounded-md bg-gray-200">
        {imageUrl ? (
          <Image src={imageUrl} alt={title} className="h-full w-full object-cover" width={300} height={128} />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">No Image</div>
        )}
      </div>
      <h3 className="mb-1 font-semibold">{title}</h3>
      <p className="mb-2 text-sm text-gray-600">
        {price} • {platform}
      </p>
      <p className="text-sm text-gray-500">
        {km} • {fuel}
      </p>
      <Link
        href={`/cars/${id}`}
        className="mt-4 block w-full rounded-md bg-blue-600 py-2 text-center text-sm text-white hover:bg-blue-700"
      >
        View Details
      </Link>
    </div>
  );
}
