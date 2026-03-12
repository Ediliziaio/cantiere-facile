import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Calendar, Receipt, Building2, Mail, FileSpreadsheet, Cloud } from "lucide-react";

const integrations = [
  { icon: Receipt, name: "Fatture in Cloud", desc: "Sincronizza fatture e pagamenti" },
  { icon: Building2, name: "INAIL / INPS", desc: "Verifica DURC e posizioni contributive" },
  { icon: Calendar, name: "Google Calendar", desc: "Sincronizza scadenze e appuntamenti" },
  { icon: Mail, name: "PEC & Email", desc: "Invio comunicazioni certificate" },
  { icon: FileSpreadsheet, name: "Export Excel/CSV", desc: "Esporta dati in qualsiasi formato" },
  { icon: Cloud, name: "API aperte", desc: "Integra con il tuo gestionale" },
];

export default function IntegrationsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="py-20 md:py-28 bg-white" ref={ref}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[hsl(25,95%,53%)]/20 text-[hsl(25,95%,53%)] text-sm font-landing-body font-medium mb-4">
            🔗 Integrazioni
          </span>
          <h2 className="font-landing-heading font-bold text-3xl md:text-4xl text-[hsl(20,14%,8%)]">
            Si integra con i tuoi strumenti.
          </h2>
          <p className="mt-3 font-landing-body text-[hsl(25,5%,45%)] text-lg max-w-xl mx-auto">
            Connetti Cantiere in Cloud ai software che già usi. Nessuna doppia digitazione.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {integrations.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group flex items-start gap-4 bg-[#FAFAF9] hover:bg-white rounded-xl border border-[hsl(30,6%,90%)] hover:border-[hsl(25,95%,53%)]/20 p-5 transition-all hover:shadow-sm"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[hsl(25,95%,53%)]/10 group-hover:bg-[hsl(25,95%,53%)]/15 transition-colors shrink-0">
                <item.icon className="h-5 w-5 text-[hsl(25,95%,53%)]" />
              </div>
              <div>
                <div className="font-landing-body font-semibold text-sm text-[hsl(20,14%,8%)]">{item.name}</div>
                <div className="font-landing-body text-xs text-[hsl(25,5%,45%)] mt-0.5">{item.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
