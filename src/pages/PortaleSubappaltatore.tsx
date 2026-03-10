import { useParams } from "react-router-dom";
import { HardHat, AlertTriangle, CheckCircle2, XCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockSubappaltatori, mockCantieri, mockDocumenti } from "@/data/mock-data";
import { DocumentUploadZone } from "@/components/cantiere/DocumentUploadZone";
import { useState } from "react";
import { toast } from "sonner";

const requiredCategories = [
  "DURC",
  "Visura Camerale",
  "POS",
  "Polizza RC",
  "Attestato Sicurezza",
  "Idoneità Sanitaria",
];

export default function PortaleSubappaltatore() {
  const { token } = useParams<{ token: string }>();
  const [showUpload, setShowUpload] = useState(false);

  // Find subappaltatore by portal_token
  const sub = (mockSubappaltatori as any[]).find((s: any) => s.portal_token === token);

  if (!sub) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center space-y-3 max-w-sm">
          <HardHat className="h-12 w-12 text-muted-foreground mx-auto" />
          <h1 className="font-heading font-bold text-xl text-foreground">Link non valido</h1>
          <p className="text-sm text-muted-foreground">
            Il link di accesso al portale non è valido o è scaduto. Contatta l'impresa principale.
          </p>
        </div>
      </div>
    );
  }

  const cantiere = mockCantieri.find((c) => c.id === sub.cantiere_id);
  const docs = mockDocumenti.filter((d) => d.riferimento_id === sub.id);

  const checklist = requiredCategories.map((cat) => {
    const doc = docs.find((d) => d.categoria === cat);
    if (!doc) return { categoria: cat, stato: "mancante" as const };
    if (doc.stato === "scaduto") return { categoria: cat, stato: "scaduto" as const };
    if (doc.stato === "in_scadenza") return { categoria: cat, stato: "in_scadenza" as const };
    return { categoria: cat, stato: "presente" as const };
  });

  const mancanti = checklist.filter((c) => c.stato === "mancante" || c.stato === "scaduto").length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <HardHat className="h-6 w-6 text-primary" />
          <span className="font-heading font-bold text-foreground">Cantiere in Cloud</span>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full p-4 space-y-6">
        {/* Company info */}
        <div>
          <h1 className="font-heading font-bold text-2xl text-foreground">{sub.ragione_sociale}</h1>
          <p className="text-sm text-muted-foreground">Cantiere: {cantiere?.nome ?? "—"} · {cantiere?.comune}</p>
        </div>

        {/* Warning banner */}
        {mancanti > 0 && (
          <div className="flex items-start gap-3 border border-destructive/30 bg-destructive/5 rounded-lg p-4">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-foreground">
                {mancanti} document{mancanti > 1 ? "i" : "o"} mancant{mancanti > 1 ? "i" : "e"}
              </p>
              <p className="text-muted-foreground mt-0.5">
                Il tuo accesso al cantiere potrebbe essere limitato fino al completamento della documentazione.
              </p>
            </div>
          </div>
        )}

        {/* Checklist */}
        <div className="border border-border rounded-lg divide-y divide-border">
          <div className="px-4 py-3 bg-muted/30">
            <p className="font-heading font-semibold text-sm text-foreground">Checklist documentale</p>
          </div>
          {checklist.map((item) => (
            <div key={item.categoria} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                {item.stato === "presente" && <CheckCircle2 className="h-4 w-4 text-success" />}
                {item.stato === "in_scadenza" && <AlertTriangle className="h-4 w-4 text-warning" />}
                {(item.stato === "mancante" || item.stato === "scaduto") && <XCircle className="h-4 w-4 text-destructive" />}
                <span className="text-sm text-foreground">{item.categoria}</span>
              </div>
              <span className={`text-[10px] uppercase tracking-wider font-semibold rounded-sm px-1.5 py-0.5 ${
                item.stato === "presente" ? "bg-success/15 text-success" :
                item.stato === "in_scadenza" ? "bg-warning/15 text-warning" :
                "bg-destructive/15 text-destructive"
              }`}>
                {item.stato === "mancante" ? "Mancante" : item.stato === "scaduto" ? "Scaduto" : item.stato === "in_scadenza" ? "In scadenza" : "Presente"}
              </span>
            </div>
          ))}
        </div>

        {/* Upload */}
        <div>
          <Button size="sm" onClick={() => setShowUpload(!showUpload)}>
            <Upload className="h-3.5 w-3.5 mr-1" /> Carica documento
          </Button>
          {showUpload && (
            <div className="mt-3">
              <DocumentUploadZone
                onUpload={(file, categoria, dataScadenza) => {
                  toast.success(`"${file.name}" caricato come ${categoria}`);
                  setShowUpload(false);
                }}
              />
            </div>
          )}
        </div>

        {/* Communication placeholder */}
        <div className="border border-border rounded-lg p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Le comunicazioni con l'impresa principale appariranno qui.
          </p>
        </div>
      </main>

      <footer className="border-t border-border py-4 text-center">
        <p className="text-xs text-muted-foreground">
          Portale gestito da <span className="font-medium text-foreground">Cantiere in Cloud</span>
        </p>
      </footer>
    </div>
  );
}
