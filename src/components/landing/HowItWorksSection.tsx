import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Upload, Users, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Crei il cantiere",
    desc: "Aggiungi nome, indirizzo e delimita il perimetro sulla mappa. Inviti i tuoi subappaltatori via email — caricano i documenti da soli.",
  },
  {
    icon: Users,
    title: "Gestisci le persone",
    desc: "Il sistema genera le checklist automaticamente. Ogni lavoratore ha il suo tesserino QR. Gli accessi vengono registrati con GPS.",
  },
  {
    icon: CheckCircle,
    title: "Sei sempre in regola",
    desc: "Scadenze, alert, firme digitali e report pronti. Se arriva l'ASL, hai tutto in ordine in 30 secondi.",
  },
];

export default function HowItWorksSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="py-20 md:py-28 bg-[#FAFAF9]" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <h2 className="font-landing-heading font-bold text-3xl md:text-4xl text-[hsl(20,14%,8%)]">
            Operativo in 15 minuti.
          </h2>
          <p className="mt-3 font-landing-body text-[hsl(25,5%,45%)] text-lg">
            Non serve formazione. Non serve un tecnico. Lo configuri tu, oggi.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting dotted line (desktop) */}
          <div className="hidden md:block absolute top-10 left-[16.5%] right-[16.5%] border-t-2 border-dashed border-[hsl(30,6%,85%)]" />

          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="text-center relative z-10"
            >
              <div className="w-20 h-20 rounded-2xl bg-white shadow-md border border-[hsl(30,6%,90%)] flex items-center justify-center mx-auto mb-5">
                <s.icon className="h-8 w-8 text-[hsl(25,95%,53%)]" />
              </div>
              <div className="text-sm font-landing-body font-semibold text-[hsl(25,95%,53%)] mb-1">
                Step {i + 1}
              </div>
              <h3 className="font-landing-heading font-bold text-lg text-[hsl(20,14%,8%)] mb-2">{s.title}</h3>
              <p className="font-landing-body text-sm text-[hsl(25,5%,45%)] leading-relaxed max-w-xs mx-auto">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
