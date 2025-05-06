import CarHeader from "@/components/CarHeader";
import CarSpecs from "@/components/CarSpecs";
import MarketListings from "@/components/MarketListings";
import PriceHistory from "@/components/PriceHistory";
import SellerNotes from "@/components/SellerNotes";
import SimilarVehicles from "@/components/SimilarVehicles";

export default function CarDetailsPage() {
  return (
    <div className="space-y-10 px-4 py-6 lg:px-10">
      <CarHeader />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CarSpecs />
        <SellerNotes />
      </div>
      <MarketListings />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PriceHistory />
        <SimilarVehicles />
      </div>
    </div>
  );
}
