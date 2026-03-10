import { HardHat, Shield, FileText, Users, CalendarClock, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const features = [
  { icon: FileText, title: "Gestione Documenti", desc: "Carica, organizza e monitora tutti i documenti di cantiere in un unico posto." },
  { icon: Shield, title: "Conformità Automatica", desc: "Checklist automatiche per subappaltatori, lavoratori e mezzi d'opera." },
  { icon: CalendarClock, title: "Scadenze sotto Controllo", desc: "Notifiche automatiche per documenti in scadenza a 30, 7 e 1 giorno." },
  { icon: Users, title: "Portale Subappaltatori", desc: "Link dedicato per ogni subappaltatore: carica documenti senza account." },
  { icon: Building2, title: "Multi-cantiere", desc: "Gestisci più cantieri contemporaneamente con una vista unificata." },
  { icon: HardHat, title: "Accessi Cantiere", desc: "Check-in/out tramite QR code. Registro accessi sempre aggiornato." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardHat className="h-6 w-6 text-primary" />
            <span className="font-heading font-bold text-lg text-foreground">Cantiere in Cloud</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Accedi</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/register">Inizia gratis</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="max-w-2xl">
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-foreground leading-tight">
            La sicurezza del tuo cantiere,
            <br />
            <span className="text-primary">sempre sotto controllo.</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Gestisci documenti, subappaltatori, scadenze e accessi di cantiere in un'unica piattaforma cloud. Pensata per imprese edili, general contractor e installatori.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <Button size="lg" asChild>
              <Link to="/register">
                Inizia gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/login">Accedi</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="font-heading font-bold text-2xl text-foreground mb-8">
            Tutto quello che serve per il tuo cantiere
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="border border-border rounded-lg p-5">
                <f.icon className="h-5 w-5 text-primary mb-3" />
                <h3 className="font-heading font-semibold text-sm text-foreground mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>© 2026 Cantiere in Cloud</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Termini</a>
            <a href="#" className="hover:text-foreground">Contatti</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
