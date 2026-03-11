import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import { FileText, CreditCard, MapPin, PenTool, MessageSquare, Truck, ArrowRight, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";

const features = [
  {
    icon: FileText,
    title: "Gestione Documenti",
    description: "Carica, organizza e monitora tutti i documenti di cantiere in un'unica dashboard. Alert automatici 30, 15 e 7 giorni prima della scadenza. Addio DURC scaduti e sanzioni da €12.000.",
    href: "/funzionalita/documenti",
  },
  {
    icon: CreditCard,
    title: "Tesserini Digitali",
    description: "Badge digitali con QR code univoco per ogni lavoratore. Scansionabili da qualsiasi smartphone. Conformi alla normativa vigente, pronti in 60 secondi.",
    href: "/funzionalita/tesserini",
  },
  {
    icon: MapPin,
    title: "Accessi Geolocalizzati",
    description: "Check-in e check-out tramite QR code con verifica GPS integrata. Sai chi è in cantiere in tempo reale. Registro presenze digitale con valore probatorio.",
    href: "/funzionalita/accessi",
  },
  {
    icon: PenTool,
    title: "Firma Digitale",
    description: "Firma verbali, collaudi, autorizzazioni e POS in 60 secondi. Valida ai sensi del CAD (D.Lgs. 82/2005). Inclusa in tutti i piani, senza costi per firma.",
    href: "/funzionalita/firma",
  },
  {
    icon: MessageSquare,
    title: "Comunicazioni Tracciate",
    description: "Chat per cantiere con timestamp, allegati e archivio completo. Ogni messaggio ha valore documentale. Sostituisce WhatsApp con qualcosa di legalmente valido.",
    href: "/funzionalita/comunicazioni",
  },
  {
    icon: Truck,
    title: "Gestione Veicoli",
    description: "Anagrafica mezzi completa con scadenze assicurazione, revisione e tagliando. Alert automatici. Mai più un mezzo fermo per documenti scaduti.",
    href: "/funzionalita/veicoli",
  },
];

const comparison = [
  { before: "Documenti sparsi tra email, WhatsApp e cartelle condivise", after: "Dashboard unica con ricerca istantanea e filtri" },
  { before: "Presenze segnate a mano su foglio cartaceo", after: "Check-in GPS automatico via QR code" },
  { before: "Firme raccolte via email con scansioni illeggibili", after: "Firma digitale in 60 secondi dallo smartphone" },
  { before: "Scadenze dimenticate → sanzioni e blocchi cantiere", after: "Alert automatici 30/15/7 giorni prima" },
  { before: "Nessuna visibilità su chi è realmente in cantiere", after: "Mappa presenze in tempo reale" },
  { before: "Comunicazioni perse in chat personali", after: "Chat tracciate con valore documentale" },
];

export default function FunzionalitaOverview() {
  const [gridRef, gridInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [compRef, compInView] = useInView({ triggerOnce: true, threshold: 0.1 });

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
            <p className="mt-4 text-lg text-[hsl(30,6%,60%)] max-w-2xl mx-auto">
              Gestione documenti, tesserini digitali, accessi GPS, firma digitale, comunicazioni tracciate, veicoli.
              Un software per cantiere che sostituisce Excel, WhatsApp e i faldoni.
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

      {/* Prima e Dopo */}
      <section className="py-20 md:py-28 bg-white" ref={compRef}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={compInView ? { opacity: 1, y: 0 } : {}}
            className="font-landing-heading font-bold text-3xl md:text-4xl text-[hsl(20,14%,8%)] text-center mb-4"
          >
            Il prima e dopo
          </motion.h2>
          <p className="text-center text-[hsl(25,5%,45%)] mb-12 max-w-xl mx-auto">
            Ecco cosa cambia quando passi a Cantiere in Cloud.
          </p>

          <div className="rounded-xl border border-[hsl(30,6%,90%)] overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-2 bg-[hsl(30,6%,97%)]">
              <div className="px-5 py-3 text-sm font-semibold text-[hsl(25,5%,45%)] border-r border-[hsl(30,6%,90%)]">
                ❌ Senza Cantiere in Cloud
              </div>
              <div className="px-5 py-3 text-sm font-semibold text-[hsl(25,95%,53%)]">
                ✅ Con Cantiere in Cloud
              </div>
            </div>
            {/* Rows */}
            {comparison.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={compInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="grid grid-cols-2 border-t border-[hsl(30,6%,90%)]"
              >
                <div className="px-5 py-4 text-sm text-[hsl(25,5%,45%)] border-r border-[hsl(30,6%,90%)] flex items-start gap-2">
                  <X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  {row.before}
                </div>
                <div className="px-5 py-4 text-sm text-[hsl(20,14%,8%)] font-medium flex items-start gap-2">
                  <Check className="h-4 w-4 text-[hsl(142,71%,45%)] shrink-0 mt-0.5" />
                  {row.after}
                </div>
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
            I tuoi concorrenti lo stanno già usando. Tu?
          </h2>
          <p className="mt-4 text-[hsl(30,6%,60%)]">
            Inizia gratis oggi. Setup in 15 minuti. Nessuna carta di credito.
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
