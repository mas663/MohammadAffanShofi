"use client";

import Section from "./Section";
import { useMemo, useState } from "react";
import {
  Send,
  Copy,
  Check,
  Mail,
  Instagram,
  Linkedin,
  Github,
  ArrowUpRight,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { motion, MotionConfig } from "framer-motion";
import { PROFILE } from "../data/profile";
import type { Variants } from "framer-motion";

const springFast = { type: "spring", stiffness: 280, damping: 20 } as const;
const springMed = { type: "spring", stiffness: 260, damping: 18 } as const;

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string; // honeypot
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "",
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<null | { ok: boolean; text: string }>(
    null,
  );
  const [copied, setCopied] = useState(false);

  const EMAIL = useMemo(() => PROFILE.socials.mail.replace(/^mailto:/, ""), []);

  const onChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const canSubmit =
    form.name.trim() &&
    /\S+@\S+\.\S+/.test(form.email) &&
    form.subject.trim() &&
    form.message.trim() &&
    !sending;

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSending(true);
    setStatus({ ok: true, text: "Sending…" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus({ ok: true, text: "✅ Sent! I’ll get back to you soon." });
        setForm({ name: "", email: "", subject: "", message: "", website: "" });
      } else {
        setStatus({
          ok: false,
          text: `❌ ${data?.error || "Failed to send message"}`,
        });
      }
    } catch {
      setStatus({ ok: false, text: "❌ Network error. Try again." });
    } finally {
      setSending(false);
      setTimeout(() => setStatus(null), 4000);
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore
    }
  };

  const field =
    "w-full rounded-xl bg-neutral-900/70 text-white placeholder-neutral-500 " +
    "border border-white/10 px-4 py-3 outline-none transition " +
    "focus:ring-2 focus:ring-sky-500/70 focus:border-sky-500/50";

  // --- Social Cards data ---
  type Card = {
    label: string;
    href: string;
    Icon: React.ComponentType<{ className?: string }>;
    gradient: string; // tailwind bg gradient
    subtitle?: string;
  };

  const socials: Card[] = [
    {
      label: "Instagram",
      href: PROFILE.socials.instagram,
      Icon: Instagram,
      gradient: "from-pink-500/15 to-purple-500/15",
      subtitle: "→ @mohammadaffans",
    },
    {
      label: "WhatsApp",
      href: PROFILE.socials.whatsapp,
      Icon: FaWhatsapp,
      gradient: "from-emerald-500/15 to-teal-500/15",
      subtitle: "→ +6281336464103",
    },
    {
      label: "GitHub",
      href: PROFILE.socials.github,
      Icon: Github,
      gradient: "from-zinc-500/15 to-slate-600/15",
      subtitle: "→ @mas663",
    },
    {
      label: "LinkedIn",
      href: PROFILE.socials.linkedin,
      Icon: Linkedin,
      gradient: "from-sky-500/15 to-blue-600/15",
      subtitle: "→ Mohammad Affan Shofi",
    },
  ];

  // --- Motion variants (agar konsisten & gampang di-tweak) ---
  const cardV = {
    rest: { y: 0, scale: 1, opacity: 1 },
    hover: {
      y: -2,
      scale: 1.005,
      transition: springFast,
    },
  } as const satisfies Variants;

  const peelV = {
    rest: { scale: 0, rotate: 0, opacity: 0 },
    hover: { scale: 1, rotate: 3, opacity: 1, transition: springMed },
  } as const satisfies Variants;

  const arrowV = {
    rest: { x: 0, y: 0, rotate: 0, opacity: 0.9 },
    hover: { x: 3, y: -3, rotate: 10, opacity: 1, transition: springMed },
  } as const satisfies Variants;

  const iconPulseV = {
    rest: { scale: 1 },
    hover: {
      scale: 1,
      transition: springMed,
    },
  } as const satisfies Variants;

  const textV = {
    rest: { y: 4, opacity: 0.85 },
    hover: { y: 0, opacity: 1, transition: { duration: 0.22 } },
  } as const satisfies Variants;

  const subtitleV = {
    rest: { y: 8, opacity: 0 },
    hover: { y: 0, opacity: 0.9, transition: { duration: 0.26 } },
  } as const satisfies Variants;

  const glowV = {
    rest: { opacity: 0, scale: 0.96 },
    hover: { opacity: 1, scale: 1, transition: { duration: 0.35 } },
  } as const satisfies Variants;

  const SocialCard = ({ label, href, Icon, gradient, subtitle }: Card) => (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${label}`}
      title={label}
      variants={cardV}
      initial="rest"
      whileHover="hover"
      whileFocus="hover"
      animate="rest"
      className="group relative block isolate overflow-hidden rounded-2xl
             border border-white/10 bg-white/[0.02] ring-1 ring-inset ring-white/5
             p-5 will-change-transform transform-gpu"
    >
      {/* glow lembut */}
      <motion.span
        variants={glowV}
        className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${gradient}`}
      />

      {/* corner peel – pakai w/h eksplisit */}
      <motion.span
        variants={peelV}
        className="absolute -right-1.5 -top-1.5 w-10 h-10 md:w-12 md:h-12
               rounded-bl-xl bg-sky-400/15 origin-top-right will-change-transform transform-gpu"
      />

      {/* panah pojok */}
      <motion.span variants={arrowV} className="absolute right-2 top-2">
        <ArrowUpRight className="h-4 w-4" />
      </motion.span>

      {/* konten tinggi tetap */}
      <div className="flex h-40 md:h-44 flex-col justify-between">
        <div className="flex items-center justify-between">
          <motion.span
            variants={iconPulseV}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.06]"
          >
            <Icon className="h-5 w-5" />
          </motion.span>
        </div>

        <div className="pt-2">
          <motion.div
            variants={textV}
            className="text-lg font-semibold tracking-wide text-neutral-100"
          >
            {label}
          </motion.div>
          {subtitle ? (
            <motion.div
              variants={subtitleV}
              className="mt-1 text-xs text-neutral-400"
            >
              {subtitle}
            </motion.div>
          ) : null}
        </div>
      </div>
    </motion.a>
  );

  return (
    <Section id="contact" title="Contact">
      <MotionConfig reducedMotion="user">
        {/* 2 kolom: kiri social grid, kanan form */}
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          {/* Social grid with stagger entrance */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: { opacity: 0, y: 8 },
              show: { opacity: 1, y: 0, transition: { staggerChildren: 0.07 } },
            }}
            className="grid grid-cols-2 gap-4"
          >
            {socials.map((s) => (
              <motion.div
                key={s.label}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
                }}
                className="will-change-transform transform-gpu"
              >
                <SocialCard {...s} />
              </motion.div>
            ))}
          </motion.div>

          {/* Form */}
          <form
            onSubmit={onSubmit}
            className="relative space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8"
          >
            <div className="pointer-events-none absolute -inset-px -z-10 rounded-2xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 blur-2xl" />

            <h3 className="mb-2 text-lg font-semibold text-neutral-200">
              Drop me a message:
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className="sr-only">
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  placeholder="Name"
                  className={field}
                  value={form.name}
                  onChange={onChange}
                  autoComplete="name"
                  required
                  title="Your name"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="sr-only">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  placeholder="Email"
                  className={field}
                  value={form.email}
                  onChange={onChange}
                  autoComplete="email"
                  required
                  title="Your email address"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-subject" className="sr-only">
                Subject
              </label>
              <input
                id="contact-subject"
                name="subject"
                placeholder="Subject"
                className={field}
                value={form.subject}
                onChange={onChange}
                required
                title="Subject"
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="sr-only">
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                placeholder="Your message.."
                className={`${field} min-h-[140px] resize-y`}
                value={form.message}
                onChange={onChange}
                required
                title="Your message"
              />
            </div>

            {/* Honeypot anti-bot (aksesibel & tersembunyi) */}
            <input
              id="contact-website"
              name="website"
              value={form.website}
              onChange={onChange}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              placeholder="Leave this field empty"
              title="Leave this field empty"
            />

            <button
              type="submit"
              disabled={!canSubmit}
              className={`group relative w-full overflow-hidden rounded-xl px-6 py-3 text-sm font-semibold text-white transition
              ${
                canSubmit
                  ? "bg-sky-600 hover:bg-sky-500"
                  : "cursor-not-allowed bg-neutral-700"
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <Send className="h-4 w-4" />
                {sending ? "Sending…" : "Submit"}
              </span>
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition group-hover:translate-x-0" />
            </button>

            {status && (
              <p
                aria-live="polite"
                className={`text-center text-sm ${
                  status.ok ? "text-emerald-300" : "text-rose-300"
                }`}
              >
                {status.text}
              </p>
            )}

            <div className="mt-2 text-center text-sm text-neutral-400">
              or email me at:
            </div>

            <button
              type="button"
              onClick={copyEmail}
              className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition
              ${
                copied
                  ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-300"
                  : "border-white/10 bg-white/[0.05] text-neutral-200 hover:bg-white/[0.08]"
              }`}
              title={EMAIL}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  {EMAIL}
                  <Copy className="h-4 w-4 opacity-80" />
                </>
              )}
            </button>
          </form>
        </div>
      </MotionConfig>
    </Section>
  );
}
