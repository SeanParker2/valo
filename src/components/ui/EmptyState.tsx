"use client";

import Link from "next/link";
import { Heart, Search, MessageCircle } from "lucide-react";

interface EmptyStateProps {
  type: "favorites" | "search" | "comments" | "results";
  query?: string;
  onReset?: () => void;
}

export function EmptyState({ type, query, onReset }: EmptyStateProps) {
  const configs = {
    favorites: {
      icon: Heart,
      title: "No favorites yet",
      description: "Browse the archive and click the heart icon to add dolls to your favorites.",
      action: { label: "BROWSE ARCHIVE", href: "/archive" },
    },
    search: {
      icon: Search,
      title: "No results found",
      description: `We couldn't find anything matching "${query}". Try different keywords or clear your filters.`,
      action: null,
    },
    comments: {
      icon: MessageCircle,
      title: "No comments yet",
      description: "Be the first to share your thoughts about this piece.",
      action: null,
    },
    results: {
      icon: Search,
      title: "No results",
      description: "Try adjusting your filters or search terms.",
      action: null,
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
      <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center mb-6">
        <Icon className="w-7 h-7 text-gray-300" />
      </div>
      <h3 className="font-serif text-2xl text-gray-400 mb-3">{config.title}</h3>
      <p className="font-serif text-sm text-gray-400 max-w-sm leading-relaxed mb-8">
        {config.description}
      </p>
      {config.action && (
        <Link href={config.action.href} className="btn-secondary">
          {config.action.label}
        </Link>
      )}
      {onReset && (
        <button onClick={onReset} className="btn-ghost mt-4">
          CLEAR FILTERS
        </button>
      )}
    </div>
  );
}
