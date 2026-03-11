import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, FileText, Plus, Search, Copy, Eye } from "lucide-react";
import { mockTemplateFirma, type TemplateFirma } from "@/data/mock-templates";
import { getTipoLabel } from "@/data/mock-firma";
import { useToast } from "@/hooks/use-toast";

const tipoBadge: Record<string, string> = {
  collaudo: "bg-amber-100 text-amber-800",
  verbale: "bg-blue-100 text-blue-800",
  autorizzazione: "bg-emerald-100 text-emerald-800",
  modulo_sicurezza: "bg-red-100 text-red-800",
  altro: "bg-muted text-muted-foreground",
};

export default function FirmaTemplates() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState<TemplateFirma | null>(null);

  const filtered = mockTemplateFirma.filter(t =>
    t.nome.toLowerCase().includes(search.toLowerCase()) ||
    t.descrizione.toLowerCase().includes(search.toLowerCase())
  );

  const useTemplate = (tpl: TemplateFirma) => {
    toast({ title: "Template selezionato", description: `"${tpl.nome}" — procedi alla compilazione` });
    navigate(`/app/firma/nuovo?template=${tpl.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/app/firma")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">Template Documenti</h1>
          <p className="text-sm text-muted-foreground">Modelli precompilati con variabili automatiche</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cerca template..."
          className="pl-9"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(tpl => (
          <Card key={tpl.id} className="flex flex-col hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${tipoBadge[tpl.tipo_documento] || tipoBadge.altro}`}>
                  {getTipoLabel(tpl.tipo_documento)}
                </span>
              </div>
              <CardTitle className="text-sm mt-2">{tpl.nome}</CardTitle>
              <CardDescription className="text-xs">{tpl.descrizione}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-end gap-3">
              <div className="flex flex-wrap gap-1">
                {tpl.variabili.filter(v => !v.auto).map(v => (
                  <span key={v.chiave} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                    {`{{${v.chiave}}}`}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setPreview(tpl)}>
                  <Eye className="h-3.5 w-3.5 mr-1" /> Anteprima
                </Button>
                <Button size="sm" className="flex-1" onClick={() => useTemplate(tpl)}>
                  <Copy className="h-3.5 w-3.5 mr-1" /> Usa
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Nessun template trovato</p>
        </div>
      )}

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{preview.nome}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setPreview(null)}>✕</Button>
              </div>
              <CardDescription>{preview.descrizione}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/30 rounded-lg p-6 font-mono text-xs whitespace-pre-wrap leading-relaxed border">
                {preview.contenuto}
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Variabili disponibili:</p>
                <div className="grid grid-cols-2 gap-2">
                  {preview.variabili.map(v => (
                    <div key={v.chiave} className="flex items-center gap-2 text-xs">
                      <code className="bg-muted px-1.5 py-0.5 rounded text-[10px]">{`{{${v.chiave}}}`}</code>
                      <span className="text-muted-foreground">{v.label}</span>
                      {v.auto && <span className="text-[9px] text-primary font-medium">AUTO</span>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setPreview(null)}>Chiudi</Button>
                <Button onClick={() => { setPreview(null); useTemplate(preview); }}>
                  <Copy className="h-3.5 w-3.5 mr-1" /> Usa questo template
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}