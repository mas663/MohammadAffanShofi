import Section from "./Section";
import { SKILLS } from "../data/profile";

export default function Skills() {
  return (
    <Section id="skills" title="Skills">
      <div className="flex flex-wrap gap-2">
        {SKILLS.map((s) => (
          <span
            key={s}
            className="rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-200"
          >
            {s}
          </span>
        ))}
      </div>
    </Section>
  );
}
