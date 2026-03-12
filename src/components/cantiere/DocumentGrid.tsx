import { useState } from "react";
import { LayoutGrid, List, Download, Trash2, CheckSquare, FileText, Image, File as FileIcon, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DocumentStatusBadge } from "./DocumentStatusBadge";
import { mockCantieri } from "@/data/mock-data";
import type { Documento, DocumentoStato, ProcessingStatus } from "@/data/mock-data";
import { toast } from "sonner";

type ViewMode = "grid" | "list";

interface Props {
  documents: Documento[];
  onViewDocument?: (doc: Documento) => void;
  onApproveSelected?: (ids: string[]) => void;
}

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  if (ext === "pdf") return FileText;
  if (["jpg", "jpeg", "png", "heic", "tiff", "tif"].includes(ext)) return Image;
  return FileIcon;
}

function getProcessingBadge(status: ProcessingStatus) {
  const map: Record<ProcessingStatus, { label: string; className: string }> = {
    uploaded: { label: "Caricato", className: "bg-muted text-muted-foreground" },
    processing: { label: "Elaborazione", className: "bg-primary/15 text-primary" },
    validated: { label: "Validato", className: "bg-warning/15 text-warning" },
    approved: { label: "Approvato", className: "bg-success/15 text-success" },
    archived: { label: "Archiviato", className: "bg-muted text-muted-foreground" },
  };
  const config = map[status];
  return <span className={cn("inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10px] font-medium uppercase", config.className)}>{config.label}</span>;
}

export function DocumentGrid({ documents, onViewDocument, onApproveSelected }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === documents.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(documents.map(d => d.id)));
    }
  };

  const handleBatchDownload = () => {
    toast.success(`Download di ${selected.size} file avviato`, { description: "Disponibile con backend connesso." });
  };

  const handleBatchDelete = () => {
    toast.success(`${selected.size} documenti eliminati`);
    setSelected(new Set());
  };

  const handleBatchApprove = () => {
    onApproveSelected?.(Array.from(selected));
    toast.success(`${selected.size} documenti approvati`);
    setSelected(new Set());
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <>
              <span className="text-sm text-muted-foreground">{selected.size} selezionati</span>
              <Button variant="outline" size="sm" onClick={handleBatchDownload} className="gap-1 text-xs">
                <Download className="h-3 w-3" /> Scarica
              </Button>
              <Button variant="outline" size="sm" onClick={handleBatchApprove} className="gap-1 text-xs">
                <CheckSquare className="h-3 w-3" /> Approva
              </Button>
              <Button variant="outline" size="sm" onClick={handleBatchDelete} className="gap-1 text-xs text-destructive hover:text-destructive">
                <Trash2 className="h-3 w-3" /> Elimina
              </Button>
            </>
          )}
        </div>
        <div className="flex gap-1">
          <Button variant={viewMode === "list" ? "default" : "outline"} size="icon" className="h-8 w-8" onClick={() => setViewMode("list")}>
            <List className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="icon" className="h-8 w-8" onClick={() => setViewMode("grid")}>
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {documents.length === 0 && (
        <p className="p-8 text-sm text-muted-foreground text-center">Nessun documento trovato.</p>
      )}

      {/* Grid view */}
      {viewMode === "grid" && documents.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {documents.map((doc) => {
            const Icon = getFileIcon(doc.nome_file);
            const isSelected = selected.has(doc.id);
            return (
              <div
                key={doc.id}
                className={cn(
                  "relative border rounded-lg p-3 cursor-pointer hover:border-primary/50 transition-colors",
                  isSelected ? "border-primary bg-primary/5" : "border-border"
                )}
                onClick={() => onViewDocument?.(doc)}
              >
                <div className="absolute top-2 left-2" onClick={(e) => { e.stopPropagation(); toggleSelect(doc.id); }}>
                  <Checkbox checked={isSelected} />
                </div>
                <div className="flex flex-col items-center pt-4 pb-2 gap-2">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    <Icon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-xs font-medium text-foreground text-center truncate w-full">{doc.nome_file}</p>
                  <p className="text-[10px] text-muted-foreground">{doc.categoria}</p>
                  <DocumentStatusBadge stato={doc.stato} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List view */}
      {viewMode === "list" && documents.length > 0 && (
        <div className="border border-border rounded-lg divide-y divide-border">
          {/* Header */}
          <div className="hidden sm:flex items-center px-4 py-2 bg-muted/30 text-xs font-medium text-muted-foreground">
            <div className="w-8" onClick={toggleAll}>
              <Checkbox checked={selected.size === documents.length && documents.length > 0} />
            </div>
            <div className="flex-1">Nome</div>
            <div className="w-28">Categoria</div>
            <div className="w-28">Cantiere</div>
            <div className="w-24">Scadenza</div>
            <div className="w-20">Dim.</div>
            <div className="w-20">Stato</div>
            <div className="w-20">Workflow</div>
            <div className="w-10"></div>
          </div>

          {documents.map((doc) => {
            const cantiere = mockCantieri.find(c => c.id === doc.cantiere_id);
            const isSelected = selected.has(doc.id);
            return (
              <div
                key={doc.id}
                className={cn(
                  "flex items-center px-4 py-2.5 cursor-pointer hover:bg-muted/30 transition-colors",
                  isSelected && "bg-primary/5"
                )}
                onClick={() => onViewDocument?.(doc)}
              >
                <div className="w-8 shrink-0" onClick={(e) => { e.stopPropagation(); toggleSelect(doc.id); }}>
                  <Checkbox checked={isSelected} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{doc.nome_file}</p>
                  <p className="text-xs text-muted-foreground sm:hidden">
                    {doc.categoria} · {cantiere?.nome} · {doc.file_size_kb} KB
                  </p>
                </div>
                <div className="w-28 hidden sm:block text-xs text-muted-foreground truncate">{doc.categoria}</div>
                <div className="w-28 hidden sm:block text-xs text-muted-foreground truncate">{cantiere?.nome}</div>
                <div className="w-24 hidden sm:block text-xs text-muted-foreground">
                  {doc.data_scadenza ? new Date(doc.data_scadenza).toLocaleDateString("it-IT") : "—"}
                </div>
                <div className="w-20 hidden sm:block text-xs text-muted-foreground">{doc.file_size_kb} KB</div>
                <div className="w-20 shrink-0 hidden sm:block">
                  <DocumentStatusBadge stato={doc.stato} />
                </div>
                <div className="w-20 shrink-0 hidden sm:block">
                  {getProcessingBadge(doc.processing_status)}
                </div>
                <div className="w-10 shrink-0 flex justify-end sm:hidden">
                  <DocumentStatusBadge stato={doc.stato} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
