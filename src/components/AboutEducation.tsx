import Section from "./Section";
import { GraduationCap } from "lucide-react";
import { EDUCATION, PROFILE } from "../data/profile";

export default function AboutEducation() {
  return (
    <Section id="about" title="About & Education">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-white">About me</h3>
          <p className="text-neutral-300 leading-relaxed">{PROFILE.about}</p>
        </div>
        <div>
          <h3 className="mb-3 text-lg font-semibold text-white flex items-center gap-2">
            <GraduationCap className="h-5 w-5" /> Education
          </h3>
          <ul className="space-y-3">
            {EDUCATION.map((e) => (
              <li
                key={e.school}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-4"
              >
                <p className="font-medium text-neutral-200">{e.school}</p>
                <p className="text-sm text-neutral-400">{e.program}</p>
                {e.period && (
                  <p className="text-xs text-neutral-500 mt-1">{e.period}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
