"use client";

import { useEffect, useState } from "react";
import Section from "./Section";
import { Award } from "lucide-react";

type Certification = {
  id: string;
  name: string;
  href: string;
};

export default function ExperienceCertifications() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      const response = await fetch("/api/certifications");
      if (response.ok) {
        const data = await response.json();
        setCertifications(data);
      }
    } catch (error) {
      console.error("Error fetching certifications:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section id="experience" title="Experience & Involvement">
      <div className="grid grid-cols-1 gap-6 items-stretch md:grid-cols-2">
        {/* KARTU KIRI */}
        <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="flex items-center gap-2 text-white">
            <Award className="h-5 w-5" /> Organizational Involvement
          </h3>

          <ul className="mt-4 space-y-4">
            <li className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="font-semibold leading-tight">
                Information System Expo! 2024 – Staff (Apr 2024 – Dec 2024).
              </p>
              <p className="mt-1 text-sm leading-relaxed text-neutral-300">
                Built & maintained the official site with Next.js; collaborated
                weekly; on-time delivery and optimized performance.
              </p>
            </li>

            <li className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="font-semibold leading-tight">
                Wiratek Internship Program – Frontend Developer (Jul 2025 – Jul
                2025).
              </p>
              <p className="mt-1 text-sm leading-relaxed text-neutral-300">
                Built 25+ full pages, integrated APIs (real-time, JWT, OAuth),
                agent interaction; collaborated with backend & AI teams.
              </p>
            </li>
          </ul>
        </div>

        {/* KARTU KANAN */}
        <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="flex items-center gap-2 text-white">
            <Award className="h-5 w-5" /> Certifications
          </h3>

          {loading ? (
            <div className="text-center text-neutral-400 py-12">
              Loading certifications...
            </div>
          ) : certifications.length === 0 ? (
            <div className="text-center text-neutral-400 py-12">
              No certifications yet.
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {certifications.map((c) => {
                const hasLink = c.href && c.href.trim() !== "";
                return (
                  <li
                    key={c.id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
                  >
                    <span className="text-sm leading-snug text-neutral-200">
                      {c.name}
                    </span>

                    {hasLink ? (
                      <a
                        href={c.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 inline-flex items-center justify-center rounded-md border border-sky-500/40 bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-300 hover:bg-sky-500/15 cursor-pointer"
                      >
                        Lihat Sertifikat
                      </a>
                    ) : (
                      <span className="shrink-0 inline-flex items-center justify-center rounded-md border border-neutral-500/20 bg-neutral-500/5 px-3 py-1.5 text-xs font-medium text-neutral-500 cursor-not-allowed">
                        No Link
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </Section>
  );
}
