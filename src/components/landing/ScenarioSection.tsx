import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { X, Check } from "lucide-react";

export default function ScenarioSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-20 md:py-28 bg-[#FAFAF9]" ref={ref}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="font-landing-heading font-bold text-3xl md:text-4xl text-[hsl(20,14%,8%)]">
            Cosa succede senza controllo
          </h2>
          <p className="mt-4 text-[hsl(25,5%,45%)] max-w-2xl mx-auto">
            Due versioni della stessa giornata. Stesso cantiere, stessi lavoratori, stesso ispettore. L'unica differenza è il sistema che usi.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-xl border border-red-200 p-6 md:p-8"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <X className="h-4 w-4 text-red-500" />
              </div>
              <h3 className="font-landing-heading font-bold text-lg text-red-600">Senza Cantiere in Cloud</h3>
            </div>
            <div className="space-y-4 text-sm text-[hsl(25,5%,35%)] leading-relaxed">
              <p>
                <strong className="text-[hsl(20,14%,8%)]">Ore 7:30 —</strong> Arrivi in cantiere. Il capocantiere ti dice che ieri è arrivato un nuovo operaio dal subappaltatore. Nessuno sa se ha il badge, se l'idoneità sanitaria è valida, se il DURC dell'impresa è aggiornato. "Dovrebbe essere tutto a posto", ti dice.
              </p>
              <p>
                <strong className="text-[hsl(20,14%,8%)]">Ore 9:15 —</strong> Ti chiama il CSE: serve il POS aggiornato per il ponteggio che state montando. Lo cerchi su WhatsApp, nelle email, nella cartella condivisa. Trovi tre versioni diverse. Nessuna è firmata.
              </p>
              <p>
                <strong className="text-[hsl(20,14%,8%)]">Ore 11:00 —</strong> Arriva l'ispettorato. Chiedono il registro presenze. Hai un foglio cartaceo con le firme di stamattina, ma mancano due nomi. Chiedono il DURC del subappaltatore. Lo hai, ma è scaduto da 12 giorni. Non te n'eri accorto.
              </p>
              <p>
                <strong className="text-[hsl(20,14%,8%)]">Ore 11:45 —</strong> Verbale di contestazione. Sanzione da €15.000. Rischio di sospensione dei lavori. Il committente viene informato. Il subappaltatore dice che "non è colpa sua". La giornata è compromessa.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl border border-[hsl(142,71%,45%)]/30 p-6 md:p-8"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-4 w-4 text-[hsl(142,71%,45%)]" />
              </div>
              <h3 className="font-landing-heading font-bold text-lg text-[hsl(142,71%,35%)]">Con Cantiere in Cloud</h3>
            </div>
            <div className="space-y-4 text-sm text-[hsl(25,5%,35%)] leading-relaxed">
              <p>
                <strong className="text-[hsl(20,14%,8%)]">Ore 7:30 —</strong> Arrivi in cantiere. Il nuovo operaio è già stato caricato nel sistema dal subappaltatore tramite il portale dedicato. Badge generato, idoneità sanitaria allegata, DURC verificato automaticamente. Ricevi una notifica: "Nuovo lavoratore attivo — documentazione completa".
              </p>
              <p>
                <strong className="text-[hsl(20,14%,8%)]">Ore 9:15 —</strong> Il CSE chiede il POS aggiornato. Apri la dashboard, filtri per cantiere e tipologia. Il POS è lì, ultima versione, firmato digitalmente due giorni fa. Lo condividi con un link in 10 secondi.
              </p>
              <p>
                <strong className="text-[hsl(20,14%,8%)]">Ore 11:00 —</strong> Arriva l'ispettorato. Apri il registro presenze digitale: tutti i check-in GPS con orario, coordinate e foto. Il DURC del subappaltatore? Valido, con alert già impostato per il rinnovo tra 22 giorni.
              </p>
              <p>
                <strong className="text-[hsl(20,14%,8%)]">Ore 11:45 —</strong> L'ispettore completa il controllo. Nessuna contestazione. Ti fa i complimenti per l'organizzazione. Il cantiere prosegue senza interruzioni.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
