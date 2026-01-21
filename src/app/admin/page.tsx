"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Award,
  Code,
  Home,
  User,
  TrendingUp,
  Eye,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

export default function AdminPage() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    certifications: 0,
    totalViews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, skillsRes, certsRes] = await Promise.all([
          fetch("/api/admin/projects"),
          fetch("/api/admin/skills"),
          fetch("/api/admin/certifications"),
        ]);

        const projects = await projectsRes.json();
        const skills = await skillsRes.json();
        const certs = await certsRes.json();

        setStats({
          projects: projects.length || 0,
          skills: skills.length || 0,
          certifications: certs.length || 0,
          totalViews: Math.floor(Math.random() * 1000) + 500, // Placeholder
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin" />
          <p className="text-neutral-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      title: "Total Projects",
      value: stats.projects,
      icon: FolderKanban,
      color: "from-sky-500 to-blue-500",
      bgColor: "bg-sky-500/10",
      borderColor: "border-sky-500/20",
      trend: "+12%",
    },
    {
      title: "Skills",
      value: stats.skills,
      icon: Code,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      trend: "+5%",
    },
    {
      title: "Certifications",
      value: stats.certifications,
      icon: Award,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      trend: "+8%",
    },
    {
      title: "Total Views",
      value: stats.totalViews,
      icon: Eye,
      color: "from-emerald-500 to-green-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      trend: "+24%",
    },
  ];

  const quickLinks = [
    {
      title: "Hero Section",
      description: "Update main banner & introduction",
      icon: Home,
      href: "/admin/hero",
      color: "from-indigo-500 to-purple-500",
    },
    {
      title: "About Section",
      description: "Edit profile & background info",
      icon: User,
      href: "/admin/about",
      color: "from-pink-500 to-rose-500",
    },
    {
      title: "Projects",
      description: "Manage your portfolio projects",
      icon: FolderKanban,
      href: "/admin/projects",
      color: "from-sky-500 to-cyan-500",
    },
    {
      title: "Tech Stack",
      description: "Update skills & technologies",
      icon: Code,
      href: "/admin/skills",
      color: "from-violet-500 to-purple-500",
    },
    {
      title: "Certifications",
      description: "Add certificates & achievements",
      icon: Award,
      href: "/admin/certifications",
      color: "from-amber-500 to-yellow-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-sky-400" />
            Dashboard Overview
          </h1>
          <p className="text-neutral-400 mt-2">
            Manage your portfolio content from one place
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm text-emerald-400 font-medium">
            All Systems Operational
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className={`group relative p-6 rounded-2xl border ${stat.borderColor} ${stat.bgColor} backdrop-blur-sm overflow-hidden transition-all hover:scale-105 hover:shadow-xl hover:shadow-sky-500/10`}
            >
              {/* Gradient Background Effect */}
              <div
                className={`absolute inset-0 bg-linear-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`}
              />

              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm text-neutral-400 mb-1">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {stat.value}
                  </h3>
                  <div className="flex items-center gap-1 text-emerald-400 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-medium">{stat.trend}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-linear-to-br ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-linear-to-b from-sky-400 to-indigo-400 rounded-full" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group relative p-6 rounded-xl bg-white/2 border border-white/10 hover:border-white/20 backdrop-blur-sm overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg"
              >
                {/* Gradient Accent */}
                <div
                  className={`absolute top-0 left-0 w-full h-1 bg-linear-to-r ${link.color} opacity-50 group-hover:opacity-100 transition-opacity`}
                />

                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-xl bg-linear-to-br ${link.color} shadow-lg`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1 flex items-center gap-2">
                      {link.title}
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-sm text-neutral-400">
                      {link.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Preview */}
      <div className="p-6 rounded-2xl bg-white/2 border border-white/10 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-linear-to-b from-purple-400 to-pink-400 rounded-full" />
          Getting Started
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/5">
            <CheckCircle2 className="w-5 h-5 text-sky-400" />
            <p className="text-sm text-neutral-300">
              Update your{" "}
              <Link
                href="/admin/hero"
                className="text-sky-400 hover:underline font-medium"
              >
                Hero section
              </Link>{" "}
              to make a great first impression
            </p>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/5">
            <CheckCircle2 className="w-5 h-5 text-purple-400" />
            <p className="text-sm text-neutral-300">
              Add your latest{" "}
              <Link
                href="/admin/projects"
                className="text-purple-400 hover:underline font-medium"
              >
                projects
              </Link>{" "}
              to showcase your work
            </p>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/5">
            <CheckCircle2 className="w-5 h-5 text-amber-400" />
            <p className="text-sm text-neutral-300">
              Upload{" "}
              <Link
                href="/admin/certifications"
                className="text-amber-400 hover:underline font-medium"
              >
                certificates
              </Link>{" "}
              to highlight your achievements
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
