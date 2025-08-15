import Image from "next/image";
import { Github, Linkedin, Mail } from "lucide-react";
import { PROFILE } from "../data/profile";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-neutral-950/70 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Image
            src={PROFILE.avatar}
            alt={`${PROFILE.name} avatar`}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-sky-500/50"
            priority
          />
          <span className="text-sm font-semibold text-neutral-200">
            {PROFILE.name.split(" ")[0]}&apos;s Portfolio
          </span>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {[
            ["About", "#about"],
            ["Skills", "#skills"],
            ["Projects", "#projects"],
            ["Experience", "#experience"],
            ["Contact", "#contact"],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href as string}
              className="text-sm text-neutral-300 transition hover:text-white"
            >
              {label}
            </a>
          ))}
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
            href={PROFILE.socials.mail}
            aria-label="Send email"
            title="Email"
            className="rounded-xl p-2 ring-1 ring-white/5 hover:bg-white/5"
          >
            <Mail className="h-5 w-5" />
            <span className="sr-only">Email</span>
          </a>
        </div>
      </div>
    </header>
  );
}
