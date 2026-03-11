import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";
import { Shield, Heart, Eye, Zap } from "lucide-react";

const stats = [
  { value: "10+", label: "Anni di esperienza nel settore edile" },
  { value: "500+", label: "Cantieri gestiti sulla piattaforma" },
  { value: "15.000+", label: "Documenti verificati ogni mese" },
  { value: "99,9%", label: "Uptime garantito della piattaforma" },
];

const values = [
  {
    icon: Shield,
    title: "Sicurezza prima di tutto",
    description: "Ogni funzionalità è progettata per ridurre il rischio e proteggere le persone in cantiere.",
  },
  {
    icon: Eye,
    title: "Trasparenza totale",
    description: "Nessun costo nascosto, nessun vincolo. Sai sempre cosa paghi e cosa ottieni.",
  },
  {
    icon: Heart,
    title: "Costruito con passione",
    description: "Siamo nati nei cantieri. Conosciamo i problemi perché li abbiamo vissuti in prima persona.",
  },
  {
    icon: Zap,
    title: "Semplicità radicale",
    description: "Tecnologia complessa resa semplice. Se non lo usa il capocantiere, non funziona.",
  },
];

export default function ChiSiamo() {
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [valuesRef, valuesInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div className="font-landing-body">
      <LandingNavbar />

      {/* Hero */}
      <section className="relative bg-[#0F0E0D] pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[hsl(25,95%,53%)]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-32 right-[10%] w-8 h-8 border border-[hsl(25,95%,53%)]/20 rounded rotate-12 hidden md:block" />
        <div className="absolute bottom-20 left-[15%] w-6 h-6 border border-white/10 rounded rotate-45 hidden md:block" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-1 bg-[hsl(25,95%,53%)] rounded-full mx-auto mb-8" />
            <h1 className="font-landing-heading font-bold text-4xl md:text-5xl text-white leading-tight">
              Odiamo i cantieri fuori controllo.
            </h1>
            <p className="mt-6 text-lg text-[hsl(30,6%,60%)] leading-relaxed max-w-2xl mx-auto">
              Per questo abbiamo costruito la piattaforma che avremmo voluto avere noi stessi.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="py-20 md:py-28 bg-[#FAFAF9]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="space-y-5 text-base text-[hsl(25,5%,45%)] leading-relaxed">
            <p>
              Ogni anno in Italia migliaia di imprese edili ricevono sanzioni evitabili.
              Documenti scaduti, accessi non tracciati, firme mancanti, verbali persi.
            </p>
            <p>
              Non per negligenza — ma per mancanza di strumenti adeguati.
            </p>
            <p>
              Cantiere in Cloud nasce da chi i cantieri li conosce dall'interno.
              La nostra missione è semplice: <strong className="text-[hsl(20,14%,8%)]">nessuna impresa edile dovrebbe perdere una gara,
              ricevere una multa o rischiare un incidente per un problema di gestione documentale.</strong>
            </p>
            <p>
              Abbiamo parlato con decine di imprese, capocantieri, responsabili sicurezza.
              Abbiamo visto i faldoni, i fogli Excel, le chat WhatsApp usate come archivio.
              E abbiamo deciso che era ora di cambiare.
            </p>
            <p className="text-[hsl(20,14%,8%)] font-semibold text-lg">
              Il cantiere sicuro non è un optional. È il minimo sindacale.
            </p>
            <p>Noi ti diamo gli strumenti per arrivarci.</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 md:py-24 bg-[#0F0E0D]" ref={statsRef}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="font-landing-heading font-bold text-4xl md:text-5xl text-[hsl(25,95%,53%)]">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-[hsl(30,6%,60%)]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-28 bg-white" ref={valuesRef}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            className="font-landing-heading font-bold text-3xl md:text-4xl text-[hsl(20,14%,8%)] text-center mb-12"
          >
            I nostri valori
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-[hsl(25,95%,53%)]/10 flex items-center justify-center shrink-0">
                  <v.icon className="h-6 w-6 text-[hsl(25,95%,53%)]" />
                </div>
                <div>
                  <h3 className="font-landing-heading font-bold text-lg text-[hsl(20,14%,8%)]">{v.title}</h3>
                  <p className="mt-1 text-sm text-[hsl(25,5%,45%)] leading-relaxed">{v.description}</p>
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
            Pronto a portare il tuo cantiere nel futuro?
          </h2>
          <p className="mt-4 text-[hsl(30,6%,60%)]">
            Inizia gratis oggi. Nessuna carta di credito richiesta.
          </p>
          <Button
            size="lg"
            asChild
            className="mt-8 rounded-full bg-[hsl(25,95%,53%)] hover:bg-[hsl(25,95%,48%)] text-white font-landing-body px-8"
          >
            <Link to="/register">Inizia gratis</Link>
          </Button>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
