"use client";

import Section from "./Section";
import TiltedCard from "./TitleCard";
import {
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiLaravel,
  SiPhp,
  SiPython,
  SiFlutter,
  SiDart,
  SiPostgresql,
  SiGit,
  SiDocker,
} from "react-icons/si";

const SKY = "rgb(56 189 248 / 0.55)"; // glow default (sky-400, cocok dgn tema)

const stacks = [
  { icon: <SiHtml5 />, label: "HTML" },
  { icon: <SiCss3 />, label: "CSS" },
  { icon: <SiJavascript />, label: "JavaScript" },
  { icon: <SiTypescript />, label: "TypeScript" },
  { icon: <SiReact />, label: "React" },
  { icon: <SiNextdotjs />, label: "Next.js" },
  { icon: <SiTailwindcss />, label: "Tailwind" },
  { icon: <SiNodedotjs />, label: "Node.js" },
  { icon: <SiExpress />, label: "Express" },
  { icon: <SiLaravel />, label: "Laravel" },
  { icon: <SiPhp />, label: "PHP" },
  { icon: <SiPython />, label: "Python" },
  { icon: <SiFlutter />, label: "Flutter" },
  { icon: <SiDart />, label: "Dart" },
  { icon: <SiPostgresql />, label: "PostgreSQL" },
  { icon: <SiGit />, label: "Git" },
  { icon: <SiDocker />, label: "Docker" },
];

export default function Skills() {
  return (
    <Section id="skills" title="Skills">
      <div className="grid grid-cols-3 gap-10 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
        {stacks.map((s) => (
          <div key={s.label} className="mx-auto">
            <TiltedCard
              icon={s.icon}
              captionText={s.label}
              containerHeight="75px"
              containerWidth="75px"
              imageHeight="75px"
              imageWidth="75px"
              rotateAmplitude={12}
              scaleOnHover={1.12}
              glowColor={SKY}
              showMobileWarning={false}
              showTooltip={true}
            />
          </div>
        ))}
      </div>
    </Section>
  );
}
