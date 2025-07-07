import AddToWishlistModal from "./AddToWishlistModal";

interface CarHeaderProps {
  carId: string;
}

export default function CarHeader({ carId }: CarHeaderProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-md shadow">
      <div className="h-64 w-full bg-gray-200" />
      <div className="absolute bottom-4 left-6 text-white">
        <h1 className="text-2xl font-bold">Mercedes-Benz C200 2023</h1>
        <p className="text-sm">Santiago, Chile • 18,000 km</p>
      </div>
      <div className="absolute right-6 bottom-4 flex items-center space-x-4">
        <div className="text-xl font-semibold text-white">CLP $35,990,000</div>
        <AddToWishlistModal versionId={carId} />
      </div>
    </div>
  );
}
