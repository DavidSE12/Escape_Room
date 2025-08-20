"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className=" w-full bg-amber-200 ">
      <div className="  ">
        <div className="flex flex-row h-16 justify-around items-center">

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 font-bold text-black ">
            <Link href = "/" className="hover:text-blue-600">Home</Link>
            <Link href="/site/about" className="hover:text-blue-600">About</Link>
            <Link href="/site/services" className="hover:text-blue-600">Services</Link>
            <Link href="/contact" className="hover:text-blue-600">Contact</Link>
          </div>



          {/* Mobile Hamburger */}
          <div className="bg-amber-400">
            <button onClick={() => setIsOpen(!isOpen)} className="text-black">
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className = "flex flex-col items-end">
      {isOpen && (
        <div className=" bg-white text-black font-semibold px-4 pb-3 space-y-2 w-2xs text-center">
          <Link href="/" className="block hover:text-blue-600">Home</Link>
          <Link href="/about" className="block hover:text-blue-600">About</Link>
          <Link href="/services" className="block hover:text-blue-600">Services</Link>
          <Link href="/contact" className="block hover:text-blue-600">Contact</Link>
        </div>
      )}
      </div>
    </nav>
  );
}
