"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<string[]>("valo-favorites", []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  }, [setFavorites]);

  const isFavorite = useCallback((id: string) => {
    return favorites.includes(id);
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, [setFavorites]);

  return { favorites, toggleFavorite, isFavorite, clearFavorites };
}
