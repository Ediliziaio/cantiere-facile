import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight, Clock, ShieldAlert, FileX, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const kpis = [
  {
    icon: Clock,
    label: "Tempo gestione documentale",
    before: "12h/settimana",
    after: "2h/settimana",
  },
  {
    icon: ShieldAlert,
    label: "Sanzioni e verbali",
    before: "2/anno",
    after: "0/anno",
  },
  {
    icon: FileX,
    label: "Documenti smarriti",
    before: "1-2/mese",
    after: "0/mese",
  },
  {
    icon: Search,
    label: "Tempo risposta ispettore",
    before: "45 min",
    after: "3 min",
  },
];

export default function CaseStudySection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-20 md:py-28 bg-[#0F0E0D]" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block font-landing-body text-xs font-semibold tracking-widest uppercase text-[hsl(25,95%,53%)] mb-3">
            Case Study
          </span>
          <h2 className="font-landing-heading font-bold text-3xl md:text-4xl text-white">
            Da €15.000 di sanzioni a zero rischi
          </h2>
          <p className="mt-4 font-landing-body text-[hsl(30,6%,50%)] max-w-2xl mx-auto">
            Come Rossi Costruzioni S.r.l. ha eliminato sanzioni, ritardi e documenti persi in 3 mesi.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Story column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#1A1918] rounded-xl p-6 md:p-8 border border-white/5"
          >
            <div className="mb-6">
              <h3 className="font-landing-heading font-bold text-xl text-white mb-1">
                Rossi Costruzioni S.r.l.
              </h3>
              <p className="font-landing-body text-sm text-[hsl(30,6%,50%)]">
                Impresa edile — Milano • 45 dipendenti • 8 cantieri attivi
              </p>
            </div>

            <div className="space-y-4 font-landing-body text-sm text-[hsl(30,6%,70%)] leading-relaxed">
              <p>
                <span className="font-semibold text-white">Il problema:</span> gestione documentale su WhatsApp e cartelle condivise. Due ispezioni ASL in un anno, entrambe con verbali per documentazione incompleta. Costo totale: oltre €15.000.
              </p>
              <p>
                <span className="font-semibold text-white">La svolta:</span> in 3 mesi con Cantiere in Cloud, tutti i documenti centralizzati, scadenze monitorate automaticamente, accessi tracciati con geolocalizzazione.
              </p>
              <p>
                <span className="font-semibold text-white">Il risultato:</span> terza ispezione superata senza rilievi. Zero sanzioni nell'ultimo anno. Il team risparmia 10 ore a settimana.
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="font-landing-body text-sm italic text-[hsl(30,6%,75%)]">
                "Prima ogni ispezione era un'emergenza. Ora apro il tablet e mostro tutto in 3 minuti. L'ispettore ci ha fatto i complimenti."
              </p>
              <p className="font-landing-body text-sm font-semibold text-white mt-3">
                — Marco Rossi, Titolare
              </p>
            </div>
          </motion.div>

          {/* KPI column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            {kpis.map((kpi, i) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                className="bg-[#1A1918] rounded-xl p-5 border border-white/5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <kpi.icon className="h-5 w-5 text-[hsl(25,95%,53%)]" />
                  <span className="font-landing-body text-sm font-medium text-white">
                    {kpi.label}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-landing-heading font-bold text-lg text-red-400/80 line-through">
                    {kpi.before}
                  </span>
                  <ArrowRight className="h-4 w-4 text-white/20 shrink-0" />
                  <span className="font-landing-heading font-bold text-lg text-[hsl(25,95%,53%)]">
                    {kpi.after}
                  </span>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.8 }}
              className="pt-4"
            >
              <Button
                size="lg"
                className="w-full bg-[hsl(25,95%,53%)] hover:bg-[hsl(25,95%,48%)] text-white font-landing-body font-semibold"
                onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
              >
                Vuoi risultati simili? Inizia gratis
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
