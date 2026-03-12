import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Clock, CheckCircle2, AlertTriangle, Send, Copy } from "lucide-react";
import { mockPendingNotifications, mockAccidents, severityLabels } from "@/data/mock-safety";
import { mockCantieri, mockLavoratori } from "@/data/mock-data";
import { toast } from "@/hooks/use-toast";

const statusStyles: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  da_inviare: { label: 'Da inviare', variant: 'destructive' },
  inviata: { label: 'Inviata', variant: 'default' },
  scaduta: { label: 'Scaduta', variant: 'secondary' },
};

function hoursRemaining(deadlineStr: string): number {
  const now = new Date();
  const deadline = new Date(deadlineStr);
  return Math.max(0, Math.round((deadline.getTime() - now.getTime()) / (1000 * 60 * 60)));
}

function generatePecTemplate(accidentId: string, authority: string): string {
  const acc = mockAccidents.find(a => a.id === accidentId);
  if (!acc) return '';
  const site = mockCantieri.find(c => c.id === acc.site_id);
  const worker = mockLavoratori.find(l => l.id === acc.injured_worker_id);

  if (authority === 'inail') {
    return `OGGETTO: Denuncia infortunio sul lavoro - Art. 53 D.P.R. 1124/1965

Spett.le INAIL - Sede di Milano,

Si comunica l'avvenuto infortunio sul lavoro con i seguenti dati:

DATI INFORTUNIO:
- Data e ora: ${acc.accident_date} ore ${acc.accident_time}
- Luogo: ${site?.nome || ''}, ${site?.indirizzo || ''}, ${site?.comune || ''}
- Posizione: ${acc.location_precise}

LAVORATORE INFORTUNATO:
- Nome: ${worker?.nome || ''} ${worker?.cognome || ''}
- Codice Fiscale: ${worker?.codice_fiscale || ''}
- Mansione: ${worker?.mansione || ''}

DINAMICA: ${acc.description_detailed}
TIPO: ${acc.accident_type}
GRAVITÀ: ${severityLabels[acc.severity]}
GIORNI ASSENZA PREVISTI: ${acc.days_absence}

Si resta a disposizione per ulteriori informazioni.
Distinti saluti.`;
  }

  return `OGGETTO: Comunicazione infortunio grave - Art. 18 D.Lgs 81/2008

Spett.le ASL - Dipartimento Prevenzione,

Si comunica infortunio ${severityLabels[acc.severity]} avvenuto il ${acc.accident_date} alle ore ${acc.accident_time} presso il cantiere "${site?.nome}", ${site?.indirizzo}, ${site?.comune}.

Lavoratore: ${worker?.nome} ${worker?.cognome} (CF: ${worker?.codice_fiscale})
Dinamica: ${acc.description_detailed}

Azioni correttive intraprese: ${acc.corrective_actions.map(a => a.action).join('; ') || 'Nessuna ancora definita'}

Distinti saluti.`;
}

export function NotificationPanel() {
  const allNotifications = [
    ...mockPendingNotifications,
    // Generate pending notifications for severe accidents without notification
    ...mockAccidents
      .filter(a => (a.severity === 'serious' || a.severity === 'fatal') && !a.inail_notification_number)
      .map(a => ({
        id: `auto-${a.id}`,
        accident_id: a.id,
        authority_type: 'inail' as const,
        deadline_date: new Date(new Date(a.created_at).getTime() + 24 * 60 * 60 * 1000).toISOString(),
        sent_date: null,
        protocol_number: null,
        status: 'da_inviare' as const,
      })),
  ];

  const pendingCount = allNotifications.filter(n => n.status === 'da_inviare').length;

  const handleCopyTemplate = (accidentId: string, authority: string) => {
    const template = generatePecTemplate(accidentId, authority);
    navigator.clipboard.writeText(template).then(() => {
      toast({ title: "Template copiato", description: "Testo PEC copiato negli appunti. Incolla nella tua casella PEC." });
    });
  };

  const handleMarkSent = (notifId: string) => {
    toast({ title: "Notifica marcata come inviata", description: "Ricorda di inserire il protocollo ricevuto." });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Notifiche Obbligatorie
          {pendingCount > 0 && <Badge variant="destructive">{pendingCount} da inviare</Badge>}
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          D.Lgs 81/2008: infortuni gravi → INAIL entro 24h, ASL entro 48h
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {allNotifications.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">Nessuna notifica obbligatoria pending</p>
        )}
        {allNotifications.map(notif => {
          const acc = mockAccidents.find(a => a.id === notif.accident_id);
          const style = statusStyles[notif.status];
          const remaining = hoursRemaining(notif.deadline_date);
          const isUrgent = notif.status === 'da_inviare' && remaining <= 12;

          return (
            <div
              key={notif.id}
              className={`p-3 rounded-lg border ${isUrgent ? 'border-destructive/50 bg-destructive/5' : 'border-border'}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={style.variant} className="text-[10px]">{style.label}</Badge>
                    <span className="text-xs font-mono uppercase text-muted-foreground">{notif.authority_type}</span>
                    {acc && <Badge variant="outline" className="text-[10px]">{severityLabels[acc.severity]}</Badge>}
                  </div>
                  <p className="text-sm mt-1">
                    Infortunio {acc?.accident_date} — {mockLavoratori.find(l => l.id === acc?.injured_worker_id)?.cognome || ''}
                  </p>
                  {notif.protocol_number && (
                    <p className="text-xs text-muted-foreground mt-0.5">Protocollo: {notif.protocol_number}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  {notif.status === 'da_inviare' && (
                    <div className={`flex items-center gap-1 text-xs ${isUrgent ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                      <Clock className="h-3 w-3" />
                      {remaining}h rimanenti
                    </div>
                  )}
                  {notif.status === 'inviata' && (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle2 className="h-3 w-3" /> {notif.sent_date}
                    </div>
                  )}
                </div>
              </div>
              {notif.status === 'da_inviare' && (
                <div className="flex gap-2 mt-3 pt-2 border-t border-dashed">
                  <Button size="sm" variant="outline" className="text-xs" onClick={() => handleCopyTemplate(notif.accident_id, notif.authority_type)}>
                    <Copy className="h-3 w-3 mr-1" /> Copia template PEC
                  </Button>
                  <Button size="sm" className="text-xs" onClick={() => handleMarkSent(notif.id)}>
                    <Send className="h-3 w-3 mr-1" /> Segna come inviata
                  </Button>
                </div>
              )}
              {isUrgent && (
                <div className="flex items-center gap-1 mt-2 text-xs text-destructive">
                  <AlertTriangle className="h-3 w-3" /> Scadenza imminente — inviare urgentemente
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
