import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NuovoCantiere() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: "", indirizzo: "", comune: "", data_inizio: "", data_fine: "" });

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/app/cantieri");
  };

  return (
    <div className="space-y-6 max-w-lg">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/app/cantieri"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <h1 className="font-heading font-bold text-2xl text-foreground">Nuovo cantiere</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="nome">Nome cantiere</Label>
          <Input id="nome" value={form.nome} onChange={update("nome")} placeholder="Es. Residenziale Via Roma 12" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="indirizzo">Indirizzo</Label>
          <Input id="indirizzo" value={form.indirizzo} onChange={update("indirizzo")} placeholder="Via Roma 12" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="comune">Comune</Label>
          <Input id="comune" value={form.comune} onChange={update("comune")} placeholder="Milano" required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="data_inizio">Data inizio</Label>
            <Input id="data_inizio" type="date" value={form.data_inizio} onChange={update("data_inizio")} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="data_fine">Data fine prevista</Label>
            <Input id="data_fine" type="date" value={form.data_fine} onChange={update("data_fine")} />
          </div>
        </div>
        <Button type="submit">Crea cantiere</Button>
      </form>
    </div>
  );
}
