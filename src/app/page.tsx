import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import HowItWorksSection from "./components/HowItWorks";
import AboutSection from "./components/AboutSection";
import WhyUseSection from "./components/WhyUseSection";
import TravelersSection from "./components/TravelersSection";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <AboutSection />
      <WhyUseSection />
      <TravelersSection />
    </main>
  );
}
