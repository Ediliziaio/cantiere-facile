import { useState } from "react";
import { Eye, Download, FileText, Image, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface DocumentActionsProps {
  nomeFile: string;
  categoria: string;
  dataCaricamento?: string;
  fileUrl?: string;
}

function getFileType(name: string): "pdf" | "image" | "other" {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return "pdf";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return "image";
  return "other";
}

export function DocumentActions({ nomeFile, categoria, dataCaricamento, fileUrl }: DocumentActionsProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileType = getFileType(nomeFile);

  const handleDownload = () => {
    if (fileUrl) {
      const a = document.createElement("a");
      a.href = fileUrl;
      a.download = nomeFile;
      a.click();
    } else {
      toast.success(`Download "${nomeFile}" avviato`, {
        description: "Il file sarà disponibile quando connesso al backend.",
      });
    }
  };

  return (
    <>
      <div className="flex items-center gap-1 shrink-0">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPreviewOpen(true)} title="Visualizza">
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDownload} title="Scarica">
          <Download className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              {fileType === "pdf" ? <FileText className="h-4 w-4" /> : fileType === "image" ? <Image className="h-4 w-4" /> : <File className="h-4 w-4" />}
              {nomeFile}
            </DialogTitle>
          </DialogHeader>

          <div className="text-xs text-muted-foreground mb-2">
            {categoria}{dataCaricamento ? ` · Caricato il ${new Date(dataCaricamento).toLocaleDateString("it-IT")}` : ""}
          </div>

          {fileType === "pdf" && fileUrl ? (
            <iframe src={fileUrl} className="w-full h-[60vh] rounded-md border border-border" title={nomeFile} />
          ) : fileType === "image" && fileUrl ? (
            <img src={fileUrl} alt={nomeFile} className="max-w-full max-h-[60vh] object-contain mx-auto rounded-md" />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
              <File className="h-12 w-12 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                Anteprima non disponibile per questo tipo di file.
              </p>
              <Button size="sm" onClick={handleDownload}>
                <Download className="h-3.5 w-3.5 mr-1" /> Scarica file
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
