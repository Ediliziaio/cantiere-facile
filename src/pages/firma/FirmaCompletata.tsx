import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, HardHat } from "lucide-react";
import { mockFirmatari, mockDocumentiFirma } from "@/data/mock-firma";

export default function FirmaCompletata() {
  const { token } = useParams();
  const signer = mockFirmatari.find(f => f.token_firma === token);
  const doc = signer ? mockDocumentiFirma.find(d => d.id === signer.documento_id) : null;
  const now = new Date();

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center gap-2">
          <HardHat className="h-5 w-5 text-primary shrink-0" />
          <span className="font-bold text-sm">Cantiere in Cloud</span>
        </div>
      </div>
      <div className="max-w-md mx-auto px-4 py-12">
        <Card>
          <CardContent className="py-10 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto animate-in zoom-in-50 duration-500">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <h1 className="text-xl font-bold">Hai firmato con successo!</h1>
            <p className="text-sm text-muted-foreground">Il documento firmato ti sarà inviato via email.</p>

            <div className="bg-muted/50 rounded-lg p-4 text-xs text-left space-y-1.5 text-muted-foreground">
              <div className="flex justify-between"><span>Documento</span><span className="font-medium text-foreground">{doc?.nome || "—"}</span></div>
              <div className="flex justify-between"><span>Data e ora</span><span className="font-medium text-foreground">{now.toLocaleDateString("it-IT")} {now.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}</span></div>
              <div className="flex justify-between"><span>Firmatario</span><span className="font-medium text-foreground">{signer ? `${signer.nome} ${signer.cognome}` : "—"}</span></div>
              <div className="flex justify-between"><span>Hash documento</span><span className="font-mono text-foreground">a3f9c2e8...b71d</span></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
