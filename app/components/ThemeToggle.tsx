"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Load theme from localStorage or system preference
  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initial = prefersDark ? "dark" : "light";
      setTheme(initial);
      document.documentElement.setAttribute("data-theme", initial);
    }
  }, []);

  // Toggle function
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? (
        <Image src="LightMode.svg" alt="Light Mode" width={24} height={24} />
      ) : (
        <Image src="DarkMode.svg" alt="Dark Mode" width={24} height={24} />
      )}
    </button>
  );
}
