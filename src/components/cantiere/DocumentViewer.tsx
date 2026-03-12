import { useState } from "react";
import { X, Download, ZoomIn, ZoomOut, RotateCw, CheckCircle2, FileText, Clock, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DocumentStatusBadge } from "./DocumentStatusBadge";
import { mockDocumentAuditLogs } from "@/data/mock-data";
import type { Documento, ProcessingStatus } from "@/data/mock-data";
import { toast } from "sonner";

interface Props {
  document: Documento | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove?: (id: string) => void;
}

function getProcessingLabel(status: ProcessingStatus): string {
  const map: Record<ProcessingStatus, string> = {
    uploaded: "Caricato",
    processing: "In elaborazione",
    validated: "Validato",
    approved: "Approvato",
    archived: "Archiviato",
  };
  return map[status];
}

export function DocumentViewer({ document: doc, open, onOpenChange, onApprove }: Props) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  if (!doc) return null;

  const isImage = ["jpg", "jpeg", "png", "heic", "tiff", "tif"].includes(
    doc.nome_file.split(".").pop()?.toLowerCase() || ""
  );
  const isPdf = doc.nome_file.toLowerCase().endsWith(".pdf");

  const auditLogs = mockDocumentAuditLogs.filter(l => l.documento_id === doc.id);

  const handleDownload = () => {
    toast.success(`Download "${doc.nome_file}" avviato`, {
      description: "Disponibile con backend connesso.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4 shrink-0" />
            <span className="truncate">{doc.nome_file}</span>
            <DocumentStatusBadge stato={doc.stato} />
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="preview" className="flex-1 min-h-0 flex flex-col">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="preview" className="gap-1 text-xs">
              <Eye className="h-3 w-3" /> Anteprima
            </TabsTrigger>
            <TabsTrigger value="metadata" className="gap-1 text-xs">
              <FileText className="h-3 w-3" /> Dettagli
            </TabsTrigger>
            {doc.extracted_fields && (
              <TabsTrigger value="extracted" className="gap-1 text-xs">
                <ZoomIn className="h-3 w-3" /> Dati Estratti
              </TabsTrigger>
            )}
            <TabsTrigger value="audit" className="gap-1 text-xs">
              <Clock className="h-3 w-3" /> Cronologia
            </TabsTrigger>
          </TabsList>

          {/* Preview */}
          <TabsContent value="preview" className="flex-1 min-h-0">
            <div className="flex items-center gap-2 mb-2">
              {isImage && (
                <>
                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setZoom(z => Math.min(z + 25, 200))}>
                    <ZoomIn className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setZoom(z => Math.max(z - 25, 50))}>
                    <ZoomOut className="h-3 w-3" />
                  </Button>
                  <span className="text-xs text-muted-foreground">{zoom}%</span>
                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setRotation(r => (r + 90) % 360)}>
                    <RotateCw className="h-3 w-3" />
                  </Button>
                </>
              )}
              <div className="flex-1" />
              <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={handleDownload}>
                <Download className="h-3 w-3" /> Scarica
              </Button>
              {doc.processing_status === "validated" && onApprove && (
                <Button size="sm" className="gap-1 text-xs" onClick={() => onApprove(doc.id)}>
                  <CheckCircle2 className="h-3 w-3" /> Approva
                </Button>
              )}
            </div>
            <div className="rounded-lg border border-border bg-muted/30 flex items-center justify-center min-h-[300px] overflow-auto">
              {isPdf ? (
                <div className="flex flex-col items-center gap-3 py-12">
                  <FileText className="h-16 w-16 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">Anteprima PDF — Connetti backend per visualizzazione</p>
                  <Button size="sm" variant="outline" onClick={handleDownload}>
                    <Download className="h-3.5 w-3.5 mr-1" /> Scarica PDF
                  </Button>
                </div>
              ) : isImage ? (
                <div className="p-4" style={{ transform: `scale(${zoom / 100}) rotate(${rotation}deg)`, transition: "transform 0.2s" }}>
                  <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">Immagine placeholder</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-12">
                  <FileText className="h-16 w-16 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">Anteprima non disponibile per questo formato</p>
                  <Button size="sm" variant="outline" onClick={handleDownload}>
                    <Download className="h-3.5 w-3.5 mr-1" /> Scarica file
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Metadata */}
          <TabsContent value="metadata" className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: "Categoria", value: doc.categoria },
                { label: "Dimensione", value: `${doc.file_size_kb} KB` },
                { label: "Tipo MIME", value: doc.mime_type },
                { label: "Data caricamento", value: new Date(doc.data_caricamento).toLocaleDateString("it-IT") },
                { label: "Data scadenza", value: doc.data_scadenza ? new Date(doc.data_scadenza).toLocaleDateString("it-IT") : "—" },
                { label: "Caricato da", value: doc.uploaded_by },
                { label: "Stato workflow", value: getProcessingLabel(doc.processing_status) },
                { label: "Hash SHA-256", value: doc.sha256_hash },
              ].map(({ label, value }) => (
                <div key={label} className="space-y-0.5">
                  <p className="text-xs font-medium text-muted-foreground">{label}</p>
                  <p className="text-sm text-foreground break-all">{value}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Extracted fields */}
          {doc.extracted_fields && (
            <TabsContent value="extracted" className="space-y-3">
              <p className="text-xs text-muted-foreground">Campi estratti automaticamente dal documento (mock OCR):</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {Object.entries(doc.extracted_fields).map(([key, value]) => (
                  <div key={key} className="p-2.5 rounded-md border border-border bg-muted/30">
                    <p className="text-xs font-medium text-muted-foreground capitalize">{key.replace(/_/g, " ")}</p>
                    <p className="text-sm text-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          )}

          {/* Audit log */}
          <TabsContent value="audit" className="space-y-2">
            {auditLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Nessuna attività registrata.</p>
            ) : (
              <div className="space-y-2">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 px-3 py-2 rounded-md bg-muted/30">
                    <div className={cn(
                      "w-2 h-2 rounded-full mt-1.5 shrink-0",
                      log.action === "approve" ? "bg-success" :
                      log.action === "delete" ? "bg-destructive" :
                      "bg-muted-foreground"
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{log.user_name}</span>
                        {" — "}
                        <span className="capitalize">{log.action}</span>
                      </p>
                      {log.details && <p className="text-xs text-muted-foreground">{log.details}</p>}
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {new Date(log.timestamp).toLocaleDateString("it-IT")}{" "}
                      {new Date(log.timestamp).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
