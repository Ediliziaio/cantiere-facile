import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Plus } from "lucide-react";

const faqs = [
  {
    q: "Posso provare gratis senza carta di credito?",
    a: "Sì. Il piano Starter è gratuito per sempre con 1 cantiere e 5 lavoratori. I piani Professional e Business hanno 14 giorni di prova gratuita senza carta di credito.",
  },
  {
    q: "I miei dati sono al sicuro?",
    a: "Assolutamente. Server in Europa, dati crittografati in transito e a riposo, conformità GDPR totale. Backup automatici giornalieri. I tuoi dati restano tuoi — sempre.",
  },
  {
    q: "Posso migrare i dati dal mio sistema attuale?",
    a: "Sì. Offriamo migrazione assistita gratuita per tutti i piani a pagamento. Il nostro team ti aiuta a importare documenti, anagrafiche e storico in poche ore.",
  },
  {
    q: "La firma digitale è legalmente valida?",
    a: "Sì. La firma elettronica avanzata è conforme al Regolamento eIDAS (UE 910/2014) e al Codice dell'Amministrazione Digitale (D.Lgs. 82/2005). Ogni documento firmato include un certificato di validità.",
  },
  {
    q: "Che tipo di supporto offrite?",
    a: "Piano Starter: supporto email. Piano Professional: chat prioritaria con risposta entro 4 ore. Piano Business: account manager dedicato, telefono diretto e SLA garantito.",
  },
  {
    q: "Posso cancellare in qualsiasi momento?",
    a: "Sì, senza penali. Cancelli dal pannello impostazioni con un click. I tuoi dati restano disponibili per l'export per 30 giorni dopo la cancellazione.",
  },
  {
    q: "Serve formazione per usare la piattaforma?",
    a: "No. La piattaforma è progettata per essere usata da chiunque, senza formazione. Per i piani Business offriamo comunque sessioni di onboarding dedicate.",
  },
  {
    q: "Funziona anche offline in cantiere?",
    a: "La piattaforma richiede connessione internet, ma i tesserini QR e i documenti scaricati sono accessibili offline. Le timbrature vengono sincronizzate automaticamente appena torna la connessione.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-20 md:py-28 bg-[#FAFAF9]" ref={ref}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="font-landing-heading font-bold text-3xl md:text-4xl text-[hsl(20,14%,8%)]">
            Domande frequenti
          </h2>
          <p className="mt-3 font-landing-body text-[hsl(25,5%,45%)] text-lg">
            Tutto quello che devi sapere prima di iniziare.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="border border-[hsl(30,6%,90%)] rounded-xl bg-white overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className="font-landing-body font-medium text-sm text-[hsl(20,14%,8%)] pr-4">
                  {faq.q}
                </span>
                <motion.div
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0"
                >
                  <Plus className="h-5 w-5 text-[hsl(25,95%,53%)]" />
                </motion.div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 font-landing-body text-sm text-[hsl(25,5%,45%)] leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
