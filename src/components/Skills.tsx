"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Section from "./Section";
import TiltedCard from "./TitleCard";

const SKY = "rgb(56 189 248 / 0.55)";

type Skill = {
  id: string;
  name: string;
  icon_name: string;
};

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch("/api/skills");
      if (response.ok) {
        const data = await response.json();
        setSkills(data);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Section id="skills" title="Skills">
        <div className="text-center text-neutral-400 py-12">
          Loading skills...
        </div>
      </Section>
    );
  }

  if (skills.length === 0) {
    return (
      <Section id="skills" title="Skills">
        <div className="text-center text-neutral-400 py-12">No skills yet.</div>
      </Section>
    );
  }

  return (
    <Section id="skills" title="Skills">
      <div className="grid grid-cols-3 gap-10 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
        {skills.map((s) => (
          <div key={s.id} className="mx-auto">
            <TiltedCard
              icon={
                <Image
                  src={s.icon_name}
                  alt={s.name}
                  width={48}
                  height={48}
                  className="object-contain"
                  unoptimized
                />
              }
              captionText={s.name}
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
