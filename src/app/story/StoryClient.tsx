"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import { Sidebar } from "@/components/organisms/Sidebar";
import { TopBar } from "@/components/organisms/TopBar";

function ScrollReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-15%", once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ParallaxBand() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  return (
    <section ref={ref} className="relative h-[50vh] md:h-[60vh] overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 -top-20 -bottom-20">
        <Image src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&h=1080&fit=crop" alt="VALO studio" fill className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-paper/30 via-transparent to-paper/30" />
    </section>
  );
}

export default function StoryClient() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  return (
    <div className="flex min-h-screen bg-paper text-black">
      <TopBar />
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <main className="pt-14 lg:pl-32 w-full">
        {/* Hero */}
        <section ref={heroRef} className="relative h-[70vh] overflow-hidden">
          <motion.div style={{ opacity: heroOpacity, y: heroY }} className="absolute inset-0">
            <Image src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1920&h=1080&fit=crop" alt="VALO Atelier" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-paper" />
          </motion.div>
          <div className="absolute bottom-16 left-8 md:left-16 z-10">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="section-label block mb-4"
            >
              OUR STORY
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="section-title text-6xl md:text-8xl lg:text-9xl max-w-2xl"
            >
              Where Light Meets <span className="italic text-gold">Resin</span>
            </motion.h1>
          </div>
        </section>

        {/* Origin */}
        <section className="px-8 md:px-16 lg:px-32 py-32">
          <div className="max-w-3xl">
            <ScrollReveal>
              <span className="section-label block mb-6">ORIGIN</span>
              <p className="font-serif text-3xl md:text-4xl leading-relaxed text-gray-500">
                VALO was born in a small studio in Tokyo in 2024, from a single obsession:{" "}
                <span className="text-black">what if resin could capture not just form, but feeling?</span>
              </p>
              <p className="font-serif text-xl text-gray-400 leading-relaxed mt-8">
                Our founder, Akira Tanaka, had spent fifteen years sculpting for other brands. He knew the material — its possibilities and its limits. He knew what collectors wanted but couldn&apos;t articulate: a doll that didn&apos;t just look beautiful, but felt alive. A doll that caught the morning light and held it. A doll that could pose with the fluidity of a dancer, then stand in repose like a sculpture in a museum.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Parallax Image Band */}
        <ParallaxBand />

        {/* Large Quote */}
        <section className="px-8 md:px-16 lg:px-32 py-32 md:py-48">
          <ScrollReveal className="max-w-4xl mx-auto text-center">
            <div className="w-12 h-px bg-gold mx-auto mb-12" />
            <p className="font-serif text-3xl md:text-5xl lg:text-6xl leading-[1.1] text-gray-400 italic">
              &ldquo;We don&apos;t just cast resin. We cast <span className="text-black not-italic">light itself</span> into solid form.&rdquo;
            </p>
            <div className="w-12 h-px bg-gold mx-auto mt-12" />
          </ScrollReveal>
        </section>

        {/* Split: Philosophy */}
        <section className="px-8 md:px-16 lg:px-32 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <ScrollReveal>
              <div className="card-image aspect-[3/4]">
                <Image src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=1000&fit=crop" alt="Studio" fill className="object-cover" />
              </div>
            </ScrollReveal>
            <ScrollReveal>
              <span className="section-label block mb-6">PHILOSOPHY</span>
              <h2 className="section-title text-4xl md:text-5xl mb-8">
                We don&apos;t manufacture dolls. <br />
                <span className="italic text-gold">We orchestrate vessels.</span>
              </h2>
              <div className="space-y-6 text-gray-500 font-serif text-lg leading-relaxed">
                <p>
                  Every joint is an engineering marvel. Every contour, a poem. We work at the intersection of sculpture,
                  materials science, and light physics — because a doll that merely looks beautiful is not enough.
                </p>
                <p>
                  A VALO doll must feel alive. It must catch the morning light and hold it. It must pose with the fluidity
                  of a dancer, then stand in repose like a sculpture in a museum. It must age gracefully, developing a patina that tells the story of its owner.
                </p>
                <p>
                  This is not mass production. This is atelier craft — each piece cast by hand, aged for 21 days in a climate-controlled chamber, and finished
                  with the precision of a watchmaker. The resin we use comes from a single supplier in Lyon, France, who has been producing artisan resins for three generations.
                </p>
                <p>
                  We make six dolls. Not because we can&apos;t make more, but because each one deserves our complete attention. Quality is not a metric — it&apos;s a practice.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Timeline */}
        <section className="px-8 md:px-16 lg:px-32 py-32 bg-white">
          <ScrollReveal>
            <span className="section-label block mb-6 text-center">TIMELINE</span>
            <h2 className="section-title text-4xl md:text-5xl text-center mb-20">Our Journey</h2>
          </ScrollReveal>

          <div className="max-w-2xl mx-auto space-y-16">
            {[
              { year: "2024", title: "The Beginning", desc: "Founded in a 20m² studio in Shimokitazawa, Tokyo. Akira Tanaka hand-carved the first prototype — Iris — in wax, then cast it in French resin imported from Lyon. The fantasy skin tone was an accident; the lavender undertone came from a pigment miscalculation. It became our signature." },
              { year: "2024", title: "The Eye Mechanism", desc: "Patented our spring-loaded eye system — a mechanism that allows the doll's gaze to follow the viewer. It took 14 months of prototyping. The BJD community called it 'uncanny.' We took that as a compliment." },
              { year: "2025", title: "Series 01 Launch", desc: "Noa and Eos launched on a Tuesday morning. Both sold out in 72 hours. We received 400 emails from collectors who missed the window. That week, we knew VALO was no longer a side project." },
              { year: "2025", title: "Lune Collaboration", desc: "Our first artist collaboration — with sculptor Akira Tanaka (no relation to our founder). Lune's face was hand-carved, then digitized for CNC machining. 50 units. Each one slightly different. The last one sold at auction for $3,200." },
              { year: "2026", title: "The Light Lab", desc: "Launched the world's first BJD lighting simulator. A WebGL tool that lets collectors preview how resin behaves under 4,000 lighting conditions. Built by our engineering team in 4 months. Featured on Colossal and Dezeen." },
              { year: "2026", title: "Series 02", desc: "Introduced double-jointed engineering and eco-resin options. Kaia proved that sustainability and beauty are not mutually exclusive. Our bio-resin — derived from plant-based polyols — has the same clarity as petroleum-based resin." },
              { year: "2027", title: "The Future", desc: "Nova — our 100% plant-based bio-resin prototype — enters testing. We're also developing a new male sculpt (Kael) and expanding our resin color palette. The studio has grown to 12 people. The obsession hasn't changed." },
            ].map((item, i) => (
              <ScrollReveal key={i}>
                <div className="flex gap-8 items-start">
                  <div className="shrink-0 w-16 text-right">
                    <span className="font-mono text-xs tracking-widest text-gold">{item.year}</span>
                  </div>
                  <div className="w-px h-full bg-divider shrink-0" />
                  <div>
                    <h3 className="font-serif text-2xl mb-2">{item.title}</h3>
                    <p className="font-sans text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Numbers */}
        <section className="px-8 md:px-16 lg:px-32 py-32">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { value: "6", label: "SCULPTS" },
              { value: "18", label: "JOINT POINTS" },
              { value: "21", label: "DAYS AGING" },
              { value: "0.1mm", label: "TOLERANCE" },
            ].map((stat, i) => (
              <ScrollReveal key={i}>
                <div className="stat-number">{stat.value}</div>
                <div className="stat-label mt-2">{stat.label}</div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-8 md:px-16 lg:px-32 py-32 text-center">
          <ScrollReveal>
            <h2 className="section-title text-4xl md:text-5xl mb-8">Experience the Craft</h2>
            <p className="section-label mb-12 max-w-md mx-auto">
              Explore our archive, read our journal, or join our community of collectors.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/archive" className="btn-primary">
                BROWSE ARCHIVE
              </Link>
              <Link href="/journal" className="btn-secondary">
                READ JOURNAL
              </Link>
            </div>
          </ScrollReveal>
        </section>
      </main>
    </div>
  );
}
