import { useState, useEffect, useRef, useCallback } from "react";

export type SignalStrength = "excellent" | "good" | "fair" | "poor" | "none";

export interface GeoPosition {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
  speed: number | null;
  heading: number | null;
}

export interface GeolocationState {
  position: GeoPosition | null;
  error: string | null;
  errorCode: number | null;
  signalStrength: SignalStrength;
  isTracking: boolean;
  isMockSuspected: boolean;
  permissionState: PermissionState | "unknown";
}

// Italy bounding box
const ITALY_BOUNDS = { latMin: 35.5, latMax: 47.5, lngMin: 6.0, lngMax: 19.0 };

function getSignalStrength(accuracy: number): SignalStrength {
  if (accuracy <= 10) return "excellent";
  if (accuracy <= 20) return "good";
  if (accuracy <= 50) return "fair";
  return "poor";
}

function isInItaly(lat: number, lng: number): boolean {
  return (
    lat >= ITALY_BOUNDS.latMin &&
    lat <= ITALY_BOUNDS.latMax &&
    lng >= ITALY_BOUNDS.lngMin &&
    lng <= ITALY_BOUNDS.lngMax
  );
}

// Haversine distance in meters
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  validateItaly?: boolean;
}

export function useGeolocation(options: UseGeolocationOptions = {}) {
  const {
    enableHighAccuracy = true,
    timeout = 15000,
    maximumAge = 0,
    validateItaly = true,
  } = options;

  const [state, setState] = useState<GeolocationState>({
    position: null,
    error: null,
    errorCode: null,
    signalStrength: "none",
    isTracking: false,
    isMockSuspected: false,
    permissionState: "unknown",
  });

  const watchIdRef = useRef<number | null>(null);
  const lastPositionRef = useRef<GeoPosition | null>(null);

  // Check permission state
  useEffect(() => {
    if ("permissions" in navigator) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        setState((s) => ({ ...s, permissionState: result.state }));
        result.onchange = () => {
          setState((s) => ({ ...s, permissionState: result.state }));
        };
      }).catch(() => {});
    }
  }, []);

  const detectMockLocation = useCallback(
    (newPos: GeoPosition): boolean => {
      const prev = lastPositionRef.current;
      if (!prev) return false;

      const timeDiffSec = (newPos.timestamp - prev.timestamp) / 1000;
      if (timeDiffSec <= 0) return false;

      const dist = haversineDistance(prev.lat, prev.lng, newPos.lat, newPos.lng);
      const calculatedSpeed = dist / timeDiffSec; // m/s

      // If speed exceeds 200 m/s (~720 km/h) and reported speed is null or much lower, suspect mock
      if (calculatedSpeed > 200 && (newPos.speed === null || newPos.speed < 50)) {
        return true;
      }

      // Jump detection: >1km in <2 seconds
      if (dist > 1000 && timeDiffSec < 2) {
        return true;
      }

      return false;
    },
    []
  );

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setState((s) => ({
        ...s,
        error: "Geolocalizzazione non supportata dal browser",
        errorCode: null,
      }));
      return;
    }

    if (watchIdRef.current !== null) return;

    setState((s) => ({ ...s, isTracking: true, error: null }));

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const newPosition: GeoPosition = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp,
          speed: pos.coords.speed,
          heading: pos.coords.heading,
        };

        if (validateItaly && !isInItaly(newPosition.lat, newPosition.lng)) {
          setState((s) => ({
            ...s,
            error: "Posizione fuori dal territorio italiano",
            position: newPosition,
            signalStrength: getSignalStrength(newPosition.accuracy),
          }));
          return;
        }

        const isMock = detectMockLocation(newPosition);
        lastPositionRef.current = newPosition;

        setState((s) => ({
          ...s,
          position: newPosition,
          error: null,
          errorCode: null,
          signalStrength: getSignalStrength(newPosition.accuracy),
          isMockSuspected: isMock,
        }));
      },
      (err) => {
        const messages: Record<number, string> = {
          1: "Permesso di geolocalizzazione negato. Abilita la posizione nelle impostazioni.",
          2: "Impossibile determinare la posizione. Verifica che il GPS sia attivo.",
          3: "Timeout nel rilevamento posizione. Riprova in un'area aperta.",
        };
        setState((s) => ({
          ...s,
          error: messages[err.code] || err.message,
          errorCode: err.code,
          signalStrength: "none",
        }));
      },
      { enableHighAccuracy, timeout, maximumAge }
    );
  }, [enableHighAccuracy, timeout, maximumAge, validateItaly, detectMockLocation]);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setState((s) => ({ ...s, isTracking: false }));
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return { ...state, startTracking, stopTracking, haversineDistance };
}

export { haversineDistance };
