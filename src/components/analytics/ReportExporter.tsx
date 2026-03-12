import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { mockCantieri } from "@/data/mock-data";
import { getSnapshotsByRange, mockBudgets } from "@/data/mock-analytics";
import { toast } from "sonner";

export function ReportExporter() {
  const [period, setPeriod] = useState("30");
  const [selectedSites, setSelectedSites] = useState<string[]>(mockCantieri.map(c => c.id));
  const [sections, setSections] = useState({ presenze: true, costi: true, sicurezza: true, documenti: true });

  const toggleSite = (id: string) => {
    setSelectedSites(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const toggleSection = (key: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const exportCSV = () => {
    const snapshots = getSnapshotsByRange(Number(period));
    const filtered = snapshots.filter(s => selectedSites.includes(s.site_id));

    const headers = ['Data', 'Cantiere', 'Operai', 'Ore', 'Costo Manodopera', 'Costo Materiali', 'Safety Score'];
    const rows = filtered.map(s => {
      const site = mockCantieri.find(c => c.id === s.site_id);
      return [s.date, site?.nome || s.site_id, s.workers_count, s.hours_total, s.costs_labor, s.costs_materials, s.safety_score].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `report_analytics_${period}gg.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Report CSV scaricato');
  };

  const exportPDF = async () => {
    const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const page = pdfDoc.addPage([595, 842]);
    let y = 800;

    page.drawText('Report Analytics — Cantiere in Cloud', { x: 50, y, font: fontBold, size: 16, color: rgb(0.15, 0.15, 0.15) });
    y -= 25;
    page.drawText(`Periodo: ultimi ${period} giorni`, { x: 50, y, font, size: 10, color: rgb(0.4, 0.4, 0.4) });
    y -= 30;

    for (const siteId of selectedSites) {
      const site = mockCantieri.find(c => c.id === siteId);
      if (!site) continue;

      page.drawText(site.nome, { x: 50, y, font: fontBold, size: 12 });
      y -= 18;

      const snapshots = getSnapshotsByRange(Number(period), siteId);
      const totalWorkers = snapshots.reduce((s, snap) => s + snap.workers_count, 0);
      const totalHours = snapshots.reduce((s, snap) => s + snap.hours_total, 0);
      const totalCost = snapshots.reduce((s, snap) => s + snap.costs_labor + snap.costs_materials, 0);
      const avgSafety = snapshots.length > 0 ? Math.round(snapshots.reduce((s, snap) => s + snap.safety_score, 0) / snapshots.length) : 0;

      if (sections.presenze) {
        page.drawText(`Presenze totali: ${totalWorkers} gg/operaio — Ore totali: ${totalHours}`, { x: 60, y, font, size: 9 });
        y -= 14;
      }
      if (sections.costi) {
        page.drawText(`Costo totale: EUR ${totalCost.toLocaleString('it-IT')}`, { x: 60, y, font, size: 9 });
        y -= 14;
      }
      if (sections.sicurezza) {
        page.drawText(`Safety score medio: ${avgSafety}/100`, { x: 60, y, font, size: 9 });
        y -= 14;
      }

      const budget = mockBudgets.find(b => b.site_id === siteId);
      if (budget && sections.costi) {
        const totalBudget = budget.items.reduce((s, i) => s + i.budget, 0);
        const totalConsuntivo = budget.items.reduce((s, i) => s + i.consuntivo, 0);
        page.drawText(`Budget: EUR ${totalBudget.toLocaleString('it-IT')} — Consuntivo: EUR ${totalConsuntivo.toLocaleString('it-IT')}`, { x: 60, y, font, size: 9 });
        y -= 14;
      }

      y -= 10;
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `report_analytics_${period}gg.pdf`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Report PDF scaricato');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Configurazione Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs">Periodo</Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Ultimi 7 giorni</SelectItem>
                <SelectItem value="30">Ultimi 30 giorni</SelectItem>
                <SelectItem value="90">Ultimi 90 giorni</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs mb-2 block">Cantieri</Label>
            {mockCantieri.map(c => (
              <label key={c.id} className="flex items-center gap-2 py-1 cursor-pointer">
                <Checkbox checked={selectedSites.includes(c.id)} onCheckedChange={() => toggleSite(c.id)} />
                <span className="text-sm">{c.nome}</span>
              </label>
            ))}
          </div>

          <div>
            <Label className="text-xs mb-2 block">Sezioni</Label>
            {(Object.keys(sections) as (keyof typeof sections)[]).map(key => (
              <label key={key} className="flex items-center gap-2 py-1 cursor-pointer">
                <Checkbox checked={sections[key]} onCheckedChange={() => toggleSection(key)} />
                <span className="text-sm capitalize">{key}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Esporta Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Seleziona il formato desiderato per scaricare il report con i dati configurati.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={exportCSV}>
              <FileSpreadsheet className="h-8 w-8 text-emerald-600" />
              <span className="font-medium">Scarica CSV</span>
              <span className="text-xs text-muted-foreground">Per analisi in Excel</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={exportPDF}>
              <FileText className="h-8 w-8 text-red-600" />
              <span className="font-medium">Scarica PDF</span>
              <span className="text-xs text-muted-foreground">Per stampa e condivisione</span>
            </Button>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4">
            <h4 className="text-sm font-medium mb-2">Anteprima dati</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>📊 Periodo: ultimi {period} giorni</p>
              <p>🏗️ Cantieri: {selectedSites.length} selezionati</p>
              <p>📋 Sezioni: {Object.entries(sections).filter(([, v]) => v).map(([k]) => k).join(', ')}</p>
              {selectedSites.map(siteId => {
                const snapshots = getSnapshotsByRange(Number(period), siteId);
                const site = mockCantieri.find(c => c.id === siteId);
                const total = snapshots.reduce((s, snap) => s + snap.costs_labor + snap.costs_materials, 0);
                return (
                  <p key={siteId}>
                    → {site?.nome}: {snapshots.length} record, €{total.toLocaleString('it-IT')} totale
                  </p>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
