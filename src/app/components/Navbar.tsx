"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

type NavbarProps = {
  onJoinWaitlistClick: () => void;
};

const Navbar = ({ onJoinWaitlistClick }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="py-4 px-4 sm:px-6 md:px-8 relative">
      <nav className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/file.svg"
            alt="Tarana-ai logo"
            width={32}
            height={32}
            className="h-7 w-7 sm:h-8 sm:w-8"
          />
          <span className="text-lg sm:text-xl font-bold">Tarana-ai</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-600 hover:text-blue-600">Home</Link>
          <Link href="/about" className="text-gray-600 hover:text-blue-600">About</Link>
          <Link href="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link>
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
            <button
            onClick={onJoinWaitlistClick}
            className="bg-gradient-to-b from-blue-700 to-blue-500 text-white px-5 py-2 rounded-2xl font-medium hover:to-blue-700 transition-colors text-sm sm:text-base"
            >
            Join the Waitlist
            </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 bg-white rounded-lg shadow-lg p-4">
          <Link href="/" className="block py-2 text-gray-600 hover:text-blue-600">Home</Link>
          <Link href="/about" className="block py-2 text-gray-600 hover:text-blue-600">About</Link>
          <Link href="/contact" className="block py-2 text-gray-600 hover:text-blue-600">Contact</Link>
           <button
            onClick={() => {
                onJoinWaitlistClick();
                setIsMenuOpen(false);
            }}
            className="w-full mt-2 bg-gradient-to-b from-blue-700 to-blue-500 text-white px-5 py-2 rounded-2xl font-medium hover:to-blue-700 transition-colors text-sm sm:text-base"
            >
            Join the Waitlist
            </button>
        </div>
      )}
    </header>
  );
};

export default Navbar; 