import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PenTool, Plus, Clock, CheckCircle2, AlertTriangle, FileX2, Eye, LayoutTemplate } from "lucide-react";
import { mockDocumentiFirma, mockFirmatari, getStatoLabel, getTipoLabel, type StatoDocumentoFirma } from "@/data/mock-firma";
import { format } from "date-fns";
import { it } from "date-fns/locale";

const statoColors: Record<StatoDocumentoFirma, string> = {
  bozza: "bg-muted text-muted-foreground",
  in_attesa: "bg-amber-100 text-amber-800 border-amber-200",
  parzialmente_firmato: "bg-blue-100 text-blue-800 border-blue-200",
  completato: "bg-emerald-100 text-emerald-800 border-emerald-200",
  rifiutato: "bg-red-100 text-red-800 border-red-200",
  scaduto: "bg-zinc-200 text-zinc-600",
};

export default function FirmaDashboard() {
  const [filtroStato, setFiltroStato] = useState<string>("tutti");
  const [filtroTipo, setFiltroTipo] = useState<string>("tutti");

  const inAttesa = mockDocumentiFirma.filter(d => d.stato === "in_attesa" || d.stato === "parzialmente_firmato").length;
  const completati = mockDocumentiFirma.filter(d => d.stato === "completato").length;
  const scadono = mockDocumentiFirma.filter(d => {
    const scad = new Date(d.data_scadenza_firma);
    const oggi = new Date();
    const diff = (scad.getTime() - oggi.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 1 && diff >= 0 && d.stato !== "completato";
  }).length;
  const rifiutati = mockDocumentiFirma.filter(d => d.stato === "rifiutato").length;

  const filtered = mockDocumentiFirma.filter(d => {
    if (filtroStato !== "tutti" && d.stato !== filtroStato) return false;
    if (filtroTipo !== "tutti" && d.tipo_documento !== filtroTipo) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <PenTool className="h-5 sm:h-6 w-5 sm:w-6 text-primary" />
            Firma Digitale
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Gestisci i documenti da firmare digitalmente</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="w-full sm:w-auto" asChild>
            <Link to="/app/firma/templates"><LayoutTemplate className="h-4 w-4 mr-1" /> Template</Link>
          </Button>
          <Button className="w-full sm:w-auto" asChild>
            <Link to="/app/firma/nuovo"><Plus className="h-4 w-4 mr-1" /> Nuovo documento</Link>
          </Button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">In attesa</CardTitle></CardHeader>
          <CardContent><div className="flex items-center gap-2"><Clock className="h-5 w-5 text-amber-500" /><span className="text-2xl font-bold">{inAttesa}</span></div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Firmati questo mese</CardTitle></CardHeader>
          <CardContent><div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-500" /><span className="text-2xl font-bold">{completati}</span></div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Scadono oggi</CardTitle></CardHeader>
          <CardContent><div className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-orange-500" /><span className="text-2xl font-bold">{scadono}</span></div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Rifiutati</CardTitle></CardHeader>
          <CardContent><div className="flex items-center gap-2"><FileX2 className="h-5 w-5 text-destructive" /><span className="text-2xl font-bold">{rifiutati}</span></div></CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={filtroStato} onValueChange={setFiltroStato}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Stato" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="tutti">Tutti gli stati</SelectItem>
            <SelectItem value="bozza">Bozza</SelectItem>
            <SelectItem value="in_attesa">In attesa</SelectItem>
            <SelectItem value="parzialmente_firmato">Parz. firmato</SelectItem>
            <SelectItem value="completato">Completato</SelectItem>
            <SelectItem value="rifiutato">Rifiutato</SelectItem>
            <SelectItem value="scaduto">Scaduto</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filtroTipo} onValueChange={setFiltroTipo}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Tipo" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="tutti">Tutti i tipi</SelectItem>
            <SelectItem value="collaudo">Collaudo</SelectItem>
            <SelectItem value="verbale">Verbale</SelectItem>
            <SelectItem value="autorizzazione">Autorizzazione</SelectItem>
            <SelectItem value="modulo_sicurezza">Modulo Sicurezza</SelectItem>
            <SelectItem value="altro">Altro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Documento</TableHead>
                <TableHead className="hidden md:table-cell">Tipo</TableHead>
                <TableHead className="hidden lg:table-cell">Cantiere</TableHead>
                <TableHead>Firmatari</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead className="hidden md:table-cell">Scadenza</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(doc => {
                const signers = mockFirmatari.filter(f => f.documento_id === doc.id);
                const signed = signers.filter(f => f.stato === "firmato").length;
                const stato = getStatoLabel(doc.stato);
                return (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="font-medium text-sm">{doc.nome}</div>
                      <div className="text-xs text-muted-foreground md:hidden">{getTipoLabel(doc.tipo_documento)}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{getTipoLabel(doc.tipo_documento)}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{doc.cantiere_nome}</TableCell>
                    <TableCell className="text-sm">{signed}/{signers.length}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border ${statoColors[doc.stato]}`}>
                        {stato.label}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {format(new Date(doc.data_scadenza_firma), "dd MMM yyyy", { locale: it })}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/app/firma/${doc.id}`}><Eye className="h-4 w-4" /></Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Nessun documento trovato</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
