import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import PainSection from "@/components/landing/PainSection";
import FeatureTabsSection from "@/components/landing/FeatureTabsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import AlternatingFeatures from "@/components/landing/AlternatingFeatures";
import PenaltiesSection from "@/components/landing/PenaltiesSection";
import ScenarioSection from "@/components/landing/ScenarioSection";
import RetoricalQuestionsSection from "@/components/landing/RetoricalQuestionsSection";
import StatsSection from "@/components/landing/StatsSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CaseStudySection from "@/components/landing/CaseStudySection";
import ComparisonTable from "@/components/landing/ComparisonTable";
import IntegrationsSection from "@/components/landing/IntegrationsSection";
import MobileAppSection from "@/components/landing/MobileAppSection";
import TrustBadges from "@/components/landing/TrustBadges";
import PricingSection from "@/components/landing/PricingSection";
import FaqSection from "@/components/landing/FaqSection";
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
      <PenaltiesSection />
      <ScenarioSection />
      <RetoricalQuestionsSection />
      <StatsSection />
      <TestimonialsSection />
      <ComparisonTable />
      <IntegrationsSection />
      <MobileAppSection />
      <TrustBadges />
      <PricingSection />
      <FaqSection />
      <ManifestoSection />
      <FinalCtaSection />
      <LandingFooter />
      <MobileStickyBar />
    </div>
  );
}
