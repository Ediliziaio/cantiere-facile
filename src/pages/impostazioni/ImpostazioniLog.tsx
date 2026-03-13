import { useMemo, useState } from "react";
import { Activity, LogIn, PenLine, Upload, PlusCircle, XCircle, UserPlus } from "lucide-react";
import { mockLogAttivita, mockUtentiAzienda, type LogTipoAzione } from "@/data/mock-data";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";

const logIconMap: Record<LogTipoAzione, typeof LogIn> = {
  login: LogIn, modifica: PenLine, upload: Upload,
  creazione: PlusCircle, eliminazione: XCircle, invito: UserPlus,
};
const logColorMap: Record<LogTipoAzione, string> = {
  login: "text-blue-600 bg-blue-500/10", modifica: "text-amber-600 bg-amber-500/10",
  upload: "text-green-600 bg-green-500/10", creazione: "text-primary bg-primary/10",
  eliminazione: "text-destructive bg-destructive/10", invito: "text-violet-600 bg-violet-500/10",
};
const logLabelMap: Record<LogTipoAzione, string> = {
  login: "Login", modifica: "Modifica", upload: "Upload",
  creazione: "Creazione", eliminazione: "Eliminazione", invito: "Invito",
};

export default function ImpostazioniLog() {
  const [logFilterTipo, setLogFilterTipo] = useState<LogTipoAzione | "tutti">("tutti");
  const [logFilterUtente, setLogFilterUtente] = useState<string>("tutti");

  const filteredLog = useMemo(() => {
    return mockLogAttivita
      .filter(l => logFilterTipo === "tutti" || l.tipo === logFilterTipo)
      .filter(l => logFilterUtente === "tutti" || l.utente_id === logFilterUtente)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [logFilterTipo, logFilterUtente]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Activity className="h-5 w-5 text-primary" />
        <h1 className="font-heading font-bold text-xl text-foreground">Log Attività</h1>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">Registro di login, modifiche, upload e altre azioni</p>
        <div className="flex items-center gap-2">
          <Select value={logFilterTipo} onValueChange={v => setLogFilterTipo(v as LogTipoAzione | "tutti")}>
            <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue placeholder="Tipo azione" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="tutti">Tutte le azioni</SelectItem>
              <SelectItem value="login">Login</SelectItem>
              <SelectItem value="modifica">Modifiche</SelectItem>
              <SelectItem value="upload">Upload</SelectItem>
              <SelectItem value="creazione">Creazioni</SelectItem>
              <SelectItem value="eliminazione">Eliminazioni</SelectItem>
              <SelectItem value="invito">Inviti</SelectItem>
            </SelectContent>
          </Select>
          <Select value={logFilterUtente} onValueChange={setLogFilterUtente}>
            <SelectTrigger className="w-[160px] h-8 text-xs"><SelectValue placeholder="Utente" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="tutti">Tutti gli utenti</SelectItem>
              {mockUtentiAzienda.map(u => (
                <SelectItem key={u.id} value={u.id}>{u.nome} {u.cognome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="h-[500px]">
        <div className="space-y-1">
          {filteredLog.map(log => {
            const Icon = logIconMap[log.tipo as LogTipoAzione];
            const colorCls = logColorMap[log.tipo as LogTipoAzione];
            return (
              <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${colorCls}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-foreground">{log.utente_nome}</span>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">{logLabelMap[log.tipo as LogTipoAzione]}</Badge>
                  </div>
                  <p className="text-sm text-foreground mt-0.5">{log.descrizione}</p>
                  {log.dettaglio && <p className="text-xs text-muted-foreground mt-0.5">{log.dettaglio}</p>}
                </div>
                <span className="text-[11px] text-muted-foreground whitespace-nowrap shrink-0">
                  {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true, locale: it })}
                </span>
              </div>
            );
          })}
          {filteredLog.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">Nessuna attività trovata</div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
