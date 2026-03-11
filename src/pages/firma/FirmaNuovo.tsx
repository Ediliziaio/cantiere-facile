import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function FirmaNuovo() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [cantiere, setCantiere] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [scadenza, setScadenza] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

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

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/app/firma")}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold">Nuovo Documento da Firmare</h1>
          <p className="text-muted-foreground text-sm">Carica un PDF e configura i campi firma</p>
        </div>
      </div>

      {/* Upload zone */}
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
              <Select value={cantiere} onValueChange={setCantiere}>
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
        <Button onClick={handleSubmit}>Carica e configura firma →</Button>
      </div>
    </div>
  );
}
