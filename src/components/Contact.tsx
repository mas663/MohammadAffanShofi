"use client";

import Section from "./Section";
import { useState } from "react";
import { Send } from "lucide-react";

export default function ContactForm() {
  const [form, setForm] = useState({
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Sending...");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      setStatus("✅ Message sent successfully!");
      setForm({ email: "", subject: "", message: "" });
    } else {
      setStatus(`❌ ${data.error || "Failed to send message"}`);
    }
  };

  return (
    <Section id="contact" title="Contact Me">
      <form
        onSubmit={handleSubmit}
        className="space-y-5 max-w-xl mx-auto bg-neutral-900/60 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/10"
      >
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Your Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="your@example.com"
            className="w-full p-3 rounded-lg bg-neutral-800 text-white border border-transparent focus:border-sky-500 focus:ring-2 focus:ring-sky-500 outline-none transition"
            required
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Subject
          </label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="Enter subject..."
            className="w-full p-3 rounded-lg bg-neutral-800 text-white border border-transparent focus:border-sky-500 focus:ring-2 focus:ring-sky-500 outline-none transition"
            required
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Message
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Write your message here..."
            rows={5}
            className="w-full p-3 rounded-lg bg-neutral-800 text-white border border-transparent focus:border-sky-500 focus:ring-2 focus:ring-sky-500 outline-none transition"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-600 to-indigo-600 rounded-lg text-white font-medium shadow-md hover:from-sky-500 hover:to-indigo-500 transition"
        >
          <Send className="h-4 w-4" />
          Send Message
        </button>

        {/* Status Message */}
        {status && (
          <p className="text-center text-sm mt-3 text-neutral-300">{status}</p>
        )}
      </form>
    </Section>
  );
}
