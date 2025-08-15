import { Rocket } from "lucide-react";
import { PropsWithChildren } from "react";

export default function Section({
  id,
  title,
  children,
}: PropsWithChildren<{ id?: string; title: string }>) {
  return (
    <section id={id} className="relative mx-auto max-w-6xl px-4 py-16 md:py-20">
      <h2 className="mb-8 inline-flex items-center gap-2 rounded-2xl bg-sky-500/10 px-5 py-2 text-xl font-extrabold tracking-wide text-sky-300 ring-1 ring-sky-500/30">
        <Rocket className="h-5 w-5" /> {title}
      </h2>
      {children}
    </section>
  );
}
