"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

type NavbarProps = {
  onJoinWaitlistClick: () => void;
};

const Navbar = ({ onJoinWaitlistClick }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  console.log('Navbar pathname:', pathname);

  const normalize = (path: string) => path.replace(/\/$/, "");
  const navLinkClass = (href: string, base?: string) =>
    normalize(pathname) === normalize(href)
      ? `${base ? base + " " : ""}text-blue-600 font-semibold`
      : `${base ? base + " " : ""}text-gray-600 hover:text-blue-600`;

  return (
    <header className="font-sans py-4 px-4 sm:px-6 md:px-8 relative">
      <nav className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/images/taranaai.png"
            alt="Tarana-ai logo"
            width={125}
            height={125}
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className={navLinkClass("/")}>Home</Link>
          <Link href="/about" className={navLinkClass("/about")}>About</Link>
          <Link href="/contact" className={navLinkClass("/contact")}>Contact</Link>
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
            <button
            onClick={onJoinWaitlistClick}
            className="bg-gradient-to-b from-blue-700 to-blue-500 text-white px-5 py-2 min-w-[160px] rounded-2xl font-semibold hover:to-blue-700 transition-colors text-sm sm:text-base"
            >
            Join the Waitlist
            </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="transition-transform duration-300 ease-in-out"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white rounded-lg shadow-lg p-4 mt-2 transition-all duration-300 ease-in-out transform ${
          isMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <Link
          href="/"
          className={navLinkClass("/", "block py-2")}
          onClick={() => setIsMenuOpen(false)}
        >
          Home
        </Link>
        <Link
          href="/about"
          className={navLinkClass("/about", "block py-2")}
          onClick={() => setIsMenuOpen(false)}
        >
          About
        </Link>
        <Link
          href="/contact"
          className={navLinkClass("/contact", "block py-2")}
          onClick={() => setIsMenuOpen(false)}
        >
          Contact
        </Link>
        <button
          onClick={() => {
            onJoinWaitlistClick();
            setIsMenuOpen(false);
          }}
          className="w-full mt-2 bg-gradient-to-b from-blue-700 to-blue-500 text-white px-5 py-2 min-w-[160px] rounded-2xl font-semibold hover:to-blue-700 transition-colors text-sm sm:text-base"
        >
          Join the Waitlist
        </button>
      </div>
    </header>
  );
};

export default Navbar; 