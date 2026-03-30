import { createPageMetadata } from "@/lib/seo/page-metadata";
import CallToActionSection from "./_components/CallToActionSection";
import DiscoverSection from "./_components/DiscoverSection";
import FeaturesSection from "./_components/FeaturesSection";
import HeroSection from "./_components/HeroSection";

export const metadata = createPageMetadata({
  title: "Find Your Perfect Rental Home",
  description:
    "Browse thousands of verified rental listings including apartments, houses, condos, and townhomes. Search by location, price, amenities, and more. Apply online in minutes with Rentiful.",
});

const LandingPage = () => {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <DiscoverSection />
      <CallToActionSection />
    </div>
  );
};

export default LandingPage;
