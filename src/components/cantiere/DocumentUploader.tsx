import { useState, useCallback, useRef } from "react";
import { Upload, X, FileText, Image, File as FileIcon, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDocumentProcessing, validateFile } from "@/hooks/useDocumentProcessing";
import { mockCantieri } from "@/data/mock-data";
import { toast } from "sonner";

const categorie = [
  "DURC", "Visura Camerale", "POS", "PSC", "Attestato Sicurezza",
  "Idoneità Sanitaria", "Polizza RC", "Libretto", "Nomina RSPP", "DVR", "Collaudo", "Assicurazione", "Altro",
];

interface QueuedFile {
  id: string;
  file: File;
  status: "pending" | "processing" | "done" | "error";
  progress: number;
  errors: string[];
  autoCategory: string | null;
}

interface DocumentUploaderProps {
  cantiereId?: string;
  onComplete?: (files: QueuedFile[]) => void;
  onClose?: () => void;
}

function classifyByFilename(name: string): string | null {
  const lower = name.toLowerCase();
  if (lower.includes("durc")) return "DURC";
  if (lower.includes("pos")) return "POS";
  if (lower.includes("idoneita") || lower.includes("idoneità")) return "Idoneità Sanitaria";
  if (lower.includes("attestato")) return "Attestato Sicurezza";
  if (lower.includes("polizza")) return "Polizza RC";
  if (lower.includes("visura")) return "Visura Camerale";
  if (lower.includes("libretto")) return "Libretto";
  if (lower.includes("collaudo")) return "Collaudo";
  if (lower.includes("assicurazione")) return "Assicurazione";
  if (lower.includes("dvr")) return "DVR";
  if (lower.includes("psc")) return "PSC";
  return null;
}

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  if (ext === "pdf") return FileText;
  if (["jpg", "jpeg", "png", "heic", "tiff", "tif"].includes(ext)) return Image;
  return FileIcon;
}

export function DocumentUploader({ cantiereId, onComplete, onClose }: DocumentUploaderProps) {
  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const [selectedCantiere, setSelectedCantiere] = useState(cantiereId || mockCantieri[0]?.id || "");
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { processFile, getResult } = useDocumentProcessing();

  const addFiles = useCallback((files: FileList | File[]) => {
    const newFiles: QueuedFile[] = Array.from(files).map((file) => {
      const errors = validateFile(file);
      return {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        status: errors.length > 0 ? "error" as const : "pending" as const,
        progress: 0,
        errors,
        autoCategory: classifyByFilename(file.name),
      };
    });

    // Check total session size (200MB)
    const currentTotal = queue.reduce((sum, f) => sum + f.file.size, 0);
    const newTotal = newFiles.reduce((sum, f) => sum + f.file.size, 0);
    if (currentTotal + newTotal > 200 * 1024 * 1024) {
      toast.error("Limite sessione superato", { description: "Max 200MB per sessione di upload." });
      return;
    }

    setQueue(prev => [...prev, ...newFiles]);
  }, [queue]);

  const removeFile = useCallback((id: string) => {
    setQueue(prev => prev.filter(f => f.id !== id));
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  }, [addFiles]);

  const handleUploadAll = async () => {
    setIsUploading(true);
    const pendingFiles = queue.filter(f => f.status === "pending");

    for (const qf of pendingFiles) {
      setQueue(prev => prev.map(f => f.id === qf.id ? { ...f, status: "processing", progress: 10 } : f));

      try {
        await processFile(qf.file, qf.id);

        // Simulate upload progress
        for (let p = 20; p <= 80; p += 20) {
          await new Promise(r => setTimeout(r, 200));
          setQueue(prev => prev.map(f => f.id === qf.id ? { ...f, progress: p } : f));
        }

        await new Promise(r => setTimeout(r, 300));
        setQueue(prev => prev.map(f => f.id === qf.id ? { ...f, status: "done", progress: 100 } : f));
      } catch {
        setQueue(prev => prev.map(f => f.id === qf.id ? { ...f, status: "error", errors: ["Errore durante l'upload"] } : f));
      }
    }

    setIsUploading(false);
    toast.success(`${pendingFiles.length} file caricati`);
    onComplete?.(queue);
  };

  const completedCount = queue.filter(f => f.status === "done").length;
  const totalCount = queue.length;
  const globalProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const hasValidFiles = queue.some(f => f.status === "pending");

  return (
    <div className="border border-border rounded-lg p-4 space-y-4 bg-card">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
          dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.heic,.tiff,.tif,.doc,.docx,.dwg,.dxf"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-foreground font-medium">
          Trascina i file qui o <span className="text-primary">clicca per selezionare</span>
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          PDF, JPG, PNG, HEIC, TIFF, DOC, DWG — Max 50MB/file, 200MB/sessione
        </p>
      </div>

      {/* Cantiere selector */}
      {!cantiereId && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Cantiere di destinazione</label>
          <Select value={selectedCantiere} onValueChange={setSelectedCantiere}>
            <SelectTrigger>
              <SelectValue placeholder="Seleziona cantiere" />
            </SelectTrigger>
            <SelectContent>
              {mockCantieri.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* File queue */}
      {queue.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">
              {completedCount}/{totalCount} file completati
            </p>
            {isUploading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
          </div>
          {totalCount > 1 && (
            <Progress value={globalProgress} className="h-2" />
          )}

          <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
            {queue.map((qf) => {
              const Icon = getFileIcon(qf.file.name);
              return (
                <div key={qf.id} className="flex items-center gap-3 px-3 py-2 rounded-md bg-muted/50">
                  <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-foreground truncate">{qf.file.name}</span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {(qf.file.size / 1024).toFixed(0)} KB
                      </span>
                      {qf.autoCategory && (
                        <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded shrink-0">
                          {qf.autoCategory}
                        </span>
                      )}
                    </div>
                    {qf.status === "processing" && (
                      <Progress value={qf.progress} className="h-1" />
                    )}
                    {qf.errors.length > 0 && (
                      <p className="text-xs text-destructive">{qf.errors[0]}</p>
                    )}
                  </div>
                  <div className="shrink-0">
                    {qf.status === "done" && <CheckCircle2 className="h-4 w-4 text-success" />}
                    {qf.status === "error" && <AlertCircle className="h-4 w-4 text-destructive" />}
                    {qf.status === "processing" && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                    {qf.status === "pending" && (
                      <button onClick={(e) => { e.stopPropagation(); removeFile(qf.id); }} className="text-muted-foreground hover:text-destructive">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        {onClose && (
          <Button variant="outline" size="sm" onClick={onClose} disabled={isUploading}>
            Annulla
          </Button>
        )}
        <Button
          size="sm"
          onClick={handleUploadAll}
          disabled={!hasValidFiles || isUploading}
          className="gap-1.5"
        >
          {isUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          Carica {queue.filter(f => f.status === "pending").length} file
        </Button>
      </div>
    </div>
  );
}
