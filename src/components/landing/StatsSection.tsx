import { motion, useSpring, useMotionValue } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const stats = [
  { value: 78, suffix: "%", prefix: "", label: "delle sanzioni edili è per documentazione non conforme", source: "Dati INAIL 2024" },
  { value: 18500, suffix: "", prefix: "€", label: "multa media per irregolarità in cantiere", source: "Ispettorato Nazionale del Lavoro" },
  { value: 3, suffix: " ore", prefix: "", label: "risparmiate a settimana con gestione digitale", source: "Media utenti Cantiere in Cloud" },
  { value: 60, suffix: " sec", prefix: "", label: "per una firma digitale vs 5 giorni per una cartacea", source: "Benchmark interno" },
];

function CountUp({ target, inView }: { target: number; inView: boolean }) {
  const count = useMotionValue(0);
  const spring = useSpring(count, { stiffness: 80, damping: 25 });

  useEffect(() => {
    if (inView) count.set(target);
  }, [inView, target, count]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (v) => {
      const el = document.getElementById(`stats-counter-${target}`);
      if (el) {
        el.textContent = target >= 1000
          ? Math.round(v).toLocaleString("it-IT")
          : v.toFixed(target % 1 !== 0 ? 1 : 0);
      }
    });
    return unsubscribe;
  }, [spring, target]);

  return <span id={`stats-counter-${target}`}>0</span>;
}

export default function StatsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-20 md:py-28 bg-[#0F0E0D] relative overflow-hidden" ref={ref}>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[hsl(25,95%,53%)]/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="font-landing-heading font-bold text-3xl md:text-4xl text-white">
            Numeri che contano
          </h2>
          <p className="mt-4 text-[hsl(30,6%,60%)] max-w-xl mx-auto">
            Non sono opinioni. Sono dati. E dicono tutti la stessa cosa: la gestione manuale costa troppo.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <p className="font-landing-heading font-bold text-3xl md:text-4xl text-[hsl(25,95%,53%)] mb-2">
                {s.prefix}<CountUp target={s.value} inView={inView} />{s.suffix}
              </p>
              <p className="text-sm text-white/80 mb-1">{s.label}</p>
              <p className="text-xs text-white/40">{s.source}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
