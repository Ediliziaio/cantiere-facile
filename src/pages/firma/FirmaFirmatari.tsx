import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, Trash2, Send, GripVertical, UserPlus, ArrowUpDown } from "lucide-react";
import { mockDocumentiFirma, mockFirmatari, mockCampiFirma, type Firmatario, type MetodoFirma } from "@/data/mock-firma";
import { useToast } from "@/hooks/use-toast";

interface NewSigner {
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  ruolo_descrizione: string;
  metodo_preferito: MetodoFirma;
}

const emptyForm: NewSigner = {
  nome: "", cognome: "", email: "", telefono: "",
  ruolo_descrizione: "", metodo_preferito: "disegno",
};

export default function FirmaFirmatari() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const doc = mockDocumentiFirma.find(d => d.id === id);

  const [signers, setSigners] = useState<Firmatario[]>(() =>
    mockFirmatari.filter(f => f.documento_id === id)
  );
  const [form, setForm] = useState<NewSigner>(emptyForm);
  const [showForm, setShowForm] = useState(false);

  if (!doc) return <div className="p-8 text-center text-muted-foreground">Documento non trovato</div>;

  const fieldsPerSigner = (signerId: string) =>
    mockCampiFirma.filter(c => c.documento_id === id && c.firmatario_id === signerId).length;

  const addSigner = () => {
    if (!form.nome || !form.cognome || !form.email) {
      toast({ title: "Compila nome, cognome e email", variant: "destructive" });
      return;
    }
    const newSigner: Firmatario = {
      id: `f-new-${Date.now()}`,
      documento_id: id!,
      nome: form.nome,
      cognome: form.cognome,
      email: form.email,
      telefono: form.telefono,
      ruolo_descrizione: form.ruolo_descrizione,
      token_firma: `tok-${Date.now()}`,
      metodo_preferito: form.metodo_preferito,
      data_firma: null,
      stato: "in_attesa",
      motivo_rifiuto: null,
      ip_address: null,
    };
    setSigners(prev => [...prev, newSigner]);
    setForm(emptyForm);
    setShowForm(false);
    toast({ title: "Firmatario aggiunto" });
  };

  const removeSigner = (signerId: string) => {
    setSigners(prev => prev.filter(s => s.id !== signerId));
    toast({ title: "Firmatario rimosso" });
  };

  const moveSigner = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= signers.length) return;
    const updated = [...signers];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setSigners(updated);
  };

  const sendRequests = () => {
    toast({
      title: "Richieste inviate!",
      description: `${signers.length} email inviate ai firmatari`,
    });
    navigate(`/app/firma/${id}`);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/app/firma/${id}`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold truncate">Gestisci firmatari</h1>
          <p className="text-sm text-muted-foreground truncate">{doc.nome}</p>
        </div>
      </div>

      {/* Signers list */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Firmatari ({signers.length})</CardTitle>
            <CardDescription>Ordine di firma: dall'alto verso il basso</CardDescription>
          </div>
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            <UserPlus className="h-4 w-4 mr-1.5" /> Aggiungi
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {signers.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              Nessun firmatario. Aggiungi almeno un firmatario per procedere.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Firmatario</TableHead>
                  <TableHead className="hidden sm:table-cell">Ruolo</TableHead>
                  <TableHead>Metodo</TableHead>
                  <TableHead className="hidden md:table-cell">Campi</TableHead>
                  <TableHead className="w-24"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {signers.map((signer, i) => (
                  <TableRow key={signer.id}>
                    <TableCell>
                      <div className="flex flex-col items-center gap-0.5">
                        <button
                          onClick={() => moveSigner(i, -1)}
                          disabled={i === 0}
                          className="text-muted-foreground hover:text-foreground disabled:opacity-20 transition-opacity"
                        >
                          <ArrowUpDown className="h-3 w-3 rotate-180" />
                        </button>
                        <span className="text-xs font-bold text-muted-foreground">{i + 1}</span>
                        <button
                          onClick={() => moveSigner(i, 1)}
                          disabled={i === signers.length - 1}
                          className="text-muted-foreground hover:text-foreground disabled:opacity-20 transition-opacity"
                        >
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">{signer.nome} {signer.cognome}</div>
                      <div className="text-xs text-muted-foreground">{signer.email}</div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {signer.ruolo_descrizione || "—"}
                    </TableCell>
                    <TableCell className="text-sm capitalize">{signer.metodo_preferito}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {fieldsPerSigner(signer.id)} campi
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => removeSigner(signer.id)} title="Rimuovi">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add signer form */}
      {showForm && (
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Nuovo firmatario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Nome *</Label>
                <Input value={form.nome} onChange={e => setForm(p => ({ ...p, nome: e.target.value }))} placeholder="Mario" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Cognome *</Label>
                <Input value={form.cognome} onChange={e => setForm(p => ({ ...p, cognome: e.target.value }))} placeholder="Rossi" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Email *</Label>
                <Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="mario@example.com" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Telefono</Label>
                <Input value={form.telefono} onChange={e => setForm(p => ({ ...p, telefono: e.target.value }))} placeholder="+39 333 1234567" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Ruolo / Descrizione</Label>
                <Input value={form.ruolo_descrizione} onChange={e => setForm(p => ({ ...p, ruolo_descrizione: e.target.value }))} placeholder="Direttore Lavori" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Metodo firma</Label>
                <Select value={form.metodo_preferito} onValueChange={v => setForm(p => ({ ...p, metodo_preferito: v as MetodoFirma }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disegno">Disegno (firma a mano)</SelectItem>
                    <SelectItem value="otp">OTP via email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>Annulla</Button>
              <Button size="sm" onClick={addSigner}>
                <Plus className="h-3.5 w-3.5 mr-1" /> Aggiungi firmatario
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Button variant="outline" asChild>
          <a onClick={() => navigate(`/app/firma/${id}/configura`)} className="cursor-pointer">
            Configura campi firma →
          </a>
        </Button>
        <Button onClick={sendRequests} disabled={signers.length === 0} className="gap-1.5">
          <Send className="h-4 w-4" /> Invia richieste firma ({signers.length})
        </Button>
      </div>
    </div>
  );
}