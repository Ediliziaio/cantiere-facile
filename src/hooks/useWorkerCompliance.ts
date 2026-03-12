import { useMemo } from "react";
import type { Lavoratore } from "@/data/mock-data";

export interface ComplianceItem {
  label: string;
  category: "qualification" | "training" | "durc" | "health";
  expiryDate: string | null;
  daysToExpiry: number | null;
  status: "ok" | "warning" | "expired" | "missing";
}

export interface WorkerCompliance {
  isCompliant: boolean;
  items: ComplianceItem[];
  expiringItems: ComplianceItem[];
  expiredItems: ComplianceItem[];
  overallStatus: "ok" | "warning" | "blocked";
}

const TODAY = new Date("2026-03-12");

function daysUntil(dateStr: string): number {
  const d = new Date(dateStr);
  return Math.ceil((d.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24));
}

function itemStatus(daysLeft: number | null): ComplianceItem["status"] {
  if (daysLeft === null) return "missing";
  if (daysLeft < 0) return "expired";
  if (daysLeft <= 30) return "warning";
  return "ok";
}

export function useWorkerCompliance(worker: Lavoratore | null | undefined): WorkerCompliance {
  return useMemo(() => {
    if (!worker) {
      return { isCompliant: false, items: [], expiringItems: [], expiredItems: [], overallStatus: "blocked" };
    }

    const items: ComplianceItem[] = [];

    // Qualifications
    for (const q of worker.qualifications) {
      const days = daysUntil(q.expiry);
      items.push({
        label: q.type.replace(/_/g, " "),
        category: "qualification",
        expiryDate: q.expiry,
        daysToExpiry: days,
        status: itemStatus(days),
      });
    }

    // Safety training
    for (const t of worker.safety_training) {
      const days = daysUntil(t.expiry);
      items.push({
        label: t.course.replace(/_/g, " "),
        category: "training",
        expiryDate: t.expiry,
        daysToExpiry: days,
        status: itemStatus(days),
      });
    }

    // DURC
    const durcDays = worker.durc_expiry ? daysUntil(worker.durc_expiry) : null;
    items.push({
      label: "DURC",
      category: "durc",
      expiryDate: worker.durc_expiry,
      daysToExpiry: durcDays,
      status: !worker.durc_valid ? "expired" : itemStatus(durcDays),
    });

    // Health / medical
    const healthOk = worker.health_status !== "non_idoneo";
    items.push({
      label: "Idoneità sanitaria",
      category: "health",
      expiryDate: worker.last_medical_visit,
      daysToExpiry: null,
      status: healthOk ? (worker.health_status === "idoneo_limitato" ? "warning" : "ok") : "expired",
    });

    const expiredItems = items.filter((i) => i.status === "expired");
    const expiringItems = items.filter((i) => i.status === "warning");
    const hasExpired = expiredItems.length > 0;
    const hasWarning = expiringItems.length > 0;

    return {
      isCompliant: !hasExpired,
      items,
      expiringItems,
      expiredItems,
      overallStatus: hasExpired ? "blocked" : hasWarning ? "warning" : "ok",
    };
  }, [worker]);
}
