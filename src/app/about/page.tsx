'use client';

import { useState } from "react";
import AboutIntro from "../components/about/AboutIntro";
import Navbar from "../components/Navbar";
import AboutSmartTravel from "../components/about/AboutSmartTravel";
import AboutPotentialImpact from "../components/about/AboutPotentialImpact";
import AboutTeam from "../components/about/AboutTeam";
import WaitlistModal from "../components/WaitlistModal";

export default function AboutPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  return (
    <div className="font-sans bg-white min-h-screen">
      <Navbar onJoinWaitlistClick={openModal} />
      <main>
        <AboutIntro onJoinWaitlistClick={openModal} />
        <AboutSmartTravel />
        <AboutPotentialImpact />
        <AboutTeam />
      </main>
      {isModalOpen && <WaitlistModal onClose={closeModal} />}
    </div>
  );
} 