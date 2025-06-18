import FeaturedListings from "@/components/FeaturedListings";
import HeroSection from "@/components/HeroSection";
import MarketTrends from "@/components/MarketTrends";

export default function HomePage() {
  return (
    <div className="space-y-16">
      <HeroSection />
      <FeaturedListings />
      <MarketTrends />
    </div>
  );
}
