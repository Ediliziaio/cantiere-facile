import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Send, Ban, CheckCircle2, Clock, XCircle, PenTool, Mail, Copy, Settings, Users, Eye, Award, Download, Loader2 } from "lucide-react";
import {
  mockDocumentiFirma, mockFirmatari, mockFirmaAuditLog,
  getStatoLabel, getTipoLabel, type StatoDocumentoFirma, type StatoFirmatario, type AzioneAudit
} from "@/data/mock-firma";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { downloadSignedPdf } from "@/lib/pdf-generator";

const statoColors: Record<StatoDocumentoFirma, string> = {
  bozza: "bg-muted text-muted-foreground",
  in_attesa: "bg-amber-100 text-amber-800",
  parzialmente_firmato: "bg-blue-100 text-blue-800",
  completato: "bg-emerald-100 text-emerald-800",
  rifiutato: "bg-red-100 text-red-800",
  scaduto: "bg-zinc-200 text-zinc-600",
};

const firmatarioStatoIcon: Record<StatoFirmatario, React.ReactNode> = {
  in_attesa: <Clock className="h-4 w-4 text-amber-500" />,
  firmato: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  rifiutato: <XCircle className="h-4 w-4 text-destructive" />,
  scaduto: <Clock className="h-4 w-4 text-muted-foreground" />,
};

const azioneLabels: Record<AzioneAudit, string> = {
  documento_creato: "Documento creato",
  documento_inviato: "Richieste inviate",
  link_aperto: "Link aperto",
  otp_richiesto: "OTP richiesto",
  otp_verificato: "OTP verificato",
  firmato: "Firmato",
  rifiutato: "Rifiutato",
  documento_completato: "Documento completato",
  reminder_inviato: "Reminder inviato",
};

const steps: { stato: StatoDocumentoFirma; label: string }[] = [
  { stato: "bozza", label: "Bozza" },
  { stato: "in_attesa", label: "In attesa" },
  { stato: "parzialmente_firmato", label: "Parz. firmato" },
  { stato: "completato", label: "Completato" },
];

function getStepIndex(stato: StatoDocumentoFirma) {
  if (stato === "rifiutato" || stato === "scaduto") return -1;
  return steps.findIndex(s => s.stato === stato);
}

export default function FirmaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [downloading, setDownloading] = useState(false);
  const doc = mockDocumentiFirma.find(d => d.id === id);

  const handleDownloadPdf = async () => {
    if (!id) return;
    setDownloading(true);
    try {
      await downloadSignedPdf(id);
      toast({ title: "PDF scaricato", description: "Il documento firmato è stato generato e scaricato" });
    } catch {
      toast({ title: "Errore", description: "Impossibile generare il PDF", variant: "destructive" });
    } finally {
      setDownloading(false);
    }
  };

  if (!doc) return <div className="p-8 text-center text-muted-foreground">Documento non trovato</div>;

  const signers = mockFirmatari.filter(f => f.documento_id === doc.id);
  const auditLogs = mockFirmaAuditLog.filter(l => l.documento_id === doc.id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const currentStep = getStepIndex(doc.stato);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/app/firma")}><ArrowLeft className="h-4 w-4" /></Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold truncate">{doc.nome}</h1>
          <p className="text-sm text-muted-foreground">{getTipoLabel(doc.tipo_documento)} · {doc.cantiere_nome}</p>
        </div>
        <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border ${statoColors[doc.stato]}`}>
          {getStatoLabel(doc.stato).label}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/app/firma/${id}/configura`}><Settings className="h-3.5 w-3.5 mr-1.5" /> Configura campi</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link to={`/app/firma/${id}/firmatari`}><Users className="h-3.5 w-3.5 mr-1.5" /> Gestisci firmatari</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link to={`/app/firma/${id}/anteprima`}><Eye className="h-3.5 w-3.5 mr-1.5" /> Anteprima</Link>
        </Button>
        {doc.stato === "completato" && (
          <>
            <Button variant="outline" size="sm" asChild>
              <Link to={`/app/firma/${id}/certificato`}><Award className="h-3.5 w-3.5 mr-1.5" /> Certificato</Link>
            </Button>
            <Button size="sm" onClick={handleDownloadPdf} disabled={downloading}>
              {downloading ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Download className="h-3.5 w-3.5 mr-1.5" />}
              Scarica PDF firmato
            </Button>
          </>
        )}
        {doc.stato !== "completato" && (
          <Button variant="outline" size="sm" onClick={handleDownloadPdf} disabled={downloading}>
            {downloading ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Download className="h-3.5 w-3.5 mr-1.5" />}
            Genera PDF anteprima
          </Button>
        )}
      </div>

      {/* Pipeline stepper */}
      {currentStep >= 0 && (
        <div className="flex items-center gap-1">
          {steps.map((step, i) => (
            <div key={step.stato} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold shrink-0 ${
                i <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>{i + 1}</div>
              <span className={`ml-1.5 text-xs font-medium hidden sm:inline ${i <= currentStep ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</span>
              {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < currentStep ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>
      )}

      {doc.stato === "rifiutato" && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="py-4">
            <p className="text-sm font-medium text-destructive">⚠️ Questo documento è stato rifiutato da uno o più firmatari.</p>
          </CardContent>
        </Card>
      )}

      {/* Signers */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><PenTool className="h-4 w-4" /> Firmatari ({signers.filter(s => s.stato === "firmato").length}/{signers.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="hidden sm:table-cell">Ruolo</TableHead>
                <TableHead>Metodo</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead className="hidden md:table-cell">Data firma</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {signers.map(s => (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="font-medium text-sm">{s.nome} {s.cognome}</div>
                    <div className="text-xs text-muted-foreground">{s.email}</div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{s.ruolo_descrizione}</TableCell>
                  <TableCell className="text-sm capitalize">{s.metodo_preferito}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {firmatarioStatoIcon[s.stato]}
                      <span className="text-xs capitalize">{s.stato.replace("_", " ")}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {s.data_firma ? format(new Date(s.data_firma), "dd/MM/yy HH:mm") : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {s.stato === "in_attesa" && (
                        <>
                          <Button variant="ghost" size="icon" title="Invia reminder"
                            onClick={() => toast({ title: "Reminder inviato", description: `Email inviata a ${s.email}` })}>
                            <Send className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Copia link firma"
                            onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/firma/${s.token_firma}`); toast({ title: "Link copiato" }); }}>
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Dettagli</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Creato da</span><span className="font-medium">{doc.creato_da}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Data creazione</span><span>{format(new Date(doc.data_creazione), "dd/MM/yyyy")}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Scadenza firma</span><span>{format(new Date(doc.data_scadenza_firma), "dd/MM/yyyy")}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Richiede tutti</span><span>{doc.richiede_tutti ? "Sì" : "No"}</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Descrizione</CardTitle></CardHeader>
          <CardContent><p className="text-sm">{doc.descrizione}</p></CardContent>
        </Card>
      </div>

      {/* Audit log */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Registro attività</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Azione</TableHead>
                <TableHead className="hidden sm:table-cell">Utente</TableHead>
                <TableHead className="hidden md:table-cell">IP</TableHead>
                <TableHead className="hidden lg:table-cell">Dettagli</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map(log => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(log.timestamp), "dd/MM/yy HH:mm")}
                  </TableCell>
                  <TableCell className="text-sm">{azioneLabels[log.azione]}</TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{log.firmatario_nome || "Sistema"}</TableCell>
                  <TableCell className="hidden md:table-cell text-xs font-mono text-muted-foreground">{log.ip_address || "—"}</TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{log.dettagli || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
