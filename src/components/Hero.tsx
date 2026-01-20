"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ExternalLink, Github, Linkedin, Mail } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

type Profile = {
  name: string;
  username: string;
  tagline: string;
  role: string;
  bio: string;
  avatar: string;
  photo?: string;
  greeting?: string;
  job_titles?: string[];
  tech_stack?: string[];
};

export default function Hero() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    fetchProfile();
  }, []);

  // Typing effect
  useEffect(() => {
    const jobTitles = profile?.job_titles || [
      "Web Developer",
      "DevOps Engineer",
      "Full Stack Developer",
    ];
    const currentTitle = jobTitles[currentJobIndex];

    if (!isDeleting && displayedText === currentTitle) {
      // Pause before deleting
      const timeout = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayedText === "") {
      // Move to next title
      setIsDeleting(false);
      setCurrentJobIndex((prev) => (prev + 1) % jobTitles.length);
      return;
    }

    const timeout = setTimeout(
      () => {
        setDisplayedText((prev) =>
          isDeleting
            ? currentTitle.substring(0, prev.length - 1)
            : currentTitle.substring(0, prev.length + 1),
        );
      },
      isDeleting ? 50 : 100,
    );

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentJobIndex, profile]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !profile) {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-950 via-sky-950/20 to-neutral-950">
        <p className="text-neutral-400">Loading...</p>
      </section>
    );
  }

  // Split role into parts for styling
  const roleParts = profile.role?.split(" ") || ["Full", "Stack", "Developer"];
  const firstWord = roleParts[0] || "Full";
  const restWords = roleParts.slice(1).join(" ") || "Stack Developer";

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-neutral-950 via-sky-950/20 to-neutral-950"
    >
      {/* Animated background with parallax */}
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ y }}
      >
        <motion.div
          className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </motion.div>

      <motion.div
        className="mx-auto max-w-7xl px-4 py-20 md:py-32"
        style={{ opacity }}
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Greeting */}
            {profile.greeting && (
              <p className="text-sky-400 font-medium text-lg animate-fade-in">
                {profile.greeting}
              </p>
            )}

            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-5xl md:text-7xl font-black tracking-tight">
                {firstWord}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">
                  {restWords}
                </span>
              </h1>
              <div className="h-8 md:h-10">
                <p className="text-xl md:text-2xl text-neutral-400 font-light">
                  {displayedText}
                  <span className="animate-blink">|</span>
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-neutral-400 text-base md:text-lg leading-relaxed max-w-xl">
              {profile.bio || profile.tagline}
            </p>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-3">
              {(
                profile.tech_stack || [
                  "React",
                  "JavaScript",
                  "Node.js",
                  "Tailwind",
                ]
              ).map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-neutral-300 hover:border-sky-500/50 transition"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-600 hover:shadow-sky-500/50"
              >
                Projects
                <ExternalLink className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/5 transition"
              >
                Contact
              </a>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 pt-4">
              <a
                href="https://github.com/mas663"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit my GitHub profile"
                className="group p-3 rounded-lg bg-white/5 border border-white/10 hover:border-sky-500/50 transition"
              >
                <Github className="h-5 w-5 text-neutral-400 group-hover:text-sky-400 transition" />
              </a>
              <a
                href="https://www.linkedin.com/in/mohammad-affan-shofi-4108ba249"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit my LinkedIn profile"
                className="group p-3 rounded-lg bg-white/5 border border-white/10 hover:border-sky-500/50 transition"
              >
                <Linkedin className="h-5 w-5 text-neutral-400 group-hover:text-sky-400 transition" />
              </a>
              <a
                href="mailto:affan.shofi62@gmail.com"
                aria-label="Send me an email"
                className="group p-3 rounded-lg bg-white/5 border border-white/10 hover:border-sky-500/50 transition"
              >
                <Mail className="h-5 w-5 text-neutral-400 group-hover:text-sky-400 transition" />
              </a>
            </div>
          </div>

          {/* Right - Photo with modern card */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-3xl blur-2xl opacity-20 animate-pulse" />

              {/* Card */}
              <div className="relative rounded-3xl bg-gradient-to-br from-white/10 to-white/5 p-1 backdrop-blur-sm">
                <div className="rounded-3xl bg-neutral-900/90 p-8">
                  <div className="relative h-64 w-64 md:h-80 md:w-80">
                    <Image
                      src={
                        profile.photo ||
                        "https://api.dicebear.com/9.x/adventurer/svg?seed=" +
                          profile.username
                      }
                      alt={`${profile.name} profile`}
                      fill
                      priority
                      unoptimized
                      sizes="(min-width: 768px) 20rem, 16rem"
                      className="rounded-2xl object-cover shadow-2xl"
                    />
                    {/* Decorative elements */}
                    <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-sky-500/20 blur-xl" />
                    <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-indigo-500/20 blur-xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
