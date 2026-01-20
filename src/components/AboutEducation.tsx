"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  Download,
  FolderKanban,
  Award,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";

type AboutData = {
  heading: string;
  subtitle: string;
  name: string;
  description: string;
  quote: string;
  photo: string;
  cvUrl: string;
  yearsOfExperience: number;
};

type Stats = {
  projects: number;
  certifications: number;
};

export default function AboutEducation() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [stats, setStats] = useState<Stats>({ projects: 0, certifications: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, projectsRes, certsRes] = await Promise.all([
        fetch("/api/profile"),
        fetch("/api/projects"),
        fetch("/api/certifications"),
      ]);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        // Map profile data to about data structure
        setAboutData({
          heading: profileData.about_heading || "About Me",
          subtitle:
            profileData.about_subtitle ||
            "Transforming ideas into digital experiences",
          name: profileData.name || "",
          description: profileData.about || "",
          quote: profileData.about_quote || "",
          photo: profileData.about_photo || profileData.photo || "",
          cvUrl: profileData.cv_url || "",
          yearsOfExperience: profileData.years_of_experience || 0,
        });
      }

      if (projectsRes.ok) {
        const projects = await projectsRes.json();
        setStats((prev) => ({ ...prev, projects: projects.length }));
      }

      if (certsRes.ok) {
        const certs = await certsRes.json();
        setStats((prev) => ({ ...prev, certifications: certs.length }));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !aboutData) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-neutral-950">
        <p className="text-neutral-400">Loading...</p>
      </section>
    );
  }

  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center overflow-hidden bg-neutral-950"
    >
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-1/4 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl animate-pulse delay-500" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-20 md:py-32 w-full">
        {/* Heading & Subtitle */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-500">
              {aboutData.heading}
            </span>
          </h2>
          <p className="text-neutral-400 text-lg flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-sky-400" />
            {aboutData.subtitle}
            <Sparkles className="h-5 w-5 text-sky-400" />
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold text-white"
            >
              Hello, I'm{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">
                {aboutData.name}
              </span>
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-neutral-300 text-base md:text-lg leading-relaxed whitespace-pre-line"
            >
              {aboutData.description}
            </motion.p>

            {aboutData.quote && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-6 border-l-4 border-sky-500 pl-4 py-2"
              >
                <p className="text-neutral-400 italic text-sm md:text-base">
                  "{aboutData.quote}"
                </p>
              </motion.div>
            )}

            {/* Download CV Button */}
            {aboutData.cvUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-8"
              >
                <a
                  href={aboutData.cvUrl}
                  download
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-semibold rounded-lg hover:from-sky-600 hover:to-indigo-600 transition-all shadow-lg hover:shadow-sky-500/50"
                >
                  <Download className="h-5 w-5" />
                  View CV
                </a>
              </motion.div>
            )}

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 grid grid-cols-3 gap-4"
            >
              {/* Total Projects */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-sky-500/20 rounded-lg">
                    <FolderKanban className="h-5 w-5 text-sky-400" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">
                  {stats.projects}
                </p>
                <p className="text-xs text-neutral-400 mt-1">Total Projects</p>
              </div>

              {/* Certifications */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-indigo-500/20 rounded-lg">
                    <Award className="h-5 w-5 text-indigo-400" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">
                  {stats.certifications}
                </p>
                <p className="text-xs text-neutral-400 mt-1">Certifications</p>
              </div>

              {/* Years of Experience */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Calendar className="h-5 w-5 text-purple-400" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">
                  {aboutData.yearsOfExperience}+
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  Years Experience
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Photo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Outer rotating gradient ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 opacity-75 blur-md animate-[spin_8s_linear_infinite]" />

              {/* Middle glow */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-sky-400/30 to-indigo-600/30 blur-xl" />

              {/* Photo container */}
              <div className="relative h-72 w-72 md:h-96 md:w-96 rounded-full p-2 bg-gradient-to-br from-sky-500/20 to-indigo-500/20 backdrop-blur-sm">
                <div className="relative h-full w-full rounded-full overflow-hidden border-4 border-white/10 shadow-2xl">
                  <Image
                    src={aboutData.photo}
                    alt={aboutData.name}
                    fill
                    priority
                    unoptimized
                    sizes="(min-width: 768px) 24rem, 18rem"
                    className="object-cover"
                  />
                  {/* Inner gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/20 via-transparent to-transparent" />
                </div>
              </div>

              {/* Floating decorative circles */}
              <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-sky-500/20 blur-2xl animate-pulse" />
              <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-indigo-500/20 blur-2xl animate-[pulse_2s_ease-in-out_infinite_1s]" />
              <div className="absolute top-1/2 -right-8 h-16 w-16 rounded-full bg-purple-500/15 blur-xl animate-[pulse_2s_ease-in-out_infinite_2s]" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
