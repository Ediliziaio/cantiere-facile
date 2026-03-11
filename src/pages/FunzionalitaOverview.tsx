import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import { FileText, CreditCard, MapPin, PenTool, MessageSquare, Truck, ArrowRight, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";
import PenaltiesSection from "@/components/landing/PenaltiesSection";
import ScenarioSection from "@/components/landing/ScenarioSection";
import RetoricalQuestionsSection from "@/components/landing/RetoricalQuestionsSection";
import StatsSection from "@/components/landing/StatsSection";

const features = [
  {
    icon: FileText,
    title: "Gestione Documenti",
    description: "Carica, organizza e monitora tutti i documenti di cantiere in un'unica dashboard. Alert automatici 30, 15 e 7 giorni prima della scadenza. Addio DURC scaduti e sanzioni da €12.000.",
    href: "/funzionalita/documenti",
  },
  {
    icon: CreditCard,
    title: "Tesserini Digitali",
    description: "Badge digitali con QR code univoco per ogni lavoratore. Scansionabili da qualsiasi smartphone. Conformi alla normativa vigente, pronti in 60 secondi.",
    href: "/funzionalita/tesserini",
  },
  {
    icon: MapPin,
    title: "Accessi Geolocalizzati",
    description: "Check-in e check-out tramite QR code con verifica GPS integrata. Sai chi è in cantiere in tempo reale. Registro presenze digitale con valore probatorio.",
    href: "/funzionalita/accessi",
  },
  {
    icon: PenTool,
    title: "Firma Digitale",
    description: "Firma verbali, collaudi, autorizzazioni e POS in 60 secondi. Valida ai sensi del CAD (D.Lgs. 82/2005). Inclusa in tutti i piani, senza costi per firma.",
    href: "/funzionalita/firma",
  },
  {
    icon: MessageSquare,
    title: "Comunicazioni Tracciate",
    description: "Chat per cantiere con timestamp, allegati e archivio completo. Ogni messaggio ha valore documentale. Sostituisce WhatsApp con qualcosa di legalmente valido.",
    href: "/funzionalita/comunicazioni",
  },
  {
    icon: Truck,
    title: "Gestione Veicoli",
    description: "Anagrafica mezzi completa con scadenze assicurazione, revisione e tagliando. Alert automatici. Mai più un mezzo fermo per documenti scaduti.",
    href: "/funzionalita/veicoli",
  },
];

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

const stats = [
  { value: "78%", label: "delle sanzioni edili è per documentazione non conforme", source: "Dati INAIL 2024" },
  { value: "€18.500", label: "multa media per irregolarità in cantiere", source: "Ispettorato Nazionale del Lavoro" },
  { value: "3 ore", label: "risparmiate a settimana con gestione digitale", source: "Media utenti Cantiere in Cloud" },
  { value: "60 sec", label: "per una firma digitale vs 5 giorni per una cartacea", source: "Benchmark interno" },
];

const comparison = [
  { before: "Documenti sparsi tra email, WhatsApp e cartelle condivise", after: "Dashboard unica con ricerca istantanea e filtri" },
  { before: "Presenze segnate a mano su foglio cartaceo", after: "Check-in GPS automatico via QR code" },
  { before: "Firme raccolte via email con scansioni illeggibili", after: "Firma digitale in 60 secondi dallo smartphone" },
  { before: "Scadenze dimenticate → sanzioni e blocchi cantiere", after: "Alert automatici 30/15/7 giorni prima" },
  { before: "Nessuna visibilità su chi è realmente in cantiere", after: "Mappa presenze in tempo reale" },
  { before: "Comunicazioni perse in chat personali", after: "Chat tracciate con valore documentale" },
];

export default function FunzionalitaOverview() {
  const [gridRef, gridInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [penaltyRef, penaltyInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [scenarioRef, scenarioInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [questionsRef, questionsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [compRef, compInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div className="font-landing-body">
      <LandingNavbar />

      {/* Hero */}
      <section className="relative bg-[#0F0E0D] pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[hsl(25,95%,53%)]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-32 right-[10%] w-8 h-8 border border-[hsl(25,95%,53%)]/20 rounded rotate-12 hidden md:block" />
        <div className="absolute bottom-20 left-[15%] w-6 h-6 border border-white/10 rounded rotate-45 hidden md:block" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-xs font-semibold uppercase tracking-widest text-[hsl(25,95%,53%)]">La piattaforma</span>
            <h1 className="mt-4 font-landing-heading font-bold text-4xl md:text-5xl text-white leading-tight">
              Una piattaforma. Tutto sotto controllo.
            </h1>
            <p className="mt-4 text-lg text-[hsl(30,6%,60%)] max-w-2xl mx-auto">
              Gestione documenti, tesserini digitali, accessi GPS, firma digitale, comunicazioni tracciate, veicoli.
              Un software per cantiere che sostituisce Excel, WhatsApp e i faldoni.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="py-20 md:py-28 bg-[#FAFAF9]" ref={gridRef}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={gridInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link
                  to={f.href}
                  className="group block bg-white rounded-xl border border-[hsl(30,6%,90%)] p-6 hover:shadow-lg hover:border-[hsl(25,95%,53%)]/30 transition-all h-full"
                >
                  <div className="w-12 h-12 rounded-xl bg-[hsl(25,95%,53%)]/10 flex items-center justify-center mb-4 group-hover:bg-[hsl(25,95%,53%)]/20 transition-colors">
                    <f.icon className="h-6 w-6 text-[hsl(25,95%,53%)]" />
                  </div>
                  <h3 className="font-landing-heading font-bold text-lg text-[hsl(20,14%,8%)] mb-2">{f.title}</h3>
                  <p className="text-sm text-[hsl(25,5%,45%)] leading-relaxed mb-4">{f.description}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-[hsl(25,95%,53%)] group-hover:gap-2 transition-all">
                    Scopri di più <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === SEZIONE 1: Il costo dell'improvvisazione === */}
      <section className="py-20 md:py-28 bg-[#0F0E0D] relative overflow-hidden" ref={penaltyRef}>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={penaltyInView ? { opacity: 1, y: 0 } : {}}
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
                animate={penaltyInView ? { opacity: 1, y: 0 } : {}}
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

      {/* === SEZIONE 2: Cosa succede senza controllo === */}
      <section className="py-20 md:py-28 bg-[#FAFAF9]" ref={scenarioRef}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={scenarioInView ? { opacity: 1, y: 0 } : {}}
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
            {/* Colonna SX: Senza */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={scenarioInView ? { opacity: 1, x: 0 } : {}}
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

            {/* Colonna DX: Con */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={scenarioInView ? { opacity: 1, x: 0 } : {}}
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

      {/* === SEZIONE 3: Le domande che dovresti farti === */}
      <section className="py-20 md:py-28 bg-white" ref={questionsRef}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={questionsInView ? { opacity: 1, y: 0 } : {}}
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
                animate={questionsInView ? { opacity: 1, x: 0 } : {}}
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
            animate={questionsInView ? { opacity: 1 } : {}}
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

      {/* === SEZIONE 4: Numeri che contano === */}
      <section className="py-20 md:py-28 bg-[#0F0E0D] relative overflow-hidden" ref={statsRef}>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[hsl(25,95%,53%)]/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
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
                animate={statsInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <p className="font-landing-heading font-bold text-3xl md:text-4xl text-[hsl(25,95%,53%)] mb-2">
                  {s.value}
                </p>
                <p className="text-sm text-white/80 mb-1">{s.label}</p>
                <p className="text-xs text-white/40">{s.source}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Prima e Dopo */}
      <section className="py-20 md:py-28 bg-white" ref={compRef}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={compInView ? { opacity: 1, y: 0 } : {}}
            className="font-landing-heading font-bold text-3xl md:text-4xl text-[hsl(20,14%,8%)] text-center mb-4"
          >
            Il prima e dopo
          </motion.h2>
          <p className="text-center text-[hsl(25,5%,45%)] mb-12 max-w-xl mx-auto">
            Ecco cosa cambia quando passi a Cantiere in Cloud.
          </p>

          <div className="rounded-xl border border-[hsl(30,6%,90%)] overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-2 bg-[hsl(30,6%,97%)]">
              <div className="px-5 py-3 text-sm font-semibold text-[hsl(25,5%,45%)] border-r border-[hsl(30,6%,90%)]">
                ❌ Senza Cantiere in Cloud
              </div>
              <div className="px-5 py-3 text-sm font-semibold text-[hsl(25,95%,53%)]">
                ✅ Con Cantiere in Cloud
              </div>
            </div>
            {/* Rows */}
            {comparison.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={compInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="grid grid-cols-2 border-t border-[hsl(30,6%,90%)]"
              >
                <div className="px-5 py-4 text-sm text-[hsl(25,5%,45%)] border-r border-[hsl(30,6%,90%)] flex items-start gap-2">
                  <X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  {row.before}
                </div>
                <div className="px-5 py-4 text-sm text-[hsl(20,14%,8%)] font-medium flex items-start gap-2">
                  <Check className="h-4 w-4 text-[hsl(142,71%,45%)] shrink-0 mt-0.5" />
                  {row.after}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24 bg-[#0F0E0D] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[hsl(25,95%,53%)]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-landing-heading font-bold text-3xl md:text-4xl text-white">
            I tuoi concorrenti lo stanno già usando. Tu?
          </h2>
          <p className="mt-4 text-[hsl(30,6%,60%)]">
            Inizia gratis oggi. Setup in 15 minuti. Nessuna carta di credito.
          </p>
          <Button
            size="lg"
            asChild
            className="mt-8 rounded-full bg-[hsl(25,95%,53%)] hover:bg-[hsl(25,95%,48%)] text-white px-8"
          >
            <Link to="/register">Prova gratis</Link>
          </Button>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
