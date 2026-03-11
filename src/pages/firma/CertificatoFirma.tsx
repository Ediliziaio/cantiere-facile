import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, CheckCircle2 } from "lucide-react";
import { mockDocumentiFirma, mockFirmatari } from "@/data/mock-firma";
import { format } from "date-fns";
import { QRCodeSVG } from "qrcode.react";

interface CertificatoFirmaProps {
  documentoId?: string;
}

export default function CertificatoFirma({ documentoId }: CertificatoFirmaProps) {
  const params = useParams();
  const id = documentoId || params.id;
  const doc = mockDocumentiFirma.find(d => d.id === id);
  const signers = mockFirmatari.filter(f => f.documento_id === id && f.stato === "firmato");

  if (!doc) return <div className="p-8 text-center text-muted-foreground">Documento non trovato</div>;

  const mockHash = "a3f9c2e1b4d7890abcdef1234567890abcdef1234567890abcdef1234567890a";
  const verifyUrl = `${window.location.origin}/verifica/${mockHash}`;

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-2 shadow-lg">
        <CardContent className="p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2 border-b pb-6">
            <div className="flex items-center justify-center gap-2">
              <Shield className="h-7 w-7 text-primary" />
              <span className="text-lg font-bold tracking-wide">Cantiere in Cloud</span>
            </div>
            <h1 className="text-xl font-bold tracking-wide text-foreground">
              CERTIFICATO DI FIRMA DIGITALE
            </h1>
          </div>

          {/* Document info */}
          <div className="space-y-3 border-b pb-6">
            <div className="grid grid-cols-[140px_1fr] gap-y-2 text-sm">
              <span className="text-muted-foreground font-medium">Documento:</span>
              <span className="font-semibold">{doc.nome}</span>
              <span className="text-muted-foreground font-medium">Cantiere:</span>
              <span>{doc.cantiere_nome}</span>
              <span className="text-muted-foreground font-medium">Data creazione:</span>
              <span>{format(new Date(doc.data_creazione), "dd/MM/yyyy")}</span>
              <span className="text-muted-foreground font-medium">Hash SHA-256:</span>
              <span className="font-mono text-xs break-all">{mockHash}</span>
            </div>
          </div>

          {/* Signers table */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              FIRMATARI
            </h2>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs font-semibold">Nome</TableHead>
                    <TableHead className="text-xs font-semibold">Ruolo</TableHead>
                    <TableHead className="text-xs font-semibold">Metodo</TableHead>
                    <TableHead className="text-xs font-semibold">Timestamp</TableHead>
                    <TableHead className="text-xs font-semibold">IP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {signers.map(s => (
                    <TableRow key={s.id}>
                      <TableCell className="text-sm font-medium">{s.nome} {s.cognome}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{s.ruolo_descrizione}</TableCell>
                      <TableCell className="text-xs capitalize">{s.metodo_preferito === "disegno" ? "Disegno" : "OTP"}</TableCell>
                      <TableCell className="text-xs font-mono">
                        {s.data_firma ? format(new Date(s.data_firma), "dd/MM/yy HH:mm") : "—"}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">{s.ip_address || "—"}</TableCell>
                    </TableRow>
                  ))}
                  {signers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-4">
                        Nessuna firma registrata
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* QR + verification */}
          <div className="flex items-center gap-6 border-t pt-6">
            <div className="shrink-0">
              <QRCodeSVG value={verifyUrl} size={96} level="M" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Verifica autenticità</p>
              <p className="text-xs text-muted-foreground">
                Scansiona il QR code o visita:
              </p>
              <p className="text-xs font-mono text-primary break-all">
                {verifyUrl}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center border-t pt-4">
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Documento generato da Cantiere in Cloud — cantiereincloud.it<br />
              Firma digitale ai sensi del D.Lgs. 82/2005 (Codice dell'Amministrazione Digitale)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}