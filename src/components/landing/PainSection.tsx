import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const pains = [
  {
    emoji: "📋",
    title: "Il documento",
    text: "Il subappaltatore arriva in cantiere. I suoi documenti sono scaduti da 3 settimane. Lo scopri solo quando è già dentro. L'ASL arriva e tu paghi la multa.",
  },
  {
    emoji: "📍",
    title: "L'accesso",
    text: "Non sai chi è entrato stamattina. Non sai chi è uscito. Non sai quante ore ha fatto ciascuno. Se succede un incidente, non hai i dati. Il problema è tuo.",
  },
  {
    emoji: "✍️",
    title: "La firma",
    text: "Hai mandato il verbale di collaudo per email. Nessuno lo ha firmato. Vai in tribunale con un PDF non firmato. Buona fortuna.",
  },
];

export default function PainSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="bg-[#0F0E0D] py-20 md:py-28" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="font-landing-heading font-bold text-2xl md:text-4xl text-white mb-12 text-center"
        >
          Ogni giorno in cantiere succede questo.
        </motion.h2>

        <div className="grid gap-5 md:grid-cols-3">
          {pains.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30, rotate: 2, scale: 0.97 }}
              animate={inView ? { opacity: 1, y: 0, rotate: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-[#1A1918] border-l-4 border-[hsl(25,95%,53%)] rounded-lg p-6"
            >
              <div className="text-2xl mb-3">{p.emoji}</div>
              <h3 className="font-landing-heading font-bold text-white text-lg mb-2">{p.title}</h3>
              <p className="font-landing-body text-[hsl(30,6%,60%)] text-sm leading-relaxed">{p.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-10 text-center font-landing-body text-[hsl(30,6%,50%)] text-sm max-w-2xl mx-auto"
        >
          Questi non sono casi rari. Sono la normalità per chi gestisce cantieri senza il sistema giusto.
        </motion.p>
      </div>
    </section>
  );
}
