import { useCallback, useRef } from "react";
import { mockBadges } from "@/data/mock-badges";
import { mockLavoratori, mockSiteAssignments } from "@/data/mock-data";
import { useWorkerCompliance } from "./useWorkerCompliance";

export interface VerificationResult {
  success: boolean;
  canCheckIn: boolean;
  warnings: string[];
  blocks: string[];
  badge: typeof mockBadges[0] | null;
  worker: typeof mockLavoratori[0] | null;
}

export function useBadgeVerification() {
  const attemptsRef = useRef<number[]>([]);
  const RATE_LIMIT = 10;
  const RATE_WINDOW_MS = 60_000;

  const isRateLimited = useCallback((): boolean => {
    const now = Date.now();
    attemptsRef.current = attemptsRef.current.filter((t) => now - t < RATE_WINDOW_MS);
    return attemptsRef.current.length >= RATE_LIMIT;
  }, []);

  const recordAttempt = useCallback(() => {
    attemptsRef.current.push(Date.now());
  }, []);

  const verify = useCallback(
    (qrData: string, cantiereId: string): VerificationResult => {
      const warnings: string[] = [];
      const blocks: string[] = [];

      // Rate limit check
      if (isRateLimited()) {
        return {
          success: false, canCheckIn: false,
          warnings: [], blocks: ["Troppi tentativi. Attendi 1 minuto."],
          badge: null, worker: null,
        };
      }
      recordAttempt();

      // Parse QR
      let parsed: { code?: string; worker?: string; site?: string } | null = null;
      try {
        parsed = JSON.parse(qrData);
      } catch {
        blocks.push("QR code non valido o corrotto.");
        return { success: false, canCheckIn: false, warnings, blocks, badge: null, worker: null };
      }

      // Find badge
      const badge = mockBadges.find(
        (b) => b.qr_payload === qrData || b.codice_univoco === parsed?.code
      );
      if (!badge) {
        blocks.push("Badge non trovato nel sistema.");
        return { success: false, canCheckIn: false, warnings, blocks, badge: null, worker: null };
      }

      // Check badge status
      if (badge.stato === "revocato") {
        blocks.push("Badge revocato.");
        return { success: false, canCheckIn: false, warnings, blocks, badge, worker: null };
      }
      if (badge.stato === "sospeso") {
        blocks.push("Badge sospeso — contattare l'amministratore.");
        return { success: false, canCheckIn: false, warnings, blocks, badge, worker: null };
      }

      // Check badge expiry
      const now = new Date("2026-03-12");
      if (new Date(badge.data_scadenza) < now) {
        blocks.push("Badge scaduto.");
        return { success: false, canCheckIn: false, warnings, blocks, badge, worker: null };
      }

      // Find worker
      const worker = mockLavoratori.find((l) => l.id === badge.lavoratore_id);
      if (!worker) {
        blocks.push("Lavoratore non trovato.");
        return { success: false, canCheckIn: false, warnings, blocks, badge, worker: null };
      }

      // Check compliance
      const hasExpiredDocs = worker.safety_training.some(
        (t) => new Date(t.expiry) < now
      );
      if (hasExpiredDocs) {
        blocks.push("Formazione sicurezza scaduta.");
      }
      if (!worker.durc_valid || (worker.durc_expiry && new Date(worker.durc_expiry) < now)) {
        blocks.push("DURC scaduto o non valido.");
      }
      if (worker.health_status === "non_idoneo") {
        blocks.push("Idoneità sanitaria: non idoneo.");
      }
      if (worker.health_status === "idoneo_limitato") {
        warnings.push("Idoneità sanitaria limitata — verificare mansioni consentite.");
      }

      // Check site assignment
      const assigned = mockSiteAssignments.some(
        (sa) => sa.lavoratore_id === worker.id && sa.cantiere_id === cantiereId && sa.attivo
      );
      if (!assigned) {
        blocks.push("Lavoratore non assegnato a questo cantiere.");
      }

      const canCheckIn = blocks.length === 0;

      return { success: true, canCheckIn, warnings, blocks, badge, worker };
    },
    [isRateLimited, recordAttempt]
  );

  const remainingAttempts = useCallback((): number => {
    const now = Date.now();
    const recent = attemptsRef.current.filter((t) => now - t < RATE_WINDOW_MS);
    return Math.max(0, RATE_LIMIT - recent.length);
  }, []);

  return { verify, remainingAttempts, isRateLimited };
}
