"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function FavoriteButton({ isFavorite, onToggle, className, size = "md" }: FavoriteButtonProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onToggle();
      }}
      className={cn(
        "flex items-center justify-center rounded-full transition-all duration-300",
        sizeClasses[size],
        isFavorite
          ? "bg-red-50 text-red-500 hover:bg-red-100"
          : "bg-white/80 text-gray-400 hover:text-red-400 hover:bg-white",
        className
      )}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart className={cn(iconSizes[size], isFavorite && "fill-current")} />
    </button>
  );
}
