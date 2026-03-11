import { useState, useCallback } from "react";
import { Camera, FileText, Package, ClipboardList, FolderOpen, Upload, X, Download, Trash2, Eye, CalendarIcon, User } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { mockFileCantiere, type FileCantiere, type FileCantiereTipo } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "@/hooks/use-toast";

const tipiFile: { value: FileCantiereTipo | "tutti"; label: string; icon: React.ReactNode }[] = [
  { value: "tutti", label: "Tutti", icon: <FolderOpen className="h-3.5 w-3.5" /> },
  { value: "foto", label: "Foto", icon: <Camera className="h-3.5 w-3.5" /> },
  { value: "materiale", label: "Materiali", icon: <Package className="h-3.5 w-3.5" /> },
  { value: "rapportino", label: "Rapportini", icon: <ClipboardList className="h-3.5 w-3.5" /> },
  { value: "altro", label: "Altro", icon: <FileText className="h-3.5 w-3.5" /> },
];

const tipoLabel: Record<FileCantiereTipo, string> = {
  foto: "Foto",
  materiale: "Materiale",
  rapportino: "Rapportino",
  altro: "Altro",
};

interface GalleriaCantiereProps {
  cantiereId: string;
}

export function GalleriaCantiere({ cantiereId }: GalleriaCantiereProps) {
  const [files, setFiles] = useState(() => mockFileCantiere.filter((f) => f.cantiere_id === cantiereId));
  const [filtro, setFiltro] = useState<FileCantiereTipo | "tutti">("tutti");
  const [preview, setPreview] = useState<FileCantiere | null>(null);

  // Upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTipo, setUploadTipo] = useState<FileCantiereTipo>("foto");
  const [uploadDescrizione, setUploadDescrizione] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const filtered = filtro === "tutti" ? files : files.filter((f) => f.tipo === filtro);
  const fotos = filtered.filter((f) => f.tipo === "foto");
  const altriFile = filtered.filter((f) => f.tipo !== "foto");

  const handleFileDrop = useCallback((f: File) => setUploadFile(f), []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFileDrop(f);
  }, [handleFileDrop]);

  const handleUpload = () => {
    if (!uploadFile) return;
    const newFile: FileCantiere = {
      id: `fc-new-${Date.now()}`,
      cantiere_id: cantiereId,
      nome_file: uploadFile.name,
      tipo: uploadTipo,
      descrizione: uploadDescrizione || uploadFile.name,
      data_caricamento: new Date().toISOString(),
      caricato_da: "Utente corrente",
      dimensione_kb: Math.round(uploadFile.size / 1024),
      url: "/placeholder.svg",
      thumbnail_url: uploadTipo === "foto" ? "/placeholder.svg" : null,
    };
    setFiles((prev) => [newFile, ...prev]);
    setUploadFile(null);
    setUploadDescrizione("");
    setShowUpload(false);
    toast({ title: "File caricato", description: `${uploadFile.name} aggiunto alla galleria.` });
  };

  const handleDelete = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    toast({ title: "File eliminato" });
  };

  return (
    <div className="space-y-4">
      {/* Filtro + Upload button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <ToggleGroup type="single" value={filtro} onValueChange={(v) => v && setFiltro(v as any)} variant="outline" size="sm">
          {tipiFile.map((t) => (
            <ToggleGroupItem key={t.value} value={t.value} className="gap-1.5 text-xs">
              {t.icon} {t.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <Button size="sm" onClick={() => setShowUpload(!showUpload)}>
          <Upload className="h-3.5 w-3.5 mr-1" /> Carica file
        </Button>
      </div>

      {/* Upload zone */}
      {showUpload && (
        <div className="border border-border rounded-lg p-4 space-y-3 bg-muted/30">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
              dragOver ? "border-primary bg-primary/5" : "border-border",
              uploadFile && "border-primary/40 bg-primary/5"
            )}
            onClick={() => !uploadFile && document.getElementById("gallery-upload-input")?.click()}
          >
            <input id="gallery-upload-input" type="file" className="hidden" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.heic,.mp4" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileDrop(f); }} />
            {uploadFile ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground truncate max-w-[200px]">{uploadFile.name}</span>
                <span className="text-xs text-muted-foreground">({(uploadFile.size / 1024).toFixed(0)} KB)</span>
                <button onClick={(e) => { e.stopPropagation(); setUploadFile(null); }} className="text-muted-foreground hover:text-destructive"><X className="h-4 w-4" /></button>
              </div>
            ) : (
              <>
                <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Trascina un file qui o <span className="text-primary font-medium">clicca per selezionare</span></p>
                <p className="text-xs text-muted-foreground mt-1">Foto, PDF, documenti — max 20MB</p>
              </>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Tipo file</Label>
              <Select value={uploadTipo} onValueChange={(v) => setUploadTipo(v as FileCantiereTipo)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="foto">📷 Foto</SelectItem>
                  <SelectItem value="materiale">📦 Materiale / DDT</SelectItem>
                  <SelectItem value="rapportino">📋 Rapportino</SelectItem>
                  <SelectItem value="altro">📄 Altro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Descrizione (opzionale)</Label>
              <Input value={uploadDescrizione} onChange={(e) => setUploadDescrizione(e.target.value)} placeholder="Breve descrizione del file..." />
            </div>
          </div>
          <Button onClick={handleUpload} disabled={!uploadFile} size="sm">
            <Upload className="h-3.5 w-3.5 mr-1" /> Conferma caricamento
          </Button>
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <FolderOpen className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Nessun file {filtro !== "tutti" ? `di tipo "${tipoLabel[filtro as FileCantiereTipo]}"` : ""} caricato.</p>
        </div>
      )}

      {/* Photo grid */}
      {fotos.length > 0 && (
        <div>
          {filtro === "tutti" && <h3 className="text-sm font-semibold text-foreground mb-2">Foto ({fotos.length})</h3>}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {fotos.map((f) => (
              <button key={f.id} onClick={() => setPreview(f)} className="group relative rounded-lg overflow-hidden border border-border bg-muted aspect-square hover:ring-2 hover:ring-primary/50 transition-all">
                <img src={f.thumbnail_url || "/placeholder.svg"} alt={f.descrizione} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                  <p className="text-xs font-medium text-background truncate">{f.nome_file}</p>
                  <p className="text-[10px] text-background/70">{format(new Date(f.data_caricamento), "dd MMM yyyy", { locale: it })}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* File list */}
      {altriFile.length > 0 && (
        <div>
          {filtro === "tutti" && fotos.length > 0 && <h3 className="text-sm font-semibold text-foreground mb-2 mt-4">File ({altriFile.length})</h3>}
          <div className="border border-border rounded-lg divide-y divide-border">
            {altriFile.map((f) => {
              const Icon = f.tipo === "materiale" ? Package : f.tipo === "rapportino" ? ClipboardList : FileText;
              return (
                <div key={f.id} className="flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors">
                  <div className="shrink-0 h-9 w-9 rounded-md bg-muted flex items-center justify-center">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{f.nome_file}</p>
                    <p className="text-xs text-muted-foreground truncate">{f.descrizione}</p>
                    <div className="flex items-center gap-3 mt-0.5 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1"><CalendarIcon className="h-3 w-3" />{format(new Date(f.data_caricamento), "dd/MM/yyyy HH:mm")}</span>
                      <span className="flex items-center gap-1"><User className="h-3 w-3" />{f.caricato_da}</span>
                      <span>{f.dimensione_kb} KB</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast({ title: "Download avviato", description: f.nome_file })}>
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(f.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Preview dialog */}
      <Dialog open={!!preview} onOpenChange={(open) => !open && setPreview(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="truncate">{preview?.nome_file}</DialogTitle>
          </DialogHeader>
          {preview && (
            <div className="space-y-3">
              <div className="rounded-lg overflow-hidden bg-muted border border-border">
                <img src={preview.url} alt={preview.descrizione} className="w-full max-h-[400px] object-contain" />
              </div>
              <p className="text-sm text-foreground">{preview.descrizione}</p>
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><CalendarIcon className="h-3 w-3" />{format(new Date(preview.data_caricamento), "dd MMMM yyyy, HH:mm", { locale: it })}</span>
                <span className="flex items-center gap-1"><User className="h-3 w-3" />{preview.caricato_da}</span>
                <span>{preview.dimensione_kb} KB</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => toast({ title: "Download avviato", description: preview.nome_file })}>
                  <Download className="h-3.5 w-3.5 mr-1" /> Scarica
                </Button>
                <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => { handleDelete(preview.id); setPreview(null); }}>
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Elimina
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
