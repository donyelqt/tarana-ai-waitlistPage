import React from 'react';

const AboutSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12">
            <h2 className="text-5xl font-medium mb-4">
              About <span className="bg-gradient-to-b from-blue-700 to-blue-500 text-transparent bg-clip-text">Tarana.ai</span>
            </h2>
            <p className="text-gray-600 mb-6">
              Tarana.ai is an AI-powered travel platform that creates real-time, personalized itineraries using live data from traffic, crowd density, weather, and mobility patterns. Built initially for Baguio City, Tarana helps tourists avoid congestion, discover hidden local gems, and enjoy smoother, more meaningful trips.
            </p>
            <p className="text-gray-600 mb-8">
              By distributing tourist flow and surfacing lesser-known spots, we aim to reduce overtourism, support small businesses, and make urban travel more sustainable. Think of us as the "Waze of Tourism" — helping cities breathe and travelers explore with purpose.
            </p>
            <div className="flex">
              <button className="bg-gradient-to-b from-blue-700 to-blue-500 text-white font-medium py-3 px-6 rounded-2xl mr-4 hover:to-blue-600 transition-colors">
                Join the Waitlist
              </button>
              <button className="bg-white text-blue-500 font-medium py-3 px-6 rounded-2xl border border-blue-500 hover:bg-blue-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0">
            <div className="bg-gray-200 w-full h-96 rounded-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 