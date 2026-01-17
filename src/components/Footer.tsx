import { useMemo } from "react";
import { PROFILE } from "../data/profile";

export default function Footer() {
  const year = useMemo(() => new Date().getFullYear(), []);
  return (
    <footer className="border-t border-white/5 py-10 text-center text-sm text-neutral-400">
      © {year} {PROFILE.name}.
    </footer>
  );
}
