'use client';

import AboutIntro from "../components/about/AboutIntro";
import Navbar from "../components/Navbar";
import AboutSmartTravel from "../components/about/AboutSmartTravel";
import AboutPotentialImpact from "../components/about/AboutPotentialImpact";
import AboutTeam from "../components/about/AboutTeam";

export default function AboutPage() {
  return (
    <div className="font-sans bg-white min-h-screen">
      <Navbar onJoinWaitlistClick={() => {}} />
      <main>
        <AboutIntro onJoinWaitlistClick={() => {}} />
        <AboutSmartTravel />
        <AboutPotentialImpact />
        <AboutTeam /> 
      </main>
    </div>
  );
} 