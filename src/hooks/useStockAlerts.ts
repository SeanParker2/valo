"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

interface StockAlert {
  dollId: string;
  email: string;
  createdAt: number;
}

export function useStockAlerts() {
  const [alerts, setAlerts] = useLocalStorage<StockAlert[]>("valo-stock-alerts", []);

  const addAlert = useCallback((dollId: string, email: string) => {
    setAlerts((prev) => {
      if (prev.some((a) => a.dollId === dollId && a.email === email)) return prev;
      return [...prev, { dollId, email, createdAt: Date.now() }];
    });
  }, [setAlerts]);

  const removeAlert = useCallback((dollId: string, email: string) => {
    setAlerts((prev) => prev.filter((a) => !(a.dollId === dollId && a.email === email)));
  }, [setAlerts]);

  const hasAlert = useCallback((dollId: string, email: string) => {
    return alerts.some((a) => a.dollId === dollId && a.email === email);
  }, [alerts]);

  const getAlertsForDoll = useCallback((dollId: string) => {
    return alerts.filter((a) => a.dollId === dollId);
  }, [alerts]);

  return { alerts, addAlert, removeAlert, hasAlert, getAlertsForDoll };
}
