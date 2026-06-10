"use client";

import { useCallback, useState } from "react";
import { Share2, Check, Link as LinkIcon } from "lucide-react";

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
  className?: string;
}

export function ShareButton({ title, text, url, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
      } catch {
        // User cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Clipboard failed
      }
    }
  }, [title, text, shareUrl]);

  return (
    <button
      onClick={handleShare}
      className={className ?? "w-16 border border-gray-300 flex items-center justify-center hover:border-black transition-colors"}
      aria-label="Share"
    >
      {copied ? <Check className="w-4 h-4 text-gold" /> : <Share2 className="w-4 h-4 text-gray-600" />}
    </button>
  );
}
