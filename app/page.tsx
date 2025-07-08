import FeaturedListings from "@/components/FeaturedListings";
import HeroSection from "@/components/HeroSection";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedListings />
    </div>
  );
}
