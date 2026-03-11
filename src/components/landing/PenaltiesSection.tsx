import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { AlertTriangle, ShieldOff, Gavel } from "lucide-react";

const penalties = [
  {
    icon: AlertTriangle,
    value: "€12.000 – €30.000",
    title: "Sanzione per documentazione non conforme",
    description: "DURC scaduto, POS mancante, idoneità sanitaria assente. Art. 90 D.Lgs. 81/2008: la sanzione è immediata e non negoziabile. Un singolo documento mancante può costare più di un anno di software.",
  },
  {
    icon: ShieldOff,
    value: "Blocco cantiere",
    title: "Sospensione immediata dei lavori",
    description: "Lavoratori non tracciati, accessi non registrati, irregolarità formali. L'ispettorato può sospendere il cantiere in giornata. Ogni giorno di fermo costa migliaia di euro tra ritardi, penali contrattuali e manodopera ferma.",
  },
  {
    icon: Gavel,
    value: "Da 3 a 7 anni",
    title: "Responsabilità penale del datore di lavoro",
    description: "In caso di incidente con documentazione incompleta o assente, il responsabile della sicurezza rischia la reclusione. Non è teoria: succede ogni settimana nei tribunali italiani. La documentazione è la tua prima difesa legale.",
  },
];

export default function PenaltiesSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-20 md:py-28 bg-[#0F0E0D] relative overflow-hidden" ref={ref}>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-red-400">Rischi concreti</span>
          <h2 className="mt-4 font-landing-heading font-bold text-3xl md:text-4xl text-white">
            Il costo dell'improvvisazione
          </h2>
          <p className="mt-4 text-[hsl(30,6%,60%)] max-w-2xl mx-auto">
            Gestire un cantiere senza un sistema digitale non è "fare le cose come si è sempre fatto". È un rischio calcolabile — e i numeri non sono dalla tua parte.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {penalties.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm"
            >
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
                <p.icon className="h-5 w-5 text-red-400" />
              </div>
              <p className="font-landing-heading font-bold text-2xl md:text-3xl text-[hsl(25,95%,53%)] mb-2">
                {p.value}
              </p>
              <h3 className="font-landing-heading font-bold text-base text-white mb-2">{p.title}</h3>
              <p className="text-sm text-[hsl(30,6%,60%)] leading-relaxed">{p.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
