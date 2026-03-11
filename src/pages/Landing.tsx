import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import PainSection from "@/components/landing/PainSection";
import FeatureTabsSection from "@/components/landing/FeatureTabsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import AlternatingFeatures from "@/components/landing/AlternatingFeatures";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PricingSection from "@/components/landing/PricingSection";
import ManifestoSection from "@/components/landing/ManifestoSection";
import FinalCtaSection from "@/components/landing/FinalCtaSection";
import LandingFooter from "@/components/landing/LandingFooter";
import MobileStickyBar from "@/components/landing/MobileStickyBar";

export default function Landing() {
  return (
    <div className="font-landing-body">
      <LandingNavbar />
      <HeroSection />
      <PainSection />
      <FeatureTabsSection />
      <HowItWorksSection />
      <AlternatingFeatures />
      <TestimonialsSection />
      <PricingSection />
      <ManifestoSection />
      <FinalCtaSection />
      <LandingFooter />
      <MobileStickyBar />
    </div>
  );
}
