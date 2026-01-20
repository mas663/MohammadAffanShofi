"use client";

import { useEffect, useState } from "react";
import Section from "./Section";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

type Project = {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
  tags: string[];
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Section id="projects" title="Projects">
        <div className="text-center text-neutral-400 py-12">
          Loading projects...
        </div>
      </Section>
    );
  }

  if (projects.length === 0) {
    return (
      <Section id="projects" title="Projects">
        <div className="text-center text-neutral-400 py-12">
          No projects yet.
        </div>
      </Section>
    );
  }

  return (
    <Section id="projects" title="Projects">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((p) => {
          const hasLink = p.href && p.href.trim() !== "";
          const Container = hasLink ? "a" : "div";
          const containerProps = hasLink
            ? {
                href: p.href,
                target: "_blank",
                className:
                  "group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.03] transition hover:-translate-y-0.5 hover:bg-white/[0.05] cursor-pointer",
              }
            : {
                className:
                  "group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.03] cursor-default",
              };

          return (
            <Container key={p.id} {...containerProps}>
              <div className="grid grid-cols-[120px_1fr] gap-4 p-5 md:grid-cols-[160px_1fr]">
                <div className="relative w-full aspect-video flex items-center justify-center">
                  <Image
                    src={p.image || "/placeholder.png"}
                    alt={p.title}
                    fill
                    className="object-contain rounded-t-3xl ring-1 ring-white/10 bg-black"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{p.title}</h3>
                  <p className="mt-1 text-sm text-neutral-300">
                    {p.description}
                  </p>
                  {p.tags?.length ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-neutral-300 ring-1 ring-white/10"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {hasLink && (
                    <div className="mt-4 inline-flex items-center gap-1 text-sm text-sky-300">
                      View <ExternalLink className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </div>
            </Container>
          );
        })}
      </div>
    </Section>
  );
}
