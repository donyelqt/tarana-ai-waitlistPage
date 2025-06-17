import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="py-4 px-4 md:px-8">
      <nav className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/file.svg" alt="Tarana-ai logo" width={32} height={32} />
          <span className="text-xl font-bold">Tarana-ai</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-600 hover:text-blue-600">Home</Link>
          <Link href="/about" className="text-gray-600 hover:text-blue-600">About</Link>
          <Link href="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link>
        </div>

        {/* CTA Button */}
        <Link href="/waitlist" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          Join the Waitlist
        </Link>
      </nav>
    </header>
  );
};

export default Navbar; 