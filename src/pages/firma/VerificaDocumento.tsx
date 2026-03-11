import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle, Search, Shield, FileText } from "lucide-react";
import { mockDocumentiFirma, mockFirmatari } from "@/data/mock-firma";
import { format } from "date-fns";

const MOCK_HASHES: Record<string, string> = {
  df1: "a3f9c2e1b4d7890abcdef1234567890abcdef1234567890abcdef1234567890a",
  df3: "b5e8d3f2c6a9012bcdefab1234567890bcdefab1234567890bcdefab12345678",
};

export default function VerificaDocumento() {
  const { hash: routeHash } = useParams();
  const [inputHash, setInputHash] = useState(routeHash || "");
  const [result, setResult] = useState<"found" | "not_found" | null>(routeHash ? checkHash(routeHash) : null);

  function checkHash(hash: string): "found" | "not_found" {
    const entry = Object.entries(MOCK_HASHES).find(([_, h]) => h === hash || h.startsWith(hash));
    return entry ? "found" : "not_found";
  }

  function getDocFromHash(hash: string) {
    const entry = Object.entries(MOCK_HASHES).find(([_, h]) => h === hash || h.startsWith(hash));
    if (!entry) return null;
    return mockDocumentiFirma.find(d => d.id === entry[0]) || null;
  }

  const handleVerify = () => {
    if (!inputHash.trim()) return;
    setResult(checkHash(inputHash.trim()));
  };

  const doc = result === "found" ? getDocFromHash(inputHash || routeHash || "") : null;
  const signers = doc ? mockFirmatari.filter(f => f.documento_id === doc.id && f.stato === "firmato") : [];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Cantiere in Cloud</span>
          </div>
          <h1 className="text-2xl font-bold">Verifica documento firmato</h1>
          <p className="text-muted-foreground text-sm">
            Inserisci l'hash SHA-256 del documento per verificarne l'autenticità
          </p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Input
                value={inputHash}
                onChange={e => setInputHash(e.target.value)}
                placeholder="Incolla hash del documento..."
                className="font-mono text-xs"
                onKeyDown={e => e.key === "Enter" && handleVerify()}
              />
              <Button onClick={handleVerify}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Result */}
        {result === "found" && doc && (
          <Card className="border-emerald-200 bg-emerald-50/50">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3 text-emerald-700">
                <CheckCircle2 className="h-8 w-8" />
                <div>
                  <p className="font-bold text-lg">DOCUMENTO VERIFICATO</p>
                  <p className="text-sm text-emerald-600">La firma digitale è autentica</p>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-emerald-200">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Documento</span>
                  <span className="font-medium">{doc.nome}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Azienda</span>
                  <span className="font-medium">Rossi Costruzioni S.r.l.</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cantiere</span>
                  <span className="font-medium">{doc.cantiere_nome}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Data creazione</span>
                  <span>{format(new Date(doc.data_creazione), "dd/MM/yyyy")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Stato</span>
                  <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                    Completato
                  </span>
                </div>
              </div>

              {signers.length > 0 && (
                <div className="pt-2 border-t border-emerald-200">
                  <p className="text-sm font-medium mb-2">Firmatari verificati</p>
                  <div className="space-y-1.5">
                    {signers.map(s => (
                      <div key={s.id} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        <span>{s.nome} {s.cognome}</span>
                        <span className="text-xs text-muted-foreground">— {s.ruolo_descrizione}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {result === "not_found" && (
          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-red-700">
                <XCircle className="h-8 w-8" />
                <div>
                  <p className="font-bold text-lg">DOCUMENTO NON TROVATO</p>
                  <p className="text-sm text-red-600">
                    Nessun documento firmato corrisponde a questo hash. Verifica di aver inserito l'hash corretto.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info */}
        <p className="text-center text-xs text-muted-foreground">
          Servizio di verifica offerto da Cantiere in Cloud · cantiereincloud.it
        </p>
      </div>
    </div>
  );
}