"use client";

import { useEffect, useState } from "react";

export default function Header() {
  const [active, setActive] = useState<string | null>("hero");

  const navigationItems = [
    { label: "Home", href: "#hero" },
    { label: "About", href: "#about" },
    { label: "Portofolio", href: "#portfolio" },
    { label: "Contact", href: "#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = navigationItems
        .map((item) => {
          const id = item.href.replace("#", "");
          return { id, element: document.getElementById(id) };
        })
        .filter((item) => item.element !== null) as {
        id: string;
        element: HTMLElement;
      }[];

      if (!sections.length) return;

      // Get current scroll position
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Check if at bottom of page
      if (scrollY + windowHeight >= documentHeight - 10) {
        setActive("contact");
        return;
      }

      // Find which section we're currently in
      let currentSection = "hero";

      for (const { id, element } of sections) {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + scrollY;

        // Section is active if we've scrolled past its top
        // and haven't reached halfway through it yet
        if (scrollY >= elementTop - 100) {
          currentSection = id;
        }
      }

      setActive(currentSection);
    };

    // Run on mount
    handleScroll();

    // Listen to scroll events
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const linkBase =
    "text-base font-medium transition-all duration-300 hover:text-white hover:scale-105 relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-indigo-500 after:to-purple-500 after:rounded-full after:transition-all after:duration-300";
  const whenActive = "text-white after:w-full scale-105";
  const whenInactive = "text-neutral-300 after:w-0";

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/30 backdrop-blur-xl supports-[backdrop-filter]:bg-neutral-950/20 shadow-lg shadow-black/5">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-20"></div>
            <span className="relative text-lg font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Mohammad Affan Shofi
            </span>
          </div>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {navigationItems.map((item, index) => {
            const sectionId = item.href.replace("#", "");
            const isActive = active === sectionId;
            return (
              <a
                key={index}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`${linkBase} ${
                  isActive ? whenActive : whenInactive
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
