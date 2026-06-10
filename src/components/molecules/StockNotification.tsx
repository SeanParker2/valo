"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, Check, BellOff } from "lucide-react";

interface StockNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  dollName: string;
  dollId: string;
  isSubscribed: boolean;
  onSubscribe: (email: string) => void;
  onUnsubscribe: () => void;
}

export function StockNotification({ isOpen, onClose, dollName, dollId, isSubscribed, onSubscribe, onUnsubscribe }: StockNotificationProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    setStatus("sending");
    setTimeout(() => {
      onSubscribe(email);
      setStatus("done");
      setTimeout(() => {
        onClose();
        setStatus("idle");
        setEmail("");
      }, 1500);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Stock notification"
            className="relative bg-paper w-full max-w-md p-8 z-10"
          >
            <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors" aria-label="Close">
              <X className="w-5 h-5" />
            </button>

            <AnimatePresence mode="wait">
              {status === "done" ? (
                <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                    <Bell className="w-8 h-8 text-gold" />
                  </div>
                  <h3 className="section-title text-2xl mb-3">Notification Set</h3>
                  <p className="section-label">We&apos;ll email you when {dollName} is back in stock.</p>
                </motion.div>
              ) : isSubscribed ? (
                <motion.div key="subscribed" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex items-center gap-3 mb-6">
                    <Bell className="w-5 h-5 text-gold" />
                    <h3 className="section-title text-2xl">Already Subscribed</h3>
                  </div>
                  <p className="font-serif text-gray-500 leading-relaxed mb-6">
                    You&apos;re already on the notification list for {dollName}. We&apos;ll email you as soon as it&apos;s available.
                  </p>
                  <button onClick={onUnsubscribe} className="btn-ghost w-full">
                    <BellOff className="w-4 h-4" /> UNSUBSCRIBE
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit}>
                  <div className="flex items-center gap-3 mb-6">
                    <Bell className="w-5 h-5 text-gold" />
                    <h3 className="section-title text-2xl">Get Notified</h3>
                  </div>
                  <p className="font-serif text-gray-500 leading-relaxed mb-6">
                    {dollName} is currently unavailable. Sign up to be notified when it&apos;s back in stock.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="section-label block mb-2">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="input-brand"
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={status === "sending"} className="btn-primary w-full mt-6">
                    <Bell className="w-4 h-4" />
                    {status === "sending" ? "SUBSCRIBING..." : "NOTIFY ME"}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
