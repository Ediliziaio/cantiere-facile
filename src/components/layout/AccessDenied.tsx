import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
        <ShieldX className="h-8 w-8 text-destructive" />
      </div>
      <h1 className="text-xl font-bold text-foreground">Accesso negato</h1>
      <p className="text-muted-foreground max-w-md">
        Non hai i permessi per accedere a questa sezione. Contatta un amministratore se ritieni sia un errore.
      </p>
      <Button onClick={() => navigate("/app/dashboard")} variant="default">
        Torna alla Dashboard
      </Button>
    </div>
  );
}
