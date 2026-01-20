"use client";

import { useEffect, useState } from "react";
import { Plus, X, Home, Sparkles, Save } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

type HeroData = {
  greeting: string;
  role: string;
  bio: string;
  photo: string;
  job_titles: string[];
  tech_stack: string[];
};

type Toast = {
  message: string;
  type: "success" | "error";
};

export default function HeroAdminPage() {
  const [heroData, setHeroData] = useState<HeroData>({
    greeting: "",
    role: "",
    bio: "",
    photo: "",
    job_titles: [],
    tech_stack: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  // Temporary inputs
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newTechStack, setNewTechStack] = useState("");

  useEffect(() => {
    fetchHeroData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchHeroData = async () => {
    try {
      const response = await fetch("/api/admin/hero");
      if (response.ok) {
        const data = await response.json();
        setHeroData({
          greeting: data.greeting || "",
          role: data.role || "",
          bio: data.bio || "",
          photo: data.photo || "",
          job_titles: data.job_titles || [],
          tech_stack: data.tech_stack || [],
        });
      }
    } catch {
      showToast("Failed to fetch hero data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(heroData),
      });

      if (response.ok) {
        showToast("Hero data updated successfully!", "success");
      } else {
        throw new Error("Failed to update");
      }
    } catch {
      showToast("Failed to update hero data", "error");
    } finally {
      setSaving(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2000);
  };

  const addJobTitle = () => {
    if (newJobTitle.trim()) {
      setHeroData((prev) => ({
        ...prev,
        job_titles: [...prev.job_titles, newJobTitle.trim()],
      }));
      setNewJobTitle("");
    }
  };

  const removeJobTitle = (index: number) => {
    setHeroData((prev) => ({
      ...prev,
      job_titles: prev.job_titles.filter((_, i) => i !== index),
    }));
  };

  const addTechStack = () => {
    if (newTechStack.trim()) {
      setHeroData((prev) => ({
        ...prev,
        tech_stack: [...prev.tech_stack, newTechStack.trim()],
      }));
      setNewTechStack("");
    }
  };

  const removeTechStack = (index: number) => {
    setHeroData((prev) => ({
      ...prev,
      tech_stack: prev.tech_stack.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-neutral-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-xl px-6 py-4 shadow-2xl backdrop-blur-sm border animate-in slide-in-from-top-5 fade-in duration-300 ${
            toast.type === "success"
              ? "bg-gradient-to-r from-green-500/90 to-emerald-500/90 border-green-400/20 text-white"
              : "bg-gradient-to-r from-red-500/90 to-rose-500/90 border-red-400/20 text-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-2 h-2 rounded-full animate-pulse ${
                toast.type === "success" ? "bg-white" : "bg-white"
              }`}
            />
            <p className="font-medium">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
            <Home className="w-8 h-8 text-indigo-400" />
            Hero Section
          </h1>
          <p className="text-neutral-400 mt-2">
            Manage your hero section content
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Text Content */}
        <div className="space-y-6">
          {/* Greeting */}
          <div className="rounded-xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 p-6 backdrop-blur-sm">
            <label className="mb-3 text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Greeting (Optional)
            </label>
            <input
              type="text"
              value={heroData.greeting}
              onChange={(e) =>
                setHeroData((prev) => ({ ...prev, greeting: e.target.value }))
              }
              placeholder="Hello, world!"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition"
            />
          </div>

          {/* Role */}
          <div className="rounded-xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 p-6 backdrop-blur-sm">
            <label className="mb-3 text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Role / Title (Optional)
            </label>
            <input
              type="text"
              value={heroData.role}
              onChange={(e) =>
                setHeroData((prev) => ({ ...prev, role: e.target.value }))
              }
              placeholder="Full Stack Developer"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition"
            />
            <p className="mt-2 text-xs text-neutral-400 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              First word stays white, rest gets gradient effect
            </p>
          </div>

          {/* Bio */}
          <div className="rounded-xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 p-6 backdrop-blur-sm">
            <label className="mb-3 text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              Bio (Optional)
            </label>
            <textarea
              value={heroData.bio}
              onChange={(e) =>
                setHeroData((prev) => ({ ...prev, bio: e.target.value }))
              }
              placeholder="Tell something about yourself..."
              rows={4}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 focus:outline-none transition resize-none"
            />
          </div>

          {/* Job Titles (Typing Effect) */}
          <div className="rounded-xl border border-sky-500/20 bg-gradient-to-br from-sky-500/5 to-cyan-500/5 p-6 backdrop-blur-sm">
            <label className="mb-3 text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              Job Titles (Typing Effect)
            </label>
            <p className="mb-4 text-xs text-neutral-400 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-400"></span>
              These will rotate with typing animation
            </p>

            <div className="mb-4 flex gap-2">
              <input
                type="text"
                value={newJobTitle}
                onChange={(e) => setNewJobTitle(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addJobTitle()}
                placeholder="e.g., Web Developer"
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:outline-none transition"
              />
              <button
                onClick={addJobTitle}
                aria-label="Add job title"
                className="rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 px-6 py-3 text-white hover:from-sky-600 hover:to-cyan-600 font-semibold shadow-lg transition-all flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2">
              {heroData.job_titles.map((title, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-between rounded-lg border border-sky-500/20 bg-gradient-to-r from-sky-500/10 to-cyan-500/10 px-4 py-3 hover:border-sky-500/40 transition"
                >
                  <span className="text-white font-medium">{title}</span>
                  <button
                    onClick={() => removeJobTitle(index)}
                    aria-label="Remove job title"
                    className="text-neutral-400 hover:text-red-400 transition opacity-0 group-hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Pills */}
          <div className="rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-purple-500/5 p-6 backdrop-blur-sm">
            <label className="mb-3 text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              Tech Stack Pills
            </label>
            <p className="mb-4 text-xs text-neutral-400 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-violet-400"></span>
              Technologies displayed as pills below the title
            </p>

            <div className="mb-4 flex gap-2">
              <input
                type="text"
                value={newTechStack}
                onChange={(e) => setNewTechStack(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTechStack()}
                placeholder="e.g., React"
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition"
              />
              <button
                onClick={addTechStack}
                aria-label="Add tech stack"
                className="rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 px-6 py-3 text-white hover:from-violet-600 hover:to-purple-600 font-semibold shadow-lg transition-all flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {heroData.tech_stack.map((tech, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-2 rounded-full border border-violet-500/30 bg-gradient-to-r from-violet-500/10 to-purple-500/10 px-4 py-2 hover:border-violet-500/50 hover:from-violet-500/20 hover:to-purple-500/20 transition"
                >
                  <span className="text-sm text-white font-medium">{tech}</span>
                  <button
                    onClick={() => removeTechStack(index)}
                    aria-label="Remove tech stack"
                    className="text-neutral-400 hover:text-red-400 transition opacity-0 group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Photo */}
        <div className="space-y-6">
          <div className="rounded-xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 p-6 backdrop-blur-sm">
            <ImageUpload
              value={heroData.photo}
              onChange={(value) =>
                setHeroData((prev) => ({ ...prev, photo: value }))
              }
              label="Hero Photo"
              placeholder="https://example.com/hero-photo.jpg"
            />
            <p className="mt-3 text-xs text-indigo-300/70">
              💡 Tip: Use a professional portrait photo or upload a PNG/JPG
              image
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
