"use client";
import Image from "next/image";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { useState } from "react";
import { toast } from "../../hooks/use-toast";

type WaitlistModalProps = {
  onClose: () => void;
};

const WaitlistModal = ({ onClose }: WaitlistModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("Local Resident");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("/api/waitlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, userType }),
    });

    if (response.ok) {
      toast({
        title: "Successfully joined!",
        description: "Thank you for joining the waitlist!",
      });
      onClose();
    } else {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-4xl shadow-2xl w-full max-w-7xl mx-auto flex flex-col md:flex-row overflow-hidden max-h-screen overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 bg-white rounded-t-4xl md:rounded-l-4xl md:rounded-tr-none">
          <div className="flex items-center space-x-2 mb-6">
            <Image src="/images/taranaai.png" alt="Tarana-ai logo" width={120} height={120} />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-blue-600 mb-2">
            Join our Waitlist
          </h2>
          <h1 className="text-2xl md:text-4xl font-extrabold mb-4 leading-tight">
            Get a Personalized Baguio Trip Plan in Seconds!
          </h1>
          <p className="text-gray-600 mb-8 text-sm md:text-base">
            Join our early waitlist and get priority access to Tarana.ai — your
            AI-powered itinerary planner that saves time, avoids crowds, and
            helps you discover hidden gems.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6 mt-8 md:mt-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 text-white p-3 rounded-full">
                <CiMail size={20} />
              </div>
              <div>
                <p className="font-semibold text-sm">E-mail</p>
                <p className="text-xs text-gray-500">hello@tarana-ai.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 text-white p-3 rounded-full">
                <FaFacebookF size={20} />
              </div>
              <div>
                <p className="font-semibold text-sm">Facebook</p>
                <p className="text-xs text-gray-500">/tarana-ai</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
               <div className="bg-blue-600 text-white p-3 rounded-full">
                <FaInstagram size={20} />
              </div>
              <div>
                <p className="font-semibold text-sm">Instagram</p>
                <p className="text-xs text-gray-500">@tarana.app</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full bg-gray-100 md:my-12 md:mr-8 rounded-b-4xl md:rounded-4xl md:w-1/2 p-6 sm:p-8 md:p-12">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter your Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your Email Address"
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Are you a:</label>
                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-start space-y-2 sm:space-y-0 sm:space-x-4">
                    <label className="flex items-center cursor-pointer p-2 rounded-lg">
                        <input id="tourist" name="userType" type="radio" className="focus:ring-blue-500 h-4 w-4 border-gray-300 accent-blue-600" value="Tourist/Visitor" checked={userType === 'Tourist/Visitor'} onChange={e => setUserType(e.target.value)} />
                        <span className="ml-2 block text-sm text-gray-900">
                        Tourist/Visitor
                        </span>
                    </label>
                    <label className="flex items-center cursor-pointer p-2 rounded-lg">
                        <input id="resident" name="userType" type="radio" className="focus:ring-blue-500 h-4 w-4 border-gray-300 accent-blue-600" value="Local Resident" checked={userType === 'Local Resident'} onChange={e => setUserType(e.target.value)} />
                        <span className="ml-2 block text-sm text-gray-900">
                        Local Resident
                        </span>
                    </label>
                    <label className="flex items-center cursor-pointer p-2 rounded-lg">
                        <input id="businessOwner" name="userType" type="radio" className="focus:ring-blue-500 h-4 w-4 border-gray-300 accent-blue-600" value="Business Owner" checked={userType === 'Business Owner'} onChange={e => setUserType(e.target.value)} />
                        <span className="ml-2 block text-sm text-gray-900">
                        Business Owner
                        </span>
                    </label>
                </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-b from-blue-700 to-blue-500 text-white py-3 rounded-2xl font-semibold hover:to-blue-700 transition-colors text-base"
            >
              Join the Waitlist
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WaitlistModal; 