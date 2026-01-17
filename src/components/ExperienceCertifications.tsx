import Section from "./Section";
import { CERTS } from "../data/profile";
import { Award } from "lucide-react";

export default function ExperienceCertifications() {
  return (
    <Section id="experience" title="Experience & Involvement">
      {/* items-stretch -> kedua kolom sama tinggi */}
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

          <ul className="mt-4 space-y-3">
            {CERTS.map((c) => (
              <li
                key={c.name}
                className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
              >
                <span className="text-sm leading-snug text-neutral-200">
                  {c.name}
                </span>

                <a
                  href={c.href}
                  target="_blank"
                  className="shrink-0 inline-flex items-center justify-center rounded-md border border-sky-500/40 bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-300 hover:bg-sky-500/15"
                >
                  Lihat Sertifikat
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
