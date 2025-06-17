import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import HowItWorksSection from "./components/HowItWorks";
import AboutSection from "./components/AboutSection";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <AboutSection />
    </main>
  );
}
