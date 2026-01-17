"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Github, Linkedin, Instagram } from "lucide-react";
import { PROFILE } from "../data/profile";

type SectionId = "about" | "skills" | "projects" | "experience" | "contact";

const NAV: Array<{ label: string; href: `#${SectionId}`; id: SectionId }> = [
  { label: "About", href: "#about", id: "about" },
  { label: "Skills", href: "#skills", id: "skills" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Experience", href: "#experience", id: "experience" },
  { label: "Contact", href: "#contact", id: "contact" },
];

export default function Header() {
  const [active, setActive] = useState<SectionId | null>(null);

  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(
      Boolean
    ) as HTMLElement[];
    if (!sections.length) return;

    // rootMargin negatif di atas & bawah agar "aktif" bergeser sedikit dari tepi viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id as SectionId;
            setActive((prev) => (prev === id ? prev : id));
          }
        });
      },
      { root: null, rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  const linkBase =
    "text-sm transition hover:text-white relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-sky-400 after:rounded-full after:transition-all";
  const whenActive = "text-white after:w-full";
  const whenInactive = "text-neutral-300 after:w-0";

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-neutral-950/70 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Image
            src={PROFILE.avatar}
            alt={`${PROFILE.username} avatar`}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-sky-500/50"
            priority
          />
          <span className="text-sm font-semibold text-neutral-200">
            {PROFILE.username.split(" ")[0]}&apos;s Portfolio
          </span>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map(({ label, href, id }) => {
            const isActive = active === id;
            return (
              <a
                key={id}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`${linkBase} ${
                  isActive ? whenActive : whenInactive
                }`}
              >
                {label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={PROFILE.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open GitHub profile"
            title="GitHub"
            className="rounded-xl p-2 ring-1 ring-white/5 hover:bg-white/5"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </a>

          <a
            href={PROFILE.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open LinkedIn profile"
            title="LinkedIn"
            className="rounded-xl p-2 ring-1 ring-white/5 hover:bg-white/5"
          >
            <Linkedin className="h-5 w-5" />
            <span className="sr-only">LinkedIn</span>
          </a>

          <a
            href={PROFILE.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Instagram profile"
            title="Instagram"
            className="rounded-xl p-2 ring-1 ring-white/5 hover:bg-white/5"
          >
            <Instagram className="h-5 w-5" />
            <span className="sr-only">Instagram</span>
          </a>
        </div>
      </div>
    </header>
  );
}
