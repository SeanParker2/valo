"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Check, ImagePlus } from "lucide-react";

interface SubmitPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubmitPhotoModal({ isOpen, onClose }: SubmitPhotoModalProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [form, setForm] = useState({ name: "", email: "", caption: "", dollName: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => {
      setStatus("done");
      setTimeout(() => {
        onClose();
        setStatus("idle");
        setForm({ name: "", email: "", caption: "", dollName: "" });
      }, 2500);
    }, 1500);
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
            aria-label="Submit photo"
            className="relative bg-paper w-full max-w-lg p-8 md:p-12 z-10 max-h-[90vh] overflow-y-auto"
          >
            <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors" aria-label="Close">
              <X className="w-5 h-5" />
            </button>

            <AnimatePresence mode="wait">
              {status === "done" ? (
                <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8 text-gold" />
                  </div>
                  <h3 className="section-title text-3xl mb-3">Submission Received</h3>
                  <p className="section-label">We&apos;ll review your photo and feature it soon.</p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit}>
                  <h3 className="section-title text-3xl mb-2">Submit Your Photo</h3>
                  <p className="section-label mb-8">Share your VALO doll with the community.</p>

                  <div className="space-y-6">
                    <div className="border-2 border-dashed border-divider p-8 text-center hover:border-gold transition-colors cursor-pointer">
                      <ImagePlus className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                      <span className="section-label">Click to upload or drag image here</span>
                      <p className="font-mono text-[10px] text-gray-400 mt-2">JPG, PNG up to 10MB</p>
                    </div>

                    <div>
                      <label className="section-label block mb-2">Your Name</label>
                      <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-brand" />
                    </div>
                    <div>
                      <label className="section-label block mb-2">Email</label>
                      <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-brand" />
                    </div>
                    <div>
                      <label className="section-label block mb-2">Doll Name (optional)</label>
                      <input type="text" value={form.dollName} onChange={(e) => setForm({ ...form, dollName: e.target.value })} placeholder="e.g. Noa, Eos..." className="input-brand" />
                    </div>
                    <div>
                      <label className="section-label block mb-2">Caption (optional)</label>
                      <textarea rows={2} value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} placeholder="Tell us about this moment..." className="input-brand resize-none" />
                    </div>
                  </div>

                  <button type="submit" disabled={status === "sending"} className="btn-gold w-full mt-8">
                    <Upload className="w-4 h-4" />
                    {status === "sending" ? "SUBMITTING..." : "SUBMIT PHOTO"}
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
