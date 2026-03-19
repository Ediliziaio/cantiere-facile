import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import logoLight from "@/assets/logo-light.png";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ azienda: "", piva: "", nome: "", email: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(
      { id: "u-new", email: form.email, nome: form.nome, cognome: "" },
      "admin",
      "t-new",
      form.azienda
    );
    navigate("/app/dashboard");
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <img src={logoLight} alt="Cantiere in Cloud" className="h-9" />
        </div>

        <h1 className="font-heading font-bold text-2xl text-foreground mb-1">Crea il tuo account</h1>
        <p className="text-sm text-muted-foreground mb-6">Registra la tua impresa e inizia a gestire i tuoi cantieri.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="azienda">Ragione Sociale</Label>
            <Input id="azienda" value={form.azienda} onChange={update("azienda")} placeholder="Rossi Costruzioni S.r.l." required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="piva">Partita IVA</Label>
            <Input id="piva" value={form.piva} onChange={update("piva")} placeholder="IT01234567890" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nome">Nome e Cognome</Label>
            <Input id="nome" value={form.nome} onChange={update("nome")} placeholder="Mario Rossi" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={form.email} onChange={update("email")} placeholder="nome@azienda.it" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={form.password} onChange={update("password")} placeholder="••••••••" required />
          </div>
          <Button type="submit" className="w-full">Crea account</Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Hai già un account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">Accedi</Link>
        </p>
      </div>
    </div>
  );
}
