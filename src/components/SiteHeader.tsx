"use client";

import { useState, useEffect } from "react";
import ChantPlayer from "./ChantPlayer";

interface SiteHeaderProps {
  onToggleTOC: () => void;
}

export default function SiteHeader({ onToggleTOC }: SiteHeaderProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  // Load saved theme on mount
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else if (systemPrefersDark) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Toggle theme handler
  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <header className="site-header sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Mobile TOC Toggle */}
          <button
            onClick={onToggleTOC}
            className="lg:hidden p-2 -ml-2 text-white/80 hover:text-gold-light transition-colors cursor-pointer"
            aria-label="Mở mục lục"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="15" y2="12" />
              <line x1="3" y1="18" x2="18" y2="18" />
            </svg>
          </button>

          {/* Title */}
          <div className="flex-1 text-left">
            <h1 className="font-serif text-[13px] sm:text-base font-bold text-white tracking-wide truncate">
              <span className="text-gold-light">✦</span>{" "}
              Khảo sát nghiên cứu chuyên sâu
            </h1>
          </div>

          {/* Toolbar (ChantPlayer & Dark Mode Toggle) */}
          <div className="flex items-center gap-3">
            {/* Chant Player */}
            <ChantPlayer />

            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/10 dark:bg-black/20 text-white hover:text-gold hover:bg-white/20 dark:hover:bg-black/30 transition-all border border-white/20 cursor-pointer flex items-center justify-center w-[33px] h-[33px]"
              title={theme === "light" ? "Chuyển sang giao diện tối" : "Chuyển sang giao diện sáng"}
              aria-label="Toggle theme mode"
            >
              {mounted ? (
                theme === "light" ? (
                  // Moon Icon (Switch to Dark)
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                ) : (
                  // Sun Icon (Switch to Light)
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                )
              ) : (
                <div style={{ width: 15, height: 15 }}></div>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
