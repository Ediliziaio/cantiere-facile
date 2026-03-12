import { useState, useEffect } from "react";

interface NetworkInfo {
  isOnline: boolean;
  connectionSpeed: string;
  isSlowNetwork: boolean;
  isSaveData: boolean;
}

export function useNetworkStatus(): NetworkInfo {
  const [status, setStatus] = useState<NetworkInfo>(() => ({
    isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
    connectionSpeed: getConnectionSpeed(),
    isSlowNetwork: getIsSlowNetwork(),
    isSaveData: getSaveData(),
  }));

  useEffect(() => {
    const update = () => {
      setStatus({
        isOnline: navigator.onLine,
        connectionSpeed: getConnectionSpeed(),
        isSlowNetwork: getIsSlowNetwork(),
        isSaveData: getSaveData(),
      });
    };

    window.addEventListener("online", update);
    window.addEventListener("offline", update);

    const conn = (navigator as any).connection;
    if (conn) {
      conn.addEventListener("change", update);
    }

    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
      if (conn) conn.removeEventListener("change", update);
    };
  }, []);

  return status;
}

function getConnectionSpeed(): string {
  const conn = (navigator as any).connection;
  return conn?.effectiveType || "4g";
}

function getIsSlowNetwork(): boolean {
  const conn = (navigator as any).connection;
  if (!conn) return false;
  return conn.effectiveType === "2g" || conn.effectiveType === "slow-2g";
}

function getSaveData(): boolean {
  const conn = (navigator as any).connection;
  return conn?.saveData || false;
}
