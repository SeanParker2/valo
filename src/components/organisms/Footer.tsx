"use client";

import { ArrowUp } from "lucide-react";
import Link from "next/link";
import { NewsletterInline } from "@/components/molecules/Newsletter";

const NAV_LINKS = [
  { label: "Archive", href: "/archive" },
  { label: "Collection", href: "/collection" },
  { label: "Resin Lab", href: "/tools/resin-lab" },
  { label: "Joints", href: "/tools/joints" },
  { label: "Journal", href: "/journal" },
  { label: "Collective", href: "/collective" },
  { label: "Story", href: "/story" },
];

const SOCIAL_LINKS = [
  { label: "INSTAGRAM", href: "https://instagram.com" },
  { label: "WEIBO", href: "https://weibo.com" },
  { label: "CONTACT", href: "mailto:atelier@valo.jp" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0a0a0a] border-t border-[#1a1a1a] text-white relative overflow-hidden">
      {/* Newsletter */}
      <div className="px-8 md:px-16 lg:px-32 py-24">
        <NewsletterInline />
      </div>

      {/* Links Grid */}
      <div className="border-t border-[#1a1a1a] py-16 px-8 md:px-16 lg:px-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 mb-16">
          {/* Navigation */}
          <div>
            <h4 className="font-sans text-[10px] tracking-widest text-gray-500 uppercase mb-6">Navigate</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-serif text-lg text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-sans text-[10px] tracking-widest text-gray-500 uppercase mb-6">Connect</h4>
            <ul className="space-y-3">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("mailto") ? undefined : "_blank"}
                    rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                    className="font-serif text-lg text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Atelier */}
          <div>
            <h4 className="font-sans text-[10px] tracking-widest text-gray-500 uppercase mb-6">Atelier</h4>
            <p className="font-serif text-lg text-gray-400 leading-relaxed mb-4">
              We make six dolls. Each one cast by hand in French resin, aged for 21 days, and finished with the precision of a watchmaker. Quality is not a metric — it&apos;s a practice.
            </p>
            <p className="font-serif text-sm text-gray-500 leading-relaxed mb-4">
              Shimokitazawa, Tokyo &bull; Lyon resin supplier since 2024
            </p>
            <p className="font-mono text-[10px] text-gray-600 tracking-widest">
              TOKYO &bull; EST. 2024
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[#1a1a1a] pt-12 flex flex-col md:flex-row justify-between items-end">
          <div>
            <h1 className="font-serif text-[8rem] md:text-[12rem] leading-none text-[#141414] select-none">VALO</h1>
          </div>
          <div className="flex items-center gap-6 mb-8 md:mb-4">
            <span className="text-[10px] font-mono text-gray-600 tracking-widest">&copy; 2026 VALO ATELIER</span>
            <button
              onClick={scrollToTop}
              className="w-10 h-10 border border-gray-700 flex items-center justify-center hover:border-white hover:text-white transition-colors text-gray-500"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
