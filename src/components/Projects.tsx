import Section from "./Section";
import { PROJECTS } from "../data/profile";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

export default function Projects() {
  return (
    <Section id="projects" title="Projects">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {PROJECTS.map((p) => (
          <a
            key={p.title}
            href={p.href}
            target="_blank"
            className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.03] transition hover:-translate-y-0.5 hover:bg-white/[0.05]"
          >
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
                <p className="mt-1 text-sm text-neutral-300">{p.desc}</p>
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
                <div className="mt-4 inline-flex items-center gap-1 text-sm text-sky-300">
                  View <ExternalLink className="h-4 w-4" />
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </Section>
  );
}
