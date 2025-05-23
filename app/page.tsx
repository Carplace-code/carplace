import FeaturedCars from "@/components/FeaturedCars";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import MarketTrends from "@/components/MarketTrends";

export default function HomePage() {
  return (
    <div className="space-y-16">
      <HeroSection />
      <FeaturedCars />
      <MarketTrends />
      <Footer />
    </div>
  );
}
