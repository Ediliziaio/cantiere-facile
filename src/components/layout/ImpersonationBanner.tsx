import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ImpersonationBanner() {
  const { impersonation, stopImpersonation } = useAuth();
  const navigate = useNavigate();

  if (!impersonation.isImpersonating) return null;

  const handleExit = () => {
    stopImpersonation();
    navigate("/superadmin/aziende");
  };

  return (
    <div className="fixed top-0 inset-x-0 z-[9999] h-10 bg-primary flex items-center justify-between px-4">
      <div className="flex items-center gap-2 text-primary-foreground text-sm font-medium">
        <Eye className="h-4 w-4" />
        <span>Modalità visualizzazione: stai navigando come <strong>{impersonation.tenantName}</strong></span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="text-primary-foreground hover:bg-primary-foreground/20 h-7 text-xs"
        onClick={handleExit}
      >
        <ArrowLeft className="h-3.5 w-3.5 mr-1" />
        Torna al SuperAdmin
      </Button>
    </div>
  );
}
