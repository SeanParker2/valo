"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Check } from "lucide-react";

export function NewsletterInline() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    setStatus("sending");
    setTimeout(() => {
      setStatus("done");
      setEmail("");
    }, 1200);
  };

  return (
    <div className="card-content p-8 md:p-12">
      <h3 className="section-title text-2xl md:text-3xl mb-3">Stay in the Light</h3>
      <p className="section-label mb-6">
        Studio updates, new sculpt announcements, and collector stories. No noise.
      </p>

      <AnimatePresence mode="wait">
        {status === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 py-3"
          >
            <Check className="w-4 h-4 text-gold" />
            <span className="font-serif text-lg text-gold">Welcome to the atelier.</span>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            className="flex gap-3"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              aria-label="Email address"
              className="input-brand flex-1"
            />
            <button type="submit" disabled={status === "sending"} className="btn-primary">
              <Send className="w-3 h-3" />
              {status === "sending" ? "SENDING..." : "SUBSCRIBE"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    setStatus("sending");
    setTimeout(() => {
      setStatus("done");
      setEmail("");
    }, 1200);
  };

  if (status === "done") {
    return (
      <section className="bg-[#0a0a0a] text-white py-20 px-8 md:px-16 text-center">
        <Check className="w-6 h-6 text-gold-warm mx-auto mb-4" />
        <p className="font-serif text-2xl text-gold-warm">Welcome to the atelier.</p>
      </section>
    );
  }

  return (
    <section className="bg-[#0a0a0a] text-white py-20 px-8 md:px-16">
      <div className="max-w-2xl mx-auto text-center">
        <h3 className="section-title text-3xl md:text-4xl text-white mb-4">Stay in the Light</h3>
        <p className="section-label text-gray-500 mb-8">
          New sculpts, studio stories, and collector spotlights. Delivered monthly.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            aria-label="Email address"
            className="flex-1 bg-transparent border-b border-gray-600 pb-3 font-serif text-lg outline-none focus:border-gold-warm transition-colors placeholder:text-gray-600 text-white"
          />
          <button type="submit" disabled={status === "sending"} className="btn-ghost text-white border-white/20 hover:bg-white hover:text-black">
            {status === "sending" ? "..." : "SUBSCRIBE"}
          </button>
        </form>
      </div>
    </section>
  );
}
