import { useState, useCallback } from "react";
import { Upload, X, FileText, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const categorie = [
  "DURC",
  "Visura Camerale",
  "POS",
  "PSC",
  "Attestato Sicurezza",
  "Idoneità Sanitaria",
  "Polizza RC",
  "Libretto",
  "Nomina RSPP",
  "DVR",
  "Altro",
];

interface DocumentUploadZoneProps {
  onUpload?: (file: File, categoria: string, dataScadenza: Date | null) => void;
  className?: string;
}

export function DocumentUploadZone({ onUpload, className }: DocumentUploadZoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [categoria, setCategoria] = useState("");
  const [dataScadenza, setDataScadenza] = useState<Date | undefined>();
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((f: File) => {
    setFile(f);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const handleSubmit = () => {
    if (!file || !categoria) return;
    onUpload?.(file, categoria, dataScadenza ?? null);
    setFile(null);
    setCategoria("");
    setDataScadenza(undefined);
  };

  const removeFile = () => setFile(null);

  return (
    <div className={cn("border border-border rounded-lg p-4 space-y-4", className)}>
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
          dragOver ? "border-primary bg-primary/5" : "border-border",
          file && "border-success/40 bg-success/5"
        )}
        onClick={() => !file && document.getElementById("doc-upload-input")?.click()}
      >
        <input
          id="doc-upload-input"
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={handleInputChange}
        />

        {file ? (
          <div className="flex items-center justify-center gap-3">
            <FileText className="h-5 w-5 text-success" />
            <span className="text-sm font-medium text-foreground truncate max-w-[200px]">{file.name}</span>
            <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(0)} KB)</span>
            <button onClick={(e) => { e.stopPropagation(); removeFile(); }} className="text-muted-foreground hover:text-destructive">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Trascina un file qui o <span className="text-primary font-medium">clicca per selezionare</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX, JPG, PNG — max 20MB</p>
          </>
        )}
      </div>

      {/* Categoria + Scadenza */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Categoria documento</Label>
          <Select value={categoria} onValueChange={setCategoria}>
            <SelectTrigger>
              <SelectValue placeholder="Seleziona categoria" />
            </SelectTrigger>
            <SelectContent>
              {categorie.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Data di scadenza</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !dataScadenza && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dataScadenza ? format(dataScadenza, "dd/MM/yyyy") : "Nessuna scadenza"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dataScadenza}
                onSelect={setDataScadenza}
                locale={it}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={!file || !categoria} className="w-full sm:w-auto">
        <Upload className="h-3.5 w-3.5 mr-1" />
        Carica documento
      </Button>
    </div>
  );
}
