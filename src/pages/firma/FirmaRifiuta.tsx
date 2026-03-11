import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { HardHat, XCircle, CheckCircle2 } from "lucide-react";
import { mockFirmatari, mockDocumentiFirma } from "@/data/mock-firma";

export default function FirmaRifiuta() {
  const { token } = useParams();
  const [motivo, setMotivo] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const signer = mockFirmatari.find(f => f.token_firma === token);
  const doc = signer ? mockDocumentiFirma.find(d => d.id === signer.documento_id) : null;

  if (submitted) {
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
              <CheckCircle2 className="h-10 w-10 text-muted-foreground mx-auto" />
              <h1 className="text-lg font-bold">Rifiuto registrato</h1>
              <p className="text-sm text-muted-foreground">L'amministratore è stato notificato del tuo rifiuto.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
          <CardContent className="py-8 space-y-5">
            <div className="text-center">
              <XCircle className="h-10 w-10 text-destructive mx-auto mb-3" />
              <h1 className="text-lg font-bold">Rifiuta firma</h1>
              <p className="text-sm text-muted-foreground mt-1">Stai rifiutando di firmare: <strong>{doc?.nome}</strong></p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo del rifiuto (opzionale)</Label>
              <Textarea id="motivo" value={motivo} onChange={e => setMotivo(e.target.value)} placeholder="Spiega perché non vuoi firmare questo documento..." rows={4} />
            </div>
            <Button variant="destructive" className="w-full h-12" onClick={() => setSubmitted(true)}>
              Conferma rifiuto
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
