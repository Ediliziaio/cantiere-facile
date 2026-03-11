import { motion, useSpring, useMotionValue } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Star } from "lucide-react";
import { useEffect } from "react";

const testimonials = [
  {
    text: "Prima avevamo una cartella su Drive con 400 PDF. Nessuno sapeva cosa era aggiornato e cosa no. Ora il sistema ci avvisa 30 giorni prima di ogni scadenza. L'ultima ispezione è andata liscia.",
    name: "Marco R.",
    title: "Titolare",
    company: "Rossi Costruzioni S.r.l., Milano",
  },
  {
    text: "Il controllo accessi geolocalizzato ci ha salvato due volte. La prima con l'ASL, la seconda con un subappaltatore che dichiarava ore non fatte. I log non mentono.",
    name: "Giuseppe V.",
    title: "Direttore Lavori",
    company: "Edilmaster Group, Bergamo",
  },
  {
    text: "La firma digitale ha cambiato tutto. I verbali di collaudo vengono firmati lo stesso giorno. Prima aspettavo settimane. Ora ho un PDF con certificato pronto in 5 minuti.",
    name: "Lucia B.",
    title: "Responsabile Sicurezza",
    company: "GEC Lombarda, Brescia",
  },
];

const stats = [
  { label: "cantieri gestiti", value: 500, prefix: "", suffix: "+" },
  { label: "documenti archiviati", value: 120000, prefix: "", suffix: "+" },
  { label: "firme digitali", value: 8000, prefix: "", suffix: "+" },
  { label: "media recensioni", value: 4.9, prefix: "", suffix: "/5" },
];

function CountUp({ target, inView }: { target: number; inView: boolean }) {
  const count = useMotionValue(0);
  const spring = useSpring(count, { stiffness: 50, damping: 20 });
  
  useEffect(() => {
    if (inView) count.set(target);
  }, [inView, target, count]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (v) => {
      const el = document.getElementById(`stat-${target}`);
      if (el) {
        el.textContent = target >= 1000 ? Math.round(v).toLocaleString("it-IT") : v.toFixed(target % 1 !== 0 ? 1 : 0);
      }
    });
    return unsubscribe;
  }, [spring, target]);

  return <span id={`stat-${target}`}>0</span>;
}

export default function TestimonialsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <section className="py-20 md:py-28 bg-[#0F0E0D]" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="font-landing-heading font-bold text-3xl md:text-4xl text-white">
            Non crederci sulla parola.
          </h2>
          <p className="mt-3 font-landing-body text-[hsl(30,6%,50%)] text-lg">
            Queste sono le parole di chi ha già smesso di gestire i cantieri su WhatsApp.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="bg-[#1A1918] rounded-xl p-6 border border-transparent hover:border-[hsl(25,95%,53%)]/20 transition-colors"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-[hsl(38,92%,50%)] text-[hsl(38,92%,50%)]" />
                ))}
              </div>
              <p className="font-landing-body text-sm text-[hsl(30,6%,75%)] leading-relaxed mb-5">"{t.text}"</p>
              <div>
                <div className="font-landing-body font-semibold text-white text-sm">{t.name}, {t.title}</div>
                <div className="font-landing-body text-xs text-[hsl(30,6%,50%)]">{t.company}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats row */}
        <div ref={statsRef} className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <div className="font-landing-heading font-bold text-3xl md:text-4xl text-white">
                {s.prefix}<CountUp target={s.value} inView={statsInView} />{s.suffix}
              </div>
              <div className="font-landing-body text-sm text-[hsl(30,6%,50%)] mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
