import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import { FileText, CreditCard, MapPin, PenTool, MessageSquare, Truck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";

const features = [
  {
    icon: FileText,
    title: "Gestione Documenti",
    description: "Carica, organizza e monitora tutti i documenti di cantiere. Alert automatici per le scadenze.",
    href: "/funzionalita/documenti",
  },
  {
    icon: CreditCard,
    title: "Tesserini Digitali",
    description: "Badge digitali con QR code per ogni lavoratore. Scansionabili da qualsiasi smartphone.",
    href: "/funzionalita/tesserini",
  },
  {
    icon: MapPin,
    title: "Accessi Geolocalizzati",
    description: "Check-in/out via QR con verifica GPS. Sai chi è in cantiere in tempo reale.",
    href: "/funzionalita/accessi",
  },
  {
    icon: PenTool,
    title: "Firma Digitale",
    description: "Firma verbali, collaudi e autorizzazioni in 60 secondi. Valida ai sensi del CAD.",
    href: "/funzionalita/firma",
  },
  {
    icon: MessageSquare,
    title: "Comunicazioni Tracciate",
    description: "Chat per cantiere con timestamp e archivio. Ogni messaggio vale come documento.",
    href: "/funzionalita/comunicazioni",
  },
  {
    icon: Truck,
    title: "Gestione Veicoli",
    description: "Anagrafica mezzi completa con scadenze assicurazione e revisione automatiche.",
    href: "/funzionalita/veicoli",
  },
];

export default function FunzionalitaOverview() {
  const [gridRef, gridInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div className="font-landing-body">
      <LandingNavbar />

      {/* Hero */}
      <section className="relative bg-[#0F0E0D] pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[hsl(25,95%,53%)]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-32 right-[10%] w-8 h-8 border border-[hsl(25,95%,53%)]/20 rounded rotate-12 hidden md:block" />
        <div className="absolute bottom-20 left-[15%] w-6 h-6 border border-white/10 rounded rotate-45 hidden md:block" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-xs font-semibold uppercase tracking-widest text-[hsl(25,95%,53%)]">La piattaforma</span>
            <h1 className="mt-4 font-landing-heading font-bold text-4xl md:text-5xl text-white leading-tight">
              Una piattaforma. Tutto sotto controllo.
            </h1>
            <p className="mt-4 text-lg text-[hsl(30,6%,60%)]">
              Sei moduli integrati per gestire ogni aspetto del tuo cantiere in sicurezza.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="py-20 md:py-28 bg-[#FAFAF9]" ref={gridRef}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={gridInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link
                  to={f.href}
                  className="group block bg-white rounded-xl border border-[hsl(30,6%,90%)] p-6 hover:shadow-lg hover:border-[hsl(25,95%,53%)]/30 transition-all h-full"
                >
                  <div className="w-12 h-12 rounded-xl bg-[hsl(25,95%,53%)]/10 flex items-center justify-center mb-4 group-hover:bg-[hsl(25,95%,53%)]/20 transition-colors">
                    <f.icon className="h-6 w-6 text-[hsl(25,95%,53%)]" />
                  </div>
                  <h3 className="font-landing-heading font-bold text-lg text-[hsl(20,14%,8%)] mb-2">{f.title}</h3>
                  <p className="text-sm text-[hsl(25,5%,45%)] leading-relaxed mb-4">{f.description}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-[hsl(25,95%,53%)] group-hover:gap-2 transition-all">
                    Scopri di più <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24 bg-[#0F0E0D] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[hsl(25,95%,53%)]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-landing-heading font-bold text-3xl md:text-4xl text-white">
            Pronto a digitalizzare il tuo cantiere?
          </h2>
          <p className="mt-4 text-[hsl(30,6%,60%)]">
            Inizia gratis oggi. Setup in 15 minuti.
          </p>
          <Button
            size="lg"
            asChild
            className="mt-8 rounded-full bg-[hsl(25,95%,53%)] hover:bg-[hsl(25,95%,48%)] text-white px-8"
          >
            <Link to="/register">Prova gratis</Link>
          </Button>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
