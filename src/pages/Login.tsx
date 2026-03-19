import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import logoLight from "@/assets/logo-light.png";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(
      { id: "u1", email: email || "admin@rossicostruzioni.it", nome: "Marco", cognome: "Rossi" },
      "admin",
      "t1",
      "Rossi Costruzioni S.r.l."
    );
    navigate("/app/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <img src={logoLight} alt="Cantiere in Cloud" className="h-9" />
        </div>

        <h1 className="font-heading font-bold text-2xl text-foreground mb-1">Accedi</h1>
        <p className="text-sm text-muted-foreground mb-6">Inserisci le tue credenziali per accedere alla piattaforma.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nome@azienda.it" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <Button type="submit" className="w-full">Accedi</Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Non hai un account?{" "}
          <Link to="/register" className="text-primary font-medium hover:underline">Registrati</Link>
        </p>
      </div>
    </div>
  );
}
