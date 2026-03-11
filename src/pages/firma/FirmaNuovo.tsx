import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, FileText, LayoutTemplate } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockTemplateFirma, compilaTemplate } from "@/data/mock-templates";

export default function FirmaNuovo() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("template");

  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [cantiere, setCantiere] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [scadenza, setScadenza] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Template state
  const [template, setTemplate] = useState(templateId ? mockTemplateFirma.find(t => t.id === templateId) : null);
  const [variabili, setVariabili] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (template) {
      setNome(template.nome);
      setTipo(template.tipo_documento);
      // Pre-fill auto variables
      const autoVals: Record<string, string> = {};
      template.variabili.forEach(v => {
        if (v.auto) autoVals[v.chiave] = v.esempio;
      });
      setVariabili(autoVals);
    }
  }, [template]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f?.type === "application/pdf") setFile(f);
    else toast({ title: "Solo file PDF", variant: "destructive" });
  };

  const handleSubmit = () => {
    if (!nome || !tipo || !cantiere) {
      toast({ title: "Compila tutti i campi obbligatori", variant: "destructive" });
      return;
    }
    toast({ title: "Documento creato", description: "Procedi con la configurazione dei campi firma" });
    navigate("/app/firma/df2");
  };

  const compiledContent = template ? compilaTemplate(template.contenuto, variabili) : "";

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/app/firma")}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold">Nuovo Documento da Firmare</h1>
          <p className="text-muted-foreground text-sm">
            {template ? `Da template: ${template.nome}` : "Carica un PDF e configura i campi firma"}
          </p>
        </div>
      </div>

      {/* Template selector */}
      {!template && (
        <Card className="border-dashed">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <LayoutTemplate className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Usa un template predefinito</p>
                  <p className="text-xs text-muted-foreground">Documenti precompilati con variabili automatiche</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/app/firma/templates")}>
                Sfoglia template
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Template variables form */}
      {template && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <LayoutTemplate className="h-4 w-4" /> Compila variabili template
            </CardTitle>
            <CardDescription>Le variabili automatiche sono già compilate dai dati del cantiere</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {template.variabili.map(v => (
              <div key={v.chiave} className="grid grid-cols-[160px_1fr] gap-3 items-center">
                <Label className="text-xs flex items-center gap-1.5">
                  <code className="bg-muted px-1 py-0.5 rounded text-[10px]">{`{{${v.chiave}}}`}</code>
                  {v.auto && <span className="text-[9px] text-primary font-medium">AUTO</span>}
                </Label>
                <Input
                  value={variabili[v.chiave] || ""}
                  onChange={e => setVariabili(prev => ({ ...prev, [v.chiave]: e.target.value }))}
                  placeholder={v.esempio}
                  className="h-8 text-sm"
                />
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
              {showPreview ? "Nascondi anteprima" : "Mostra anteprima documento"}
            </Button>
            {showPreview && (
              <div className="bg-white border rounded-lg p-6 font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto">
                {compiledContent}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Upload zone - only if no template */}
      {!template && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Documento PDF</CardTitle>
            <CardDescription>Carica il documento da sottoporre a firma digitale (max 20MB)</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("pdf-input")?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
            >
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div className="text-left">
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="font-medium text-sm">Trascina qui il PDF o clicca per selezionare</p>
                  <p className="text-xs text-muted-foreground mt-1">Solo file PDF, massimo 20MB</p>
                </>
              )}
              <input id="pdf-input" type="file" accept=".pdf" className="hidden" onChange={e => {
                const f = e.target.files?.[0];
                if (f) setFile(f);
              }} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dettagli documento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome documento *</Label>
            <Input id="nome" value={nome} onChange={e => setNome(e.target.value)} placeholder="es. Verbale di Collaudo Strutturale" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo documento *</Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger><SelectValue placeholder="Seleziona tipo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="collaudo">Collaudo</SelectItem>
                  <SelectItem value="verbale">Verbale</SelectItem>
                  <SelectItem value="autorizzazione">Autorizzazione</SelectItem>
                  <SelectItem value="modulo_sicurezza">Modulo Sicurezza</SelectItem>
                  <SelectItem value="altro">Altro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Cantiere associato *</Label>
              <Select value={cantiere} onValueChange={v => {
                setCantiere(v);
                if (template) {
                  const cantiereNome = v === "c1" ? "Residenza Parco Verde" : "Ponte San Giorgio";
                  const cantiereIndirizzo = v === "c1" ? "Via delle Rose 15, Milano" : "Lungomare Canepa, Genova";
                  setVariabili(prev => ({
                    ...prev,
                    nome_cantiere: cantiereNome,
                    indirizzo_cantiere: cantiereIndirizzo,
                  }));
                }
              }}>
                <SelectTrigger><SelectValue placeholder="Seleziona cantiere" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="c1">Residenza Parco Verde</SelectItem>
                  <SelectItem value="c2">Ponte San Giorgio</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc">Descrizione</Label>
            <Textarea id="desc" value={descrizione} onChange={e => setDescrizione(e.target.value)} placeholder="Descrizione opzionale del documento" rows={3} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="scad">Data scadenza firma</Label>
            <Input id="scad" type="date" value={scadenza} onChange={e => setScadenza(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate("/app/firma")}>Annulla</Button>
        <Button onClick={handleSubmit}>
          {template ? "Genera documento e configura firma →" : "Carica e configura firma →"}
        </Button>
      </div>
    </div>
  );
}