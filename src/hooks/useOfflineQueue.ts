import { useState, useEffect, useCallback } from "react";

export interface QueuedOperation {
  id: string;
  type: "check_in" | "check_out";
  payload: {
    cantiere_id: string;
    cantiere_nome: string;
    lat: number | null;
    lng: number | null;
    accuracy: number | null;
    distance: number | null;
    verification_method: "auto_gps" | "qr_scan" | "manual";
    note?: string;
    server_validated: false;
  };
  timestamp: number;
  retries: number;
  synced: boolean;
}

const STORAGE_KEY = "cantiere_offline_queue";

function loadQueue(): QueuedOperation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveQueue(queue: QueuedOperation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
}

export function useOfflineQueue() {
  const [queue, setQueue] = useState<QueuedOperation[]>(loadQueue);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Sync state with localStorage
  useEffect(() => {
    saveQueue(queue);
  }, [queue]);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const addOperation = useCallback(
    (op: Omit<QueuedOperation, "id" | "retries" | "synced">) => {
      const newOp: QueuedOperation = {
        ...op,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        retries: 0,
        synced: false,
      };
      setQueue((prev) => [...prev, newOp]);
      return newOp;
    },
    []
  );

  const pendingCount = queue.filter((op) => !op.synced).length;

  const markSynced = useCallback((id: string) => {
    setQueue((prev) =>
      prev.map((op) => (op.id === id ? { ...op, synced: true } : op))
    );
  }, []);

  const clearSynced = useCallback(() => {
    setQueue((prev) => prev.filter((op) => !op.synced));
  }, []);

  const getHistory = useCallback(() => {
    return [...queue].sort((a, b) => b.timestamp - a.timestamp);
  }, [queue]);

  // Auto-sync stub — will connect to Supabase in the future
  useEffect(() => {
    if (!isOnline) return;

    const pending = queue.filter((op) => !op.synced && op.retries < 3);
    if (pending.length === 0) return;

    // Future: sync with Supabase attendances table
    // For now, mark as synced after a short delay (simulating)
    // In production, replace this with actual API calls
    // pending.forEach(op => {
    //   supabase.from('attendances').insert(op.payload)
    //     .then(() => markSynced(op.id))
    //     .catch(() => incrementRetry(op.id));
    // });
  }, [isOnline, queue]);

  return {
    queue,
    addOperation,
    pendingCount,
    markSynced,
    clearSynced,
    getHistory,
    isOnline,
  };
}
