import HeroSection from "../components/Home/HeroSection";
import FeaturesSection from "../components/Home/FeaturesSection";
import AboutSection from "../components/Home/AboutSection";
import { usePageTitle } from "../hooks/usePageTitle";

export default function Home() {
  usePageTitle();
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
    </div>
  );
}
