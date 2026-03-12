import { useState, useEffect, useRef, useCallback } from "react";
import { haversineDistance } from "./useGeolocation";
import type { GeoPosition } from "./useGeolocation";

export type GeofenceStatus = "inside" | "entering" | "leaving" | "outside" | "unknown";

interface GeofenceState {
  isInside: boolean;
  distance: number | null;
  status: GeofenceStatus;
}

interface UseGeofencingOptions {
  siteLat: number;
  siteLng: number;
  radiusMeters: number;
  hysteresis?: number; // multiplier for exit threshold, default 1.2
  debounceCount?: number; // consecutive fixes required, default 3
  onEnter?: () => void;
  onExit?: () => void;
  enabled?: boolean;
}

export function useGeofencing({
  siteLat,
  siteLng,
  radiusMeters,
  hysteresis = 1.2,
  debounceCount = 3,
  onEnter,
  onExit,
  enabled = true,
}: UseGeofencingOptions) {
  const [state, setState] = useState<GeofenceState>({
    isInside: false,
    distance: null,
    status: "unknown",
  });

  const confirmedStatusRef = useRef<"inside" | "outside" | "unknown">("unknown");
  const consecutiveRef = useRef(0);
  const pendingStatusRef = useRef<"inside" | "outside" | null>(null);
  const onEnterRef = useRef(onEnter);
  const onExitRef = useRef(onExit);

  useEffect(() => {
    onEnterRef.current = onEnter;
    onExitRef.current = onExit;
  }, [onEnter, onExit]);

  const triggerHaptic = useCallback((pattern: number[]) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  }, []);

  const updatePosition = useCallback(
    (position: GeoPosition | null) => {
      if (!position || !enabled) return;

      const dist = haversineDistance(position.lat, position.lng, siteLat, siteLng);

      const exitRadius = radiusMeters * hysteresis;
      const rawInside = dist <= radiusMeters;
      const rawOutside = dist > exitRadius;

      // Determine raw status
      let rawStatus: "inside" | "outside";
      if (rawInside) {
        rawStatus = "inside";
      } else if (rawOutside) {
        rawStatus = "outside";
      } else {
        // In hysteresis zone: keep current status
        rawStatus = confirmedStatusRef.current === "inside" ? "inside" : "outside";
      }

      // Debounce logic
      if (rawStatus === pendingStatusRef.current) {
        consecutiveRef.current++;
      } else {
        pendingStatusRef.current = rawStatus;
        consecutiveRef.current = 1;
      }

      if (consecutiveRef.current >= debounceCount && rawStatus !== confirmedStatusRef.current) {
        const prevStatus = confirmedStatusRef.current;
        confirmedStatusRef.current = rawStatus;

        if (rawStatus === "inside" && prevStatus !== "inside") {
          triggerHaptic([100, 50, 100]); // double tap for enter
          onEnterRef.current?.();
        } else if (rawStatus === "outside" && prevStatus !== "outside") {
          triggerHaptic([200]); // single long for exit
          onExitRef.current?.();
        }
      }

      // Determine display status
      let displayStatus: GeofenceStatus;
      if (confirmedStatusRef.current === "unknown") {
        displayStatus = rawStatus === "inside" ? "entering" : "outside";
      } else if (
        pendingStatusRef.current !== confirmedStatusRef.current &&
        consecutiveRef.current > 0
      ) {
        displayStatus = pendingStatusRef.current === "inside" ? "entering" : "leaving";
      } else {
        displayStatus = confirmedStatusRef.current;
      }

      setState({
        isInside: confirmedStatusRef.current === "inside",
        distance: Math.round(dist),
        status: displayStatus,
      });
    },
    [siteLat, siteLng, radiusMeters, hysteresis, debounceCount, enabled, triggerHaptic]
  );

  const reset = useCallback(() => {
    confirmedStatusRef.current = "unknown";
    consecutiveRef.current = 0;
    pendingStatusRef.current = null;
    setState({ isInside: false, distance: null, status: "unknown" });
  }, []);

  return { ...state, updatePosition, reset };
}
