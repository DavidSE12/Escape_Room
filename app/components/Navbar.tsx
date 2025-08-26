"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import ThemeToggle from "./ThemeToggle";


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("/");

  useEffect(() => {
    const savedTab = Cookies.get("lastTab");
    if(savedTab){
      setActiveTab(savedTab);
    }
  }, []);

  // When user clicks a tab -> update and save cookie
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    Cookies.set("lastTab" , tab, {expires: 3});
  };




  return (
    <nav className=" w-full relative  ">
        <div className="flex flex-row h-16 justify-between items-center px-6">

          {/* Left Side Navbar */}
          <div className="hidden md:flex space-x-8 font-bold ">
            <Link href = "/" onClick={() => handleTabClick("/")} className="hover:text-blue-600">Home</Link>
            <Link href = "/site/about" onClick={() => handleTabClick("/site/about")} className="hover:text-blue-600">About</Link>
            <Link href="/site/prelab" onClick={() => handleTabClick("/site/prelab")} className="hover:text-blue-600">Pre-lab Questions</Link>
            <Link href="/site/escaperoom" onClick={() => handleTabClick("/site/escaperoom")} className="hover:text-blue-600">Escapse Room</Link>
            <Link href="/site/codingrace" onClick={() => handleTabClick("/codingrace")} className="hover:text-blue-600">Coding Race</Link>
          </div>




          {/* Right Side Navbar */}
          <div className="flex flex-row items-center space-x-4">

            <ThemeToggle></ThemeToggle>
            <div className ="relative"> 
              <button 
                onClick={() => setIsOpen(!isOpen)}>
                  ☰
              </button>
            

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 bg-white font-semibold shadow-lg rounded-md w-40 z-50">
          <Link href="/" className="block px-4 py-2 hover:text-blue-500">Home</Link>
          <Link href="/about" className="block px-4 py-2 hover:text-blue-500">About</Link>
          <Link href="/services" className="block px-4 py-2 hover:text-blue-500">Services</Link>
          <Link href="/contact" className="block px-4 py-2 hover:text-blue-500">Contact</Link>
        </div>
      )}
      </div>
      </div>
      </div>
    </nav>
  );
}
