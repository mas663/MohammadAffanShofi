import Section from "./Section";
import { Github, Instagram, Linkedin, Mail } from "lucide-react";
import { PROFILE } from "../data/profile";

export default function Contact() {
  return (
    <Section id="contact" title="Contact me">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <a
          href={PROFILE.socials.mail}
          className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-5 hover:bg-white/10"
        >
          <Mail className="h-5 w-5" /> <span>affan.shofi62@gmail.com</span>
        </a>
        <a
          href={PROFILE.socials.linkedin}
          target="_blank"
          className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-5 hover:bg-white/10"
        >
          <Linkedin className="h-5 w-5" /> <span>LinkedIn</span>
        </a>
        <a
          href={PROFILE.socials.instagram}
          target="_blank"
          className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-5 hover:bg-white/10"
        >
          <Instagram className="h-5 w-5" /> <span>@maffanshofi</span>
        </a>
        <a
          href={PROFILE.socials.github}
          target="_blank"
          className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-5 hover:bg-white/10"
        >
          <Github className="h-5 w-5" /> <span>github.com/mas663</span>
        </a>
      </div>
    </Section>
  );
}
