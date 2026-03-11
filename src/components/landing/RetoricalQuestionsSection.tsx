import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const questions = [
  {
    question: "Sai quanti documenti scadono questo mese?",
    detail: "Se la risposta è no, stai lavorando alla cieca. Un DURC scaduto da un giorno è un DURC non valido. E la sanzione è la stessa che avresti con un documento scaduto da un anno.",
  },
  {
    question: "Sai chi è in cantiere adesso?",
    detail: "Non chi dovrebbe esserci. Chi c'è davvero. Se arriva un'ispezione e non puoi dimostrarlo in tempo reale, il problema è tuo.",
  },
  {
    question: "I tuoi verbali sono firmati e archiviati?",
    detail: "Un verbale di sopralluogo non firmato non ha valore legale. Un verbale firmato ma non archiviato è come se non esistesse. In caso di contenzioso, devi produrlo in minuti, non in giorni.",
  },
  {
    question: "Cosa succede se arriva un'ispezione tra 10 minuti?",
    detail: "Riesci a produrre: lista lavoratori presenti, DURC aggiornati, idoneità sanitarie, POS firmato, registro accessi? Se la risposta è 'ci provo', non è abbastanza.",
  },
  {
    question: "I tuoi subappaltatori hanno i documenti in regola?",
    detail: "La responsabilità solidale significa che se il tuo subappaltatore non è in regola, la sanzione arriva anche a te. Art. 26 D.Lgs. 81/2008: il committente è corresponsabile.",
  },
];

export default function RetoricalQuestionsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-20 md:py-28 bg-white" ref={ref}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="font-landing-heading font-bold text-3xl md:text-4xl text-[hsl(20,14%,8%)]">
            Le domande che dovresti farti
          </h2>
          <p className="mt-4 text-[hsl(25,5%,45%)] max-w-xl mx-auto">
            Se non sai rispondere a queste domande in meno di 30 secondi, hai un problema di controllo. E i problemi di controllo si pagano.
          </p>
        </motion.div>

        <div className="space-y-5">
          {questions.map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-[#FAFAF9] border border-[hsl(30,6%,90%)] rounded-xl p-5 md:p-6"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[hsl(25,95%,53%)]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="h-4 w-4 text-[hsl(25,95%,53%)]" />
                </div>
                <div>
                  <h3 className="font-landing-heading font-bold text-base text-[hsl(20,14%,8%)] mb-1">
                    {q.question}
                  </h3>
                  <p className="text-sm text-[hsl(25,5%,45%)] leading-relaxed">{q.detail}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-10 text-center"
        >
          <p className="text-[hsl(25,5%,45%)] mb-4">
            Se hai risposto "non lo so" anche solo a una di queste domande, è il momento di cambiare sistema.
          </p>
          <Button
            size="lg"
            asChild
            className="rounded-full bg-[hsl(25,95%,53%)] hover:bg-[hsl(25,95%,48%)] text-white px-8"
          >
            <Link to="/register">Inizia gratis — Setup in 15 minuti</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
