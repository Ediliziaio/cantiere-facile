import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Eye, FileText } from "lucide-react";
import { mockDocumentiFirma, mockFirmatari, mockCampiFirma, type TipoCampoFirma } from "@/data/mock-firma";

const tipoColors: Record<TipoCampoFirma, string> = {
  firma: "border-amber-400 bg-amber-100/80",
  iniziali: "border-blue-400 bg-blue-100/80",
  data: "border-emerald-400 bg-emerald-100/80",
  testo_libero: "border-purple-400 bg-purple-100/80",
};

const tipoLabels: Record<TipoCampoFirma, string> = {
  firma: "Firma",
  iniziali: "Iniziali",
  data: "Data",
  testo_libero: "Testo",
};

export default function FirmaAnteprima() {
  const { id } = useParams();
  const navigate = useNavigate();
  const doc = mockDocumentiFirma.find(d => d.id === id);
  const signers = mockFirmatari.filter(f => f.documento_id === id);
  const fields = mockCampiFirma.filter(c => c.documento_id === id);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  if (!doc) return <div className="p-8 text-center text-muted-foreground">Documento non trovato</div>;

  const pageFields = fields.filter(f => f.pagina === currentPage);

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/app/firma/${id}`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold truncate">Anteprima documento</h1>
          <p className="text-sm text-muted-foreground truncate">{doc.nome}</p>
        </div>
        {doc.file_firmato_url && (
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1.5" /> Scarica firmato
          </Button>
        )}
      </div>

      {/* Page navigation */}
      <div className="flex items-center justify-center gap-3">
        <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)}>
          ← Precedente
        </Button>
        <span className="text-sm font-medium">Pagina {currentPage} di {totalPages}</span>
        <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)}>
          Successiva →
        </Button>
      </div>

      {/* PDF Preview */}
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="relative bg-white border rounded-lg shadow-sm aspect-[210/297] w-full">
            {/* Mock PDF content */}
            <div className="absolute inset-0 p-[8%]">
              <div className="space-y-3">
                <div className="h-4 bg-muted/30 rounded w-2/3 mx-auto" />
                <div className="h-2.5 bg-muted/20 rounded w-1/2 mx-auto" />
                <div className="mt-8 space-y-2.5">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div key={i} className="h-2 bg-muted/15 rounded" style={{ width: `${65 + Math.random() * 35}%` }} />
                  ))}
                </div>
                {currentPage === 1 && (
                  <div className="mt-6 p-4 border border-dashed border-muted/30 rounded">
                    <div className="h-2 bg-muted/20 rounded w-1/3 mb-2" />
                    <div className="space-y-1.5">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-1.5 bg-muted/15 rounded" style={{ width: `${50 + Math.random() * 50}%` }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Signature fields overlay */}
            {pageFields.map(field => {
              const signer = signers.find(s => s.id === field.firmatario_id);
              const isSigned = field.stato === "firmato";
              return (
                <div
                  key={field.id}
                  className={`absolute border-2 rounded ${isSigned ? "border-emerald-400 bg-emerald-50/90" : tipoColors[field.tipo]}`}
                  style={{
                    left: `${field.x}%`,
                    top: `${field.y}%`,
                    width: `${field.larghezza}%`,
                    height: `${field.altezza}%`,
                  }}
                >
                  <div className="flex items-center justify-center h-full text-[10px] font-medium px-1">
                    {isSigned ? (
                      <span className="text-emerald-700 italic">
                        ✓ {signer?.nome} {signer?.cognome}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        {tipoLabels[field.tipo]} — {signer?.nome || "?"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Legenda campi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm border-2 border-amber-400 bg-amber-100" />
              <span>Firma</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm border-2 border-blue-400 bg-blue-100" />
              <span>Iniziali</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm border-2 border-emerald-400 bg-emerald-100" />
              <span>Firmato ✓</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm border-2 border-purple-400 bg-purple-100" />
              <span>Testo libero</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Signers summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Riepilogo firmatari</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {signers.map(s => {
            const signerFields = fields.filter(f => f.firmatario_id === s.id);
            const signedFields = signerFields.filter(f => f.stato === "firmato").length;
            return (
              <div key={s.id} className="flex items-center justify-between text-sm py-1.5 border-b last:border-0">
                <div>
                  <span className="font-medium">{s.nome} {s.cognome}</span>
                  <span className="text-muted-foreground ml-2 text-xs">{s.ruolo_descrizione}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{signedFields}/{signerFields.length} campi</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    s.stato === "firmato" ? "bg-emerald-100 text-emerald-700" :
                    s.stato === "rifiutato" ? "bg-red-100 text-red-700" :
                    "bg-amber-100 text-amber-700"
                  }`}>
                    {s.stato === "firmato" ? "Firmato ✓" : s.stato === "rifiutato" ? "Rifiutato" : "In attesa"}
                  </span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}