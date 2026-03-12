import { useState, useEffect, useCallback, useRef } from "react";

interface UseSessionTimeoutOptions {
  timeoutMs?: number;
  warningMs?: number;
  onTimeout: () => void;
}

export function useSessionTimeout({
  timeoutMs = 15 * 60 * 1000,
  warningMs = 2 * 60 * 1000,
  onTimeout,
}: UseSessionTimeoutOptions) {
  const [showWarning, setShowWarning] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const warningRef = useRef<ReturnType<typeof setTimeout>>();

  const resetTimers = useCallback(() => {
    setShowWarning(false);
    clearTimeout(timeoutRef.current);
    clearTimeout(warningRef.current);

    warningRef.current = setTimeout(() => {
      setShowWarning(true);
    }, timeoutMs - warningMs);

    timeoutRef.current = setTimeout(() => {
      onTimeout();
    }, timeoutMs);
  }, [timeoutMs, warningMs, onTimeout]);

  const extendSession = useCallback(() => {
    resetTimers();
  }, [resetTimers]);

  useEffect(() => {
    const events = ["mousedown", "keydown", "scroll", "touchstart", "mousemove"];
    
    let debounceTimer: ReturnType<typeof setTimeout>;
    const handler = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(resetTimers, 1000);
    };

    events.forEach((e) => document.addEventListener(e, handler, { passive: true }));
    resetTimers();

    return () => {
      events.forEach((e) => document.removeEventListener(e, handler));
      clearTimeout(timeoutRef.current);
      clearTimeout(warningRef.current);
      clearTimeout(debounceTimer);
    };
  }, [resetTimers]);

  return { showWarning, extendSession };
}
