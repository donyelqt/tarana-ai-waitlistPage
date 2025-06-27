"use client";

import { useState } from "react";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import HowItWorksSection from "./components/HowItWorks";
import WhyUseSection from "./components/WhyUseSection";
import TravelersSection from "./components/TravelersSection";
import Footer from "./components/Footer";
import WaitlistModal from "./components/WaitlistModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <main>
      <Navbar onJoinWaitlistClick={openModal} />
      <HeroSection onJoinWaitlistClick={openModal} />
      <HowItWorksSection />
      <WhyUseSection />
      <TravelersSection />
      <Footer onJoinWaitlistClick={openModal} />
      {isModalOpen && <WaitlistModal onClose={closeModal} />}
    </main>
  );
}
