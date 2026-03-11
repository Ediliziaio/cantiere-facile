import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { mockDiarioCantiere, mockFileCantiere, type MeteoCondizione } from "@/data/mock-data";
import { Plus, Sun, Cloud, CloudRain, Snowflake, Wind, CalendarIcon, Clock, Users, AlertTriangle, Image } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { cn } from "@/lib/utils";

const meteoConfig: Record<MeteoCondizione, { icon: typeof Sun; label: string; color: string }> = {
  sereno: { icon: Sun, label: "Sereno", color: "text-yellow-500" },
  nuvoloso: { icon: Cloud, label: "Nuvoloso", color: "text-muted-foreground" },
  pioggia: { icon: CloudRain, label: "Pioggia", color: "text-blue-500" },
  neve: { icon: Snowflake, label: "Neve", color: "text-sky-300" },
  vento: { icon: Wind, label: "Vento", color: "text-teal-500" },
};

interface DiarioCantiereProps {
  cantiereId: string;
}

export function DiarioCantiere({ cantiereId }: DiarioCantiereProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [meseFilter, setMeseFilter] = useState<string>("tutti");
  const [formDate, setFormDate] = useState<Date>();

  const voci = mockDiarioCantiere
    .filter((v) => v.cantiere_id === cantiereId)
    .sort((a, b) => b.data.localeCompare(a.data));

  const mesiDisponibili = [...new Set(voci.map((v) => v.data.slice(0, 7)))].sort().reverse();

  const vociFiltrate = meseFilter === "tutti" ? voci : voci.filter((v) => v.data.startsWith(meseFilter));

  const fotoMap = Object.fromEntries(mockFileCantiere.map((f) => [f.id, f]));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Select value={meseFilter} onValueChange={setMeseFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtra per mese" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tutti">Tutti i mesi</SelectItem>
            {mesiDisponibili.map((m) => (
              <SelectItem key={m} value={m}>
                {format(new Date(m + "-01"), "MMMM yyyy", { locale: it })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Nuova voce
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nuova voce diario</DialogTitle>
              <DialogDescription>Registra le attività, il meteo e gli eventuali problemi della giornata.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Data</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formDate && "text-muted-foreground")}>
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {formDate ? format(formDate, "dd/MM/yyyy") : "Seleziona"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={formDate} onSelect={setFormDate} className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1.5">
                  <Label>Meteo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Condizioni" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(meteoConfig).map(([key, cfg]) => {
                        const Icon = cfg.icon;
                        return (
                          <SelectItem key={key} value={key}>
                            <span className="flex items-center gap-2">
                              <Icon className={cn("h-4 w-4", cfg.color)} />
                              {cfg.label}
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label>Temperatura (°C)</Label>
                  <Input type="number" placeholder="es. 14" />
                </div>
                <div className="space-y-1.5">
                  <Label>Ore lavorate</Label>
                  <Input type="number" placeholder="es. 8" />
                </div>
                <div className="space-y-1.5">
                  <Label>Operai presenti</Label>
                  <Input type="number" placeholder="es. 12" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Attività svolte *</Label>
                <Textarea placeholder="Descrivi le attività della giornata..." rows={3} />
              </div>
              <div className="space-y-1.5">
                <Label>Problemi riscontrati</Label>
                <Textarea placeholder="Eventuali problemi o criticità..." rows={2} />
              </div>
              <div className="space-y-1.5">
                <Label>Note</Label>
                <Textarea placeholder="Note aggiuntive..." rows={2} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Annulla</Button>
              <Button onClick={() => setDialogOpen(false)}>Salva voce</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {vociFiltrate.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">Nessuna voce nel diario per questo periodo.</p>
      )}

      <div className="space-y-3">
        {vociFiltrate.map((voce) => {
          const meteo = meteoConfig[voce.meteo];
          const MeteoIcon = meteo.icon;
          const fotoCollegate = voce.foto_ids.map((id) => fotoMap[id]).filter(Boolean);

          return (
            <Card key={voce.id}>
              <CardContent className="p-4 space-y-3">
                {/* Header: data + meteo + stats */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="text-center min-w-[48px]">
                      <p className="text-2xl font-bold text-foreground leading-none">
                        {format(new Date(voce.data), "dd")}
                      </p>
                      <p className="text-xs text-muted-foreground uppercase">
                        {format(new Date(voce.data), "MMM", { locale: it })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MeteoIcon className={cn("h-5 w-5", meteo.color)} />
                      <span className="text-sm text-muted-foreground">{meteo.label}, {voce.temperatura}°C</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {voce.ore_lavorate}h
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {voce.operai_presenti}
                    </span>
                  </div>
                </div>

                {/* Attività */}
                <p className="text-sm text-foreground">{voce.attivita}</p>

                {/* Problemi */}
                {voce.problemi && (
                  <div className="flex items-start gap-2 bg-destructive/10 text-destructive rounded-md px-3 py-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                    <p className="text-sm">{voce.problemi}</p>
                  </div>
                )}

                {/* Note */}
                {voce.note && (
                  <p className="text-xs text-muted-foreground italic">{voce.note}</p>
                )}

                {/* Foto collegate */}
                {fotoCollegate.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Image className="h-3.5 w-3.5 text-muted-foreground" />
                    <div className="flex gap-1.5">
                      {fotoCollegate.map((foto) => (
                        <div key={foto.id} className="h-10 w-10 rounded border border-border overflow-hidden bg-muted">
                          <img src={foto.thumbnail_url || foto.url} alt={foto.descrizione} className="h-full w-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{fotoCollegate.length} foto</span>
                  </div>
                )}

                {/* Footer */}
                <p className="text-[11px] text-muted-foreground">
                  Compilato da {voce.compilato_da}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}