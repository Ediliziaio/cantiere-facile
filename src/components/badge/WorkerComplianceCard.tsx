import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";
import type { WorkerCompliance, ComplianceItem } from "@/hooks/useWorkerCompliance";

interface Props {
  compliance: WorkerCompliance;
  compact?: boolean;
}

function statusColor(status: ComplianceItem["status"]) {
  switch (status) {
    case "ok": return "text-green-600";
    case "warning": return "text-yellow-600";
    case "expired": return "text-destructive";
    case "missing": return "text-muted-foreground";
  }
}

function progressValue(item: ComplianceItem): number {
  if (item.status === "expired" || item.status === "missing") return 100;
  if (item.daysToExpiry === null) return 0;
  // 365 days = 0%, 0 days = 100%
  return Math.max(0, Math.min(100, 100 - (item.daysToExpiry / 365) * 100));
}

function progressColor(item: ComplianceItem): string {
  if (item.daysToExpiry !== null && item.daysToExpiry > 90) return "[&>div]:bg-green-500";
  if (item.daysToExpiry !== null && item.daysToExpiry > 30) return "[&>div]:bg-yellow-500";
  return "[&>div]:bg-destructive";
}

export function WorkerComplianceCard({ compliance, compact }: Props) {
  const Icon = compliance.overallStatus === "ok"
    ? ShieldCheck
    : compliance.overallStatus === "warning"
    ? ShieldAlert
    : ShieldX;

  const statusLabel = compliance.overallStatus === "ok"
    ? "Conforme"
    : compliance.overallStatus === "warning"
    ? "Attenzione"
    : "Non conforme";

  const badgeVariant = compliance.overallStatus === "ok"
    ? "default"
    : compliance.overallStatus === "warning"
    ? "secondary"
    : "destructive";

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${
          compliance.overallStatus === "ok" ? "text-green-600" :
          compliance.overallStatus === "warning" ? "text-yellow-600" : "text-destructive"
        }`} />
        <Badge variant={badgeVariant} className="text-xs">{statusLabel}</Badge>
        {compliance.expiredItems.length > 0 && (
          <span className="text-xs text-destructive">{compliance.expiredItems.length} scadut{compliance.expiredItems.length === 1 ? "o" : "i"}</span>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${
              compliance.overallStatus === "ok" ? "text-green-600" :
              compliance.overallStatus === "warning" ? "text-yellow-600" : "text-destructive"
            }`} />
            <h3 className="text-sm font-semibold text-foreground">Stato Conformità</h3>
          </div>
          <Badge variant={badgeVariant}>{statusLabel}</Badge>
        </div>

        <div className="space-y-3">
          {compliance.items.map((item, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className={`font-medium capitalize ${statusColor(item.status)}`}>
                  {item.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {item.status === "expired"
                    ? "Scaduto"
                    : item.status === "missing"
                    ? "Mancante"
                    : item.daysToExpiry !== null
                    ? `${item.daysToExpiry}gg`
                    : item.status === "ok"
                    ? "OK"
                    : "—"}
                </span>
              </div>
              {item.daysToExpiry !== null && (
                <Progress
                  value={progressValue(item)}
                  className={`h-1.5 ${progressColor(item)}`}
                />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
