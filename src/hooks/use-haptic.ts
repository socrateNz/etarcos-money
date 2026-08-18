"use client";

import { useCallback } from "react";

export function useHaptic() {
  const vibrate = useCallback((pattern: number | number[] = 50) => {
    if (typeof window !== "undefined" && "navigator" in window && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, []);

  const selectionAsync = useCallback(() => vibrate(10), [vibrate]);
  const lightImpact = useCallback(() => vibrate(20), [vibrate]);
  const mediumImpact = useCallback(() => vibrate(40), [vibrate]);
  const heavyImpact = useCallback(() => vibrate(60), [vibrate]);
  const success = useCallback(() => vibrate([20, 50, 20]), [vibrate]);
  const error = useCallback(() => vibrate([50, 50, 50]), [vibrate]);

  return {
    selectionAsync,
    lightImpact,
    mediumImpact,
    heavyImpact,
    success,
    error,
    vibrate,
  };
}
