import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { mockSuperAdmin } from "@/data/mock-superadmin";

export default function SuperAdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(
      { id: mockSuperAdmin.id, email: mockSuperAdmin.email, nome: "Platform", cognome: "Admin" },
      "superadmin",
      null,
      null
    );
    navigate("/superadmin/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8">
          <Shield className="h-7 w-7 text-superadmin" />
          <span className="font-heading font-bold text-xl text-foreground">SuperAdmin</span>
        </div>

        <h1 className="font-heading font-bold text-2xl text-foreground mb-1">Accesso Piattaforma</h1>
        <p className="text-sm text-muted-foreground mb-6">Riservato agli amministratori della piattaforma.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@cantiereincloud.it" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <Button type="submit" className="w-full bg-superadmin hover:bg-superadmin/90">Accedi</Button>
        </form>
      </div>
    </div>
  );
}
