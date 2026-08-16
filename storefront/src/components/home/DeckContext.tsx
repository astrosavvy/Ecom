"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

interface DeckContextType {
  activeTile: number;
  setActiveTile: (index: number) => void;
  nextTile: () => void;
  prevTile: () => void;
  totalTiles: number;
}

const DeckContext = createContext<DeckContextType | null>(null);

export function DeckProvider({ children }: { children: ReactNode }) {
  const [activeTile, setActiveTile] = useState(0);
  const totalTiles = 4;

  const nextTile = useCallback(() => {
    setActiveTile((prev) => Math.min(prev + 1, totalTiles - 1));
  }, [totalTiles]);

  const prevTile = useCallback(() => {
    setActiveTile((prev) => Math.max(prev - 1, 0));
  }, []);

  return (
    <DeckContext.Provider value={{ activeTile, setActiveTile, nextTile, prevTile, totalTiles }}>
      {children}
    </DeckContext.Provider>
  );
}

export function useDeck() {
  const ctx = useContext(DeckContext);
  if (!ctx) {
    throw new Error("useDeck must be used within DeckProvider");
  }
  return ctx;
}
