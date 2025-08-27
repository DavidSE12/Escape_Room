// components/ThemeToggle.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    const initial =
      saved ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  return (
    <button onClick={toggleTheme} className="p-2 rounded" aria-label="Toggle Theme">
      {theme === "dark" ? (
        <Image src="/LightMode.svg" alt="Light Mode" width={24} height={24} />
      ) : (
        <Image src="/DarkMode.svg" alt="Dark Mode" width={24} height={24} />
      )}
    </button>
  );
}
