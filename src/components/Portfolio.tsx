"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ExternalLink, Code, Award, Layers } from "lucide-react";
import { motion } from "framer-motion";

type Project = {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
  tags: string[];
};

type Certification = {
  id: string;
  name: string;
  href: string;
  image: string;
  order_index: number;
};

type Skill = {
  id: string;
  name: string;
  icon_name: string;
  category: string;
};

type Tab = "projects" | "certificates" | "tech-stack";

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState<Tab>("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, certsRes, skillsRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/certifications"),
        fetch("/api/skills"),
      ]);

      if (projectsRes.ok) {
        const data = await projectsRes.json();
        setProjects(data);
      }

      if (certsRes.ok) {
        const data = await certsRes.json();
        console.log("Certifications data:", data);
        setCertifications(data);
      }

      if (skillsRes.ok) {
        const data = await skillsRes.json();
        setSkills(data);
      }
    } catch (error) {
      console.error("Error fetching portfolio data:", error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      id: "projects" as Tab,
      label: "Projects",
      icon: Code,
      count: projects.length,
    },
    {
      id: "certificates" as Tab,
      label: "Certificates",
      icon: Award,
      count: certifications.length,
    },
    {
      id: "tech-stack" as Tab,
      label: "Tech Stack",
      icon: Layers,
      count: skills.length,
    },
  ];

  return (
    <section
      id="portfolio"
      className="relative min-h-screen py-20 bg-neutral-950 overflow-hidden"
    >
      {/* Background Gradient Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="mx-auto max-w-7xl px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4 bg-linear-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Portfolio Showcase
          </h2>
          <p className="text-neutral-400 text-lg">
            Explore my journey through projects, certifications, and technical
            expertise
          </p>
        </motion.div>

        {/* Tabs Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center gap-4 mb-12 flex-wrap"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  isActive
                    ? "bg-linear-to-r from-sky-500 to-indigo-500 text-white shadow-lg shadow-sky-500/50"
                    : "bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            );
          })}
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {loading ? (
            <div className="text-center py-20">
              <p className="text-neutral-400">Loading...</p>
            </div>
          ) : (
            <div className="min-h-100">
              {/* Projects Tab */}
              {activeTab === "projects" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project, index) => {
                    const hasLink = project.href && project.href.trim() !== "";
                    const Component = hasLink ? motion.a : motion.div;
                    const linkProps = hasLink
                      ? {
                          href: project.href,
                          target: "_blank",
                          rel: "noopener noreferrer",
                        }
                      : {};

                    return (
                      <Component
                        key={project.id}
                        {...linkProps}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-sky-500/50 transition-all hover:shadow-xl hover:shadow-sky-500/20 ${
                          hasLink
                            ? "cursor-pointer hover:scale-105"
                            : "cursor-default"
                        }`}
                      >
                        {/* Project Image */}
                        <div className="relative h-48 w-full overflow-hidden bg-neutral-900">
                          <Image
                            src={project.image || "/placeholder.svg"}
                            alt={project.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/50 to-transparent opacity-60" />
                        </div>

                        {/* Project Info */}
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sky-400 transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-neutral-400 text-sm mb-4 line-clamp-2">
                            {project.description}
                          </p>

                          {/* Tags */}
                          {project.tags && project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.tags.slice(0, 3).map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-sky-500/10 text-sky-400 text-xs rounded-md border border-sky-500/20"
                                >
                                  {tag}
                                </span>
                              ))}
                              {project.tags.length > 3 && (
                                <span className="px-2 py-1 bg-white/5 text-neutral-400 text-xs rounded-md">
                                  +{project.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}

                          {/* View Button - Only show if has link */}
                          {hasLink && (
                            <div className="flex items-center gap-1 text-sky-400 text-sm font-semibold">
                              <span>View Project</span>
                              <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          )}
                        </div>
                      </Component>
                    );
                  })}
                </div>
              )}

              {/* Certificates Tab */}
              {activeTab === "certificates" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {certifications.map((cert, index) => {
                    const hasLink = cert.href && cert.href.trim() !== "";
                    const Component = hasLink ? motion.a : motion.div;
                    const linkProps = hasLink
                      ? {
                          href: cert.href,
                          target: "_blank",
                          rel: "noopener noreferrer",
                        }
                      : {};

                    return (
                      <Component
                        key={cert.id}
                        {...linkProps}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all hover:shadow-xl hover:shadow-indigo-500/20 ${
                          hasLink
                            ? "cursor-pointer hover:scale-105"
                            : "cursor-default"
                        }`}
                      >
                        {/* Certificate Image */}
                        <div className="relative h-64 w-full bg-neutral-900">
                          {cert.image ? (
                            <Image
                              src={cert.image}
                              alt={cert.name}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              style={{ objectFit: "contain" }}
                            />
                          ) : (
                            <Image
                              src="/placeholder.svg"
                              alt={cert.name}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              style={{ objectFit: "contain" }}
                            />
                          )}
                        </div>

                        {/* Certificate Info Overlay - Show on Hover */}
                        <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 pointer-events-none">
                          <h3 className="text-lg font-bold text-white mb-1">
                            {cert.name}
                          </h3>
                          {hasLink && (
                            <p className="text-indigo-400 text-sm flex items-center gap-1">
                              <ExternalLink className="h-4 w-4" />
                              View certificate
                            </p>
                          )}
                        </div>
                      </Component>
                    );
                  })}
                </div>
              )}

              {/* Tech Stack Tab */}
              {activeTab === "tech-stack" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {skills.map((skill, index) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, y: 20, rotate: -5 }}
                      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className="group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all hover:scale-110 hover:shadow-xl hover:shadow-purple-500/20"
                    >
                      {/* Icon */}
                      <div className="relative h-16 w-16 mb-4 flex items-center justify-center">
                        <Image
                          src={
                            skill.icon_name &&
                            skill.icon_name.startsWith("http")
                              ? skill.icon_name
                              : `https://skillicons.dev/icons?i=${(skill.icon_name || skill.name).toLowerCase().replace(/\s+/g, "")}`
                          }
                          alt={skill.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-contain group-hover:scale-110 transition-all"
                          unoptimized
                        />
                      </div>

                      {/* Name */}
                      <p className="text-sm font-semibold text-neutral-300 group-hover:text-white transition-colors text-center">
                        {skill.name}
                      </p>

                      {/* Category Badge */}
                      {skill.category && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 bg-purple-500/20 text-purple-400 text-[10px] rounded-md border border-purple-500/30">
                          {skill.category}
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Empty States */}
              {activeTab === "projects" && projects.length === 0 && (
                <div className="text-center py-20">
                  <Code className="h-16 w-16 text-neutral-600 mx-auto mb-4" />
                  <p className="text-neutral-400">No projects yet</p>
                </div>
              )}
              {activeTab === "certificates" && certifications.length === 0 && (
                <div className="text-center py-20">
                  <Award className="h-16 w-16 text-neutral-600 mx-auto mb-4" />
                  <p className="text-neutral-400">No certificates yet</p>
                </div>
              )}
              {activeTab === "tech-stack" && skills.length === 0 && (
                <div className="text-center py-20">
                  <Layers className="h-16 w-16 text-neutral-600 mx-auto mb-4" />
                  <p className="text-neutral-400">No skills yet</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
