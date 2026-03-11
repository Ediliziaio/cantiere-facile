import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockDocumenti, mockCantieri } from "@/data/mock-data";
import { DocumentStatusBadge } from "@/components/cantiere/DocumentStatusBadge";
import { DocumentUploadZone } from "@/components/cantiere/DocumentUploadZone";
import { DocumentActions } from "@/components/cantiere/DocumentActions";
import { toast } from "sonner";
import type { DocumentoStato } from "@/data/mock-data";

export default function Documenti() {
  const [showUpload, setShowUpload] = useState(false);
  const [search, setSearch] = useState("");
  const [statoFilter, setStatoFilter] = useState<string>("tutti");

  const filtered = mockDocumenti.filter((d) => {
    const matchSearch = d.nome_file.toLowerCase().includes(search.toLowerCase()) || d.categoria.toLowerCase().includes(search.toLowerCase());
    const matchStato = statoFilter === "tutti" || d.stato === statoFilter;
    return matchSearch && matchStato;
  });

  const stati = ["tutti", "valido", "in_scadenza", "scaduto", "da_verificare"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading font-bold text-2xl text-foreground">Documenti</h1>
        <Button size="sm" onClick={() => setShowUpload(!showUpload)}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Carica documento
        </Button>
      </div>

      {showUpload && (
        <DocumentUploadZone
          onUpload={(file, categoria, dataScadenza) => {
            toast.success(`"${file.name}" caricato come ${categoria}`);
            setShowUpload(false);
          }}
        />
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cerca documento..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-1">
          {stati.map((s) => (
            <Button key={s} variant={statoFilter === s ? "default" : "outline"} size="sm" onClick={() => setStatoFilter(s)} className="text-xs capitalize">
              {s === "tutti" ? "Tutti" : s.replace("_", " ")}
            </Button>
          ))}
        </div>
      </div>

      <div className="border border-border rounded-lg divide-y divide-border">
        {filtered.length === 0 && <p className="p-6 text-sm text-muted-foreground text-center">Nessun documento trovato.</p>}
        {filtered.map((d) => {
          const cantiere = mockCantieri.find((c) => c.id === d.cantiere_id);
          return (
            <div key={d.id} className="flex items-center justify-between px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{d.nome_file}</p>
                <p className="text-xs text-muted-foreground">
                  {d.categoria} · {cantiere?.nome} · {d.data_scadenza ? new Date(d.data_scadenza).toLocaleDateString("it-IT") : "—"}
                </p>
              </div>
              <DocumentStatusBadge stato={d.stato as DocumentoStato} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
