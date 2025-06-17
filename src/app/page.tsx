import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import HowItWorksSection from "./components/HowItWorks";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
    </main>
  );
}
