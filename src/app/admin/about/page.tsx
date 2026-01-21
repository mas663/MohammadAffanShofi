"use client";

import { useEffect, useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import { User, Sparkles, Save } from "lucide-react";

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

type Toast = {
  message: string;
  type: "success" | "error";
};

export default function AboutAdminPage() {
  const [aboutData, setAboutData] = useState<AboutData>({
    heading: "",
    subtitle: "",
    name: "",
    description: "",
    quote: "",
    photo: "",
    cvUrl: "",
    yearsOfExperience: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    fetchAboutData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await fetch("/api/admin/about", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setAboutData(data);
      }
    } catch {
      showToast("Failed to fetch about data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aboutData),
        credentials: "include",
      });

      if (response.ok) {
        showToast("About data updated successfully!", "success");
      } else {
        throw new Error("Failed to update");
      }
    } catch {
      showToast("Failed to update about data", "error");
    } finally {
      setSaving(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2000);
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
              ? "bg-linear-to-r from-green-500/90 to-emerald-500/90 border-green-400/20 text-white"
              : "bg-linear-to-r from-red-500/90 to-rose-500/90 border-red-400/20 text-white"
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
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
            <User className="w-8 h-8 text-indigo-400" />
            About Section
          </h1>
          <p className="text-neutral-400 mt-2">
            Manage your about section content
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
          {/* Heading */}
          <div className="rounded-xl border border-indigo-500/20 bg-linear-to-br from-indigo-500/5 to-purple-500/5 p-6 backdrop-blur-sm">
            <label className="mb-3 text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Heading (Optional)
            </label>
            <input
              type="text"
              value={aboutData.heading}
              onChange={(e) =>
                setAboutData((prev) => ({ ...prev, heading: e.target.value }))
              }
              placeholder="About Me"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition"
            />
          </div>

          {/* Subtitle */}
          <div className="rounded-xl border border-indigo-500/20 bg-linear-to-br from-indigo-500/5 to-purple-500/5 p-6 backdrop-blur-sm">
            <label className="mb-3 text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Subtitle (Optional)
            </label>
            <input
              type="text"
              value={aboutData.subtitle}
              onChange={(e) =>
                setAboutData((prev) => ({ ...prev, subtitle: e.target.value }))
              }
              placeholder="Transforming ideas into digital experiences"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition"
            />
          </div>

          {/* Name */}
          <div className="rounded-xl border border-indigo-500/20 bg-linear-to-br from-indigo-500/5 to-purple-500/5 p-6 backdrop-blur-sm">
            <label className="mb-3 text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Full Name (Optional)
            </label>
            <input
              type="text"
              value={aboutData.name}
              onChange={(e) =>
                setAboutData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Your Full Name"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition"
            />
          </div>

          {/* Description */}
          <div className="rounded-xl border border-indigo-500/20 bg-linear-to-br from-indigo-500/5 to-purple-500/5 p-6 backdrop-blur-sm">
            <label className="mb-3 text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Description (Optional)
            </label>
            <textarea
              value={aboutData.description}
              onChange={(e) =>
                setAboutData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Tell about yourself, your background, interests, and expertise..."
              rows={6}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition resize-none"
            />
          </div>

          {/* Quote */}
          <div className="rounded-xl border border-indigo-500/20 bg-linear-to-br from-indigo-500/5 to-purple-500/5 p-6 backdrop-blur-sm">
            <label className="mb-3 text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Quote / Tagline (Optional)
            </label>
            <input
              type="text"
              value={aboutData.quote}
              onChange={(e) =>
                setAboutData((prev) => ({ ...prev, quote: e.target.value }))
              }
              placeholder="Your personal quote or tagline"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition"
            />
          </div>

          {/* CV URL */}
          <div className="rounded-xl border border-indigo-500/20 bg-linear-to-br from-indigo-500/5 to-purple-500/5 p-6 backdrop-blur-sm">
            <label className="mb-3 text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              CV / Resume URL (Optional)
            </label>
            <input
              type="text"
              value={aboutData.cvUrl}
              onChange={(e) =>
                setAboutData((prev) => ({ ...prev, cvUrl: e.target.value }))
              }
              placeholder="https://example.com/cv.pdf or /uploads/cv.pdf"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition"
            />
            <p className="mt-2 text-xs text-neutral-400 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400"></span>
              Upload your CV file to /public/uploads and enter the path, or use
              external URL
            </p>
          </div>

          {/* Years of Experience */}
          <div className="rounded-xl border border-indigo-500/20 bg-linear-to-br from-indigo-500/5 to-purple-500/5 p-6 backdrop-blur-sm">
            <label className="mb-3 text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Years of Experience (Optional)
            </label>
            <input
              type="number"
              min="0"
              value={aboutData.yearsOfExperience}
              onChange={(e) =>
                setAboutData((prev) => ({
                  ...prev,
                  yearsOfExperience: parseInt(e.target.value) || 0,
                }))
              }
              placeholder="2"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-neutral-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition"
            />
            <p className="mt-2 text-xs text-neutral-400 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
              This will be displayed in the stats card with &quot;+&quot; symbol
            </p>
          </div>
        </div>

        {/* Right Column - Photo */}
        <div className="space-y-6">
          <div className="rounded-xl border border-indigo-500/20 bg-linear-to-br from-indigo-500/5 to-purple-500/5 p-6 backdrop-blur-sm">
            <ImageUpload
              value={aboutData.photo}
              onChange={(value) =>
                setAboutData((prev) => ({ ...prev, photo: value }))
              }
              label="About Photo"
              placeholder="https://example.com/about-photo.jpg"
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
