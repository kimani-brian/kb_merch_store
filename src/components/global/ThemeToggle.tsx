"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("light", theme === "light");
  localStorage.setItem("kb-theme", theme);
}

export default function ThemeToggle() {
  // Start neutral; resolve on mount to avoid hydration mismatch.
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const isLight = document.documentElement.classList.contains("light");
    setTheme(isLight ? "light" : "dark");
  }, []);

  function toggle() {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    applyTheme(next);
  }

  return (
    <button
      type="button"
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      onClick={toggle}
      className="flex h-10 w-10 items-center justify-center border-2 border-transparent text-neutral-400 transition-colors hover:border-brand-gray-dark hover:text-brand-white"
    >
      {/* Render both icons; CSS decides which is visible once mounted */}
      <Sun
        className={`h-5 w-5 transition-transform duration-300 ${theme === "light" ? "rotate-0 scale-100" : "hidden"}`}
      />
      <Moon
        className={`h-5 w-5 transition-transform duration-300 ${theme === "dark" || theme === null ? "scale-100" : "hidden"}`}
      />
    </button>
  );
}
