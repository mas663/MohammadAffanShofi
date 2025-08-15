import Image from "next/image";
import { ChevronRight, ExternalLink } from "lucide-react";
import { PROFILE } from "../data/profile";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-30 [background:radial-gradient(60%_50%_at_70%_20%,theme(colors.sky.600)_0%,transparent_70%),radial-gradient(40%_40%_at_20%_80%,theme(colors.indigo.600)_0%,transparent_60%)]" />
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-16 md:grid-cols-[1.2fr_.8fr] md:py-24">
        <div>
          <h1 className="fade-in-up text-4xl font-extrabold tracking-tight md:text-5xl">
            Welcome to <span className="text-sky-400">my portfolio</span>
          </h1>

          <p className="mt-4 max-w-2xl text-neutral-300">
            Hello, world! I&apos;m {PROFILE.name}.{" "}
            <span className="text-neutral-200 font-semibold">
              {PROFILE.tagline}
            </span>
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-900/40 transition hover:translate-y-0.5"
            >
              View Projects{" "}
              <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </a>
            <a
              href={PROFILE.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-5 py-2.5 text-sm font-medium text-white/90 hover:bg-white/5"
            >
              Connect <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-sky-500/30 blur-2xl" />
            <div className="relative h-48 w-48 md:h-60 md:w-60">
              <Image
                src={PROFILE.avatar}
                alt={`${PROFILE.name} avatar`}
                fill
                priority
                sizes="(min-width: 768px) 15rem, 12rem"
                className="rounded-full border-4 border-sky-500/60 object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
