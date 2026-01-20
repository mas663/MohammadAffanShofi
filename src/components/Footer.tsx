"use client";

import { useMemo } from "react";
import { useProfile } from "@/contexts/ProfileContext";

export default function Footer() {
  const { profile } = useProfile();
  const year = useMemo(() => new Date().getFullYear(), []);
  return (
    <footer className="border-t border-white/5 py-10 text-center text-sm text-neutral-400">
      © {year} {profile?.name || "Portfolio"}.
    </footer>
  );
}
