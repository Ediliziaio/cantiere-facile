import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { mockCantieri } from "@/data/mock-data";
import type { ProcessingStatus } from "@/data/mock-data";

export interface DocumentFilterState {
  search: string;
  stato: string;
  cantiere: string;
  categoria: string;
  processingStatus: string;
  riferimentoTipo: string;
}

const defaultFilters: DocumentFilterState = {
  search: "",
  stato: "tutti",
  cantiere: "tutti",
  categoria: "tutti",
  processingStatus: "tutti",
  riferimentoTipo: "tutti",
};

const stati = ["tutti", "valido", "in_scadenza", "scaduto", "da_verificare"];
const processingStati: { value: string; label: string }[] = [
  { value: "tutti", label: "Tutti" },
  { value: "uploaded", label: "Caricato" },
  { value: "processing", label: "In elaborazione" },
  { value: "validated", label: "Validato" },
  { value: "approved", label: "Approvato" },
  { value: "archived", label: "Archiviato" },
];
const categorie = [
  "tutti", "DURC", "Visura Camerale", "POS", "PSC", "Attestato Sicurezza",
  "Idoneità Sanitaria", "Polizza RC", "Libretto", "Collaudo", "Assicurazione", "DVR", "Altro",
];
const riferimenti = [
  { value: "tutti", label: "Tutti" },
  { value: "lavoratore", label: "Lavoratore" },
  { value: "mezzo", label: "Mezzo" },
  { value: "subappaltatore", label: "Subappaltatore" },
];

interface Props {
  filters: DocumentFilterState;
  onChange: (filters: DocumentFilterState) => void;
  resultCount: number;
}

export function DocumentFilters({ filters, onChange, resultCount }: Props) {
  const [open, setOpen] = useState(false);

  const update = (partial: Partial<DocumentFilterState>) => {
    onChange({ ...filters, ...partial });
  };

  const hasActiveFilters = filters.cantiere !== "tutti" || filters.categoria !== "tutti" || filters.processingStatus !== "tutti" || filters.riferimentoTipo !== "tutti";

  const resetFilters = () => onChange(defaultFilters);

  return (
    <div className="space-y-3">
      {/* Search + status quick filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca documento..."
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            className="pl-9"
          />
        </div>
        <div className="overflow-x-auto scrollbar-hide -mx-1 px-1">
          <div className="flex gap-1 w-max">
            {stati.map((s) => (
              <Button
                key={s}
                variant={filters.stato === s ? "default" : "outline"}
                size="sm"
                onClick={() => update({ stato: s })}
                className="text-xs capitalize whitespace-nowrap"
              >
                {s === "tutti" ? "Tutti" : s.replace("_", " ")}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced filters collapsible */}
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="flex items-center justify-between">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
              <Filter className="h-3.5 w-3.5" />
              Filtri avanzati
              {hasActiveFilters && (
                <span className="bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-[10px] font-bold">!</span>
              )}
            </Button>
          </CollapsibleTrigger>
          <span className="text-xs text-muted-foreground">{resultCount} documenti</span>
        </div>

        <CollapsibleContent className="mt-2">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 p-3 rounded-lg border border-border bg-muted/30">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Cantiere</label>
              <Select value={filters.cantiere} onValueChange={(v) => update({ cantiere: v })}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tutti">Tutti i cantieri</SelectItem>
                  {mockCantieri.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Categoria</label>
              <Select value={filters.categoria} onValueChange={(v) => update({ categoria: v })}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categorie.map((c) => (
                    <SelectItem key={c} value={c}>{c === "tutti" ? "Tutte" : c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Stato workflow</label>
              <Select value={filters.processingStatus} onValueChange={(v) => update({ processingStatus: v })}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {processingStati.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Riferimento</label>
              <Select value={filters.riferimentoTipo} onValueChange={(v) => update({ riferimentoTipo: v })}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {riferimenti.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs gap-1 self-end">
                <X className="h-3 w-3" /> Azzera filtri
              </Button>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export { defaultFilters };
