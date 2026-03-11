import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FileText, CreditCard, MapPin, PenTool, MessageSquare, Truck, CheckCircle2, ArrowRight } from "lucide-react";

const tabs = [
  {
    id: "documenti",
    icon: FileText,
    label: "Documenti",
    headline: "Documenti sempre validi. Mai più sanzioni.",
    bullets: [
      "Carica documenti per ogni subappaltatore, lavoratore e mezzo d'opera",
      "Scadenze automatiche con alert 30/7/1 giorno prima",
      "Checklist intelligente: il sistema sa cosa manca e chi deve caricare cosa",
      "Il subappaltatore carica dal suo portale — tu approvi con un click",
    ],
    cta: "Scopri il modulo documenti",
    mockup: {
      items: [
        { name: "DURC - Rossi Costruzioni S.r.l.", badge: "Valido", color: "bg-[hsl(142,71%,45%)]", date: "Scade: 15/09/2026" },
        { name: "Visura camerale - Impresa Bianchi", badge: "In scadenza", color: "bg-[hsl(38,92%,50%)]", date: "Scade: 22/03/2026" },
        { name: "Idoneità sanitaria - M. Conti", badge: "Scaduto", color: "bg-[hsl(0,84%,60%)]", date: "Scaduto: 01/02/2026" },
        { name: "Certificato formazione - L. Neri", badge: "Valido", color: "bg-[hsl(142,71%,45%)]", date: "Scade: 30/11/2026" },
      ],
    },
  },
  {
    id: "tesserini",
    icon: CreditCard,
    label: "Tesserini",
    headline: "Ogni lavoratore ha il suo badge digitale. Sempre con sé.",
    bullets: [
      "Tesserino digitale generato automaticamente per ogni lavoratore",
      "QR code univoco con tutti i dati: nome, foto, mansione, documenti validi",
      "Scansionabile da qualsiasi smartphone — zero hardware necessario",
      "In caso di controllo: mostri il QR, non cerchi tra 200 fogli",
    ],
    cta: "Scopri i tesserini digitali",
    mockup: {
      badge: { name: "Marco Rossi", role: "Muratore specializzato", company: "Rossi Costruzioni S.r.l.", status: "Documenti OK" },
    },
  },
  {
    id: "accessi",
    icon: MapPin,
    label: "Accessi Geo",
    headline: "Sai esattamente chi è in cantiere. In tempo reale.",
    bullets: [
      "Check-in/out via QR code con rilevazione GPS automatica",
      "La piattaforma verifica che il check-in avvenga DENTRO il perimetro del cantiere",
      "Log completo degli accessi: chi, quando, dove, per quanto tempo",
      "Report presenze giornalieri pronti in un click — utili per DL e committenti",
    ],
    cta: "Scopri il controllo accessi",
    mockup: {
      workers: [
        { name: "G. Bianchi", time: "07:32", status: "IN" },
        { name: "M. Rossi", time: "07:45", status: "IN" },
        { name: "L. Verdi", time: "08:01", status: "IN" },
        { name: "A. Conti", time: "12:30", status: "OUT" },
      ],
    },
  },
  {
    id: "firma",
    icon: PenTool,
    label: "Firma Digitale",
    headline: "Verbali, collaudi, autorizzazioni. Firmati in 60 secondi.",
    bullets: [
      "Carica qualsiasi documento PDF e posiziona i campi firma sulla pagina",
      "Il firmatario riceve un link sul telefono — firma con il dito o via OTP email",
      "Il PDF firmato viene generato automaticamente con certificato allegato",
      "Vale legalmente ai sensi del D.Lgs. 82/2005 (CAD)",
    ],
    cta: "Scopri la firma digitale",
    mockup: {
      steps: ["Documento", "Firma", "Completato"],
      activeStep: 1,
    },
  },
  {
    id: "comunicazioni",
    icon: MessageSquare,
    label: "Comunicazioni",
    headline: "Tutto scritto, tutto tracciato. Nessun malinteso.",
    bullets: [
      "Chat interna per cantiere: messaggi tra impresa principale e subappaltatori",
      "Ogni comunicazione è timestampata e archiviata — vale come documento",
      "Allega foto, PDF, video direttamente dal cantiere",
      "In caso di controversia: hai tutta la storia comunicativa scaricabile in PDF",
    ],
    cta: "Scopri le comunicazioni",
    mockup: {
      messages: [
        { sender: "Tu", text: "Domani ispezione ASL. Tutti i documenti aggiornati?", time: "14:32" },
        { sender: "Rossi Costruzioni", text: "Sì, tutto caricato ieri sera. Controllate pure.", time: "14:35" },
      ],
    },
  },
  {
    id: "veicoli",
    icon: Truck,
    label: "Veicoli",
    headline: "I tuoi mezzi sono in regola? Lo sai in 3 secondi.",
    bullets: [
      "Anagrafica completa di tutti i mezzi: targa, tipo, assicurazione, revisione",
      "Scadenze di assicurazione e revisione con alert automatici",
      "Associa ogni mezzo al cantiere di utilizzo con data ingresso/uscita",
      "Elenco mezzi presenti in cantiere sempre aggiornato per il POS",
    ],
    cta: "Scopri la gestione veicoli",
    mockup: {
      vehicles: [
        { name: "Escavatore CAT 320", plate: "FG 123 AB", status: "Valido", color: "bg-[hsl(142,71%,45%)]" },
        { name: "Gru a torre Liebherr", plate: "MI 456 CD", status: "In scadenza", color: "bg-[hsl(38,92%,50%)]" },
        { name: "Autocarro IVECO", plate: "RM 789 EF", status: "Valido", color: "bg-[hsl(142,71%,45%)]" },
      ],
    },
  },
];

function MockupCard({ tab }: { tab: typeof tabs[0] }) {
  return (
    <div className="bg-[#FAFAF9] rounded-xl border border-[hsl(30,6%,90%)] shadow-lg p-5 sm:p-6">
      {tab.id === "documenti" && (
        <div className="space-y-3">
          <div className="text-xs font-landing-body font-medium text-[hsl(25,5%,45%)] uppercase tracking-wider mb-3">Documenti cantiere</div>
          {tab.mockup.items?.map((item) => (
            <div key={item.name} className="flex items-center justify-between bg-white rounded-lg border border-[hsl(30,6%,92%)] px-3 py-2.5">
              <div>
                <div className="text-sm font-landing-body font-medium text-[hsl(20,14%,8%)]">{item.name}</div>
                <div className="text-xs text-[hsl(25,5%,45%)]">{item.date}</div>
              </div>
              <span className={`${item.color} text-white text-xs px-2 py-0.5 rounded-full font-medium`}>{item.badge}</span>
            </div>
          ))}
        </div>
      )}

      {tab.id === "tesserini" && tab.mockup.badge && (
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-20 h-20 rounded-full bg-[hsl(25,95%,53%)]/10 flex items-center justify-center mb-3">
            <span className="text-3xl">👷</span>
          </div>
          <div className="font-landing-heading font-bold text-lg text-[hsl(20,14%,8%)]">{tab.mockup.badge.name}</div>
          <div className="text-sm text-[hsl(25,5%,45%)] font-landing-body">{tab.mockup.badge.role}</div>
          <div className="text-xs text-[hsl(25,5%,45%)] font-landing-body mt-1">{tab.mockup.badge.company}</div>
          <div className="mt-4 w-24 h-24 bg-[hsl(20,14%,8%)] rounded-lg flex items-center justify-center">
            <div className="grid grid-cols-5 grid-rows-5 gap-0.5 w-16 h-16">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className={`w-full h-full ${Math.random() > 0.4 ? 'bg-white' : 'bg-transparent'}`} />
              ))}
            </div>
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[hsl(142,71%,45%)]/10 text-[hsl(142,71%,45%)] text-xs font-medium">
            <CheckCircle2 className="h-3 w-3" /> {tab.mockup.badge.status}
          </div>
        </div>
      )}

      {tab.id === "accessi" && (
        <div>
          <div className="mb-4 bg-[hsl(25,95%,53%)]/5 rounded-lg p-4 text-center">
            <MapPin className="h-8 w-8 text-[hsl(25,95%,53%)] mx-auto mb-2" />
            <div className="text-xs font-landing-body text-[hsl(25,5%,45%)]">Cantiere Via Roma 15, Milano</div>
            <div className="text-xs text-[hsl(142,71%,45%)] mt-1">● Geofence attivo</div>
          </div>
          <div className="space-y-2">
            {tab.mockup.workers?.map((w) => (
              <div key={w.name} className="flex items-center justify-between bg-white rounded-lg border border-[hsl(30,6%,92%)] px-3 py-2">
                <span className="text-sm font-landing-body text-[hsl(20,14%,8%)]">{w.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[hsl(25,5%,45%)]">{w.time}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${w.status === "IN" ? "bg-[hsl(142,71%,45%)] text-white" : "bg-[hsl(30,6%,90%)] text-[hsl(25,5%,45%)]"}`}>
                    {w.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab.id === "firma" && (
        <div className="py-4">
          <div className="flex items-center justify-center gap-4 mb-6">
            {tab.mockup.steps?.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  i <= (tab.mockup.activeStep ?? 0) ? "bg-[hsl(25,95%,53%)] text-white" : "bg-[hsl(30,6%,90%)] text-[hsl(25,5%,45%)]"
                }`}>{i + 1}</div>
                <span className="text-xs font-landing-body text-[hsl(25,5%,45%)] hidden sm:inline">{step}</span>
                {i < (tab.mockup.steps?.length ?? 0) - 1 && <div className="w-8 h-px bg-[hsl(30,6%,90%)]" />}
              </div>
            ))}
          </div>
          <div className="bg-white border border-[hsl(30,6%,92%)] rounded-lg p-4 space-y-3">
            <div className="h-3 bg-[hsl(30,6%,92%)] rounded w-3/4" />
            <div className="h-3 bg-[hsl(30,6%,92%)] rounded w-full" />
            <div className="h-3 bg-[hsl(30,6%,92%)] rounded w-5/6" />
            <div className="mt-4 border-2 border-dashed border-[hsl(25,95%,53%)]/40 rounded-lg p-4 text-center">
              <PenTool className="h-5 w-5 text-[hsl(25,95%,53%)] mx-auto mb-1" />
              <span className="text-xs text-[hsl(25,95%,53%)] font-medium">Firma qui</span>
            </div>
          </div>
        </div>
      )}

      {tab.id === "comunicazioni" && (
        <div className="space-y-3 py-2">
          <div className="text-xs font-landing-body text-[hsl(25,5%,45%)] text-center mb-2">Cantiere Via Roma 15</div>
          {tab.mockup.messages?.map((m, i) => (
            <div key={i} className={`flex ${m.sender === "Tu" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-xl px-3 py-2 ${
                m.sender === "Tu" ? "bg-[hsl(25,95%,53%)] text-white" : "bg-white border border-[hsl(30,6%,92%)]"
              }`}>
                <div className={`text-xs font-medium mb-0.5 ${m.sender === "Tu" ? "text-white/70" : "text-[hsl(25,5%,45%)]"}`}>{m.sender}</div>
                <div className={`text-sm font-landing-body ${m.sender === "Tu" ? "text-white" : "text-[hsl(20,14%,8%)]"}`}>{m.text}</div>
                <div className={`text-[10px] mt-1 ${m.sender === "Tu" ? "text-white/50" : "text-[hsl(25,5%,45%)]"}`}>{m.time}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab.id === "veicoli" && (
        <div className="space-y-3">
          <div className="text-xs font-landing-body font-medium text-[hsl(25,5%,45%)] uppercase tracking-wider mb-3">Mezzi registrati</div>
          {tab.mockup.vehicles?.map((v) => (
            <div key={v.name} className="flex items-center justify-between bg-white rounded-lg border border-[hsl(30,6%,92%)] px-3 py-2.5">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-[hsl(25,5%,45%)]" />
                <div>
                  <div className="text-sm font-landing-body font-medium text-[hsl(20,14%,8%)]">{v.name}</div>
                  <div className="text-xs text-[hsl(25,5%,45%)]">{v.plate}</div>
                </div>
              </div>
              <span className={`${v.color} text-white text-xs px-2 py-0.5 rounded-full font-medium`}>{v.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FeatureTabsSection() {
  const [active, setActive] = useState(0);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="funzionalita" className="py-20 md:py-28 bg-white" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-landing-body font-semibold uppercase tracking-widest text-[hsl(25,95%,53%)]">
            La piattaforma
          </span>
          <h2 className="mt-3 font-landing-heading font-bold text-3xl md:text-4xl text-[hsl(20,14%,8%)]">
            Tutto quello che serve per gestire un cantiere sicuro.
          </h2>
          <p className="mt-3 font-landing-body text-[hsl(25,5%,45%)] text-lg max-w-xl mx-auto">
            Un unico sistema. Zero fogli. Zero telefonate. Zero sanzioni.
          </p>
        </motion.div>

        {/* Desktop tabs */}
        <div className="hidden md:flex items-center justify-center gap-2 mb-10">
          {tabs.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setActive(i)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-landing-body font-medium transition-all ${
                active === i
                  ? "bg-[hsl(25,95%,53%)] text-white shadow-lg shadow-[hsl(25,95%,53%)]/20"
                  : "bg-[hsl(30,6%,95%)] text-[hsl(25,5%,45%)] hover:bg-[hsl(30,6%,90%)]"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Desktop tab content */}
        <div className="hidden md:block">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 gap-10 items-center"
            >
              <div>
                <h3 className="font-landing-heading font-bold text-2xl text-[hsl(20,14%,8%)] mb-4">
                  {tabs[active].headline}
                </h3>
                <ul className="space-y-3">
                  {tabs[active].bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm font-landing-body text-[hsl(25,5%,45%)] leading-relaxed">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 text-[hsl(25,95%,53%)] shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
                <a href="#" className="mt-6 inline-flex items-center gap-1.5 text-sm font-landing-body font-semibold text-[hsl(25,95%,53%)] hover:underline">
                  {tabs[active].cta} <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <MockupCard tab={tabs[active]} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile accordion */}
        <div className="md:hidden space-y-3">
          {tabs.map((t, i) => (
            <div key={t.id} className="border border-[hsl(30,6%,90%)] rounded-xl overflow-hidden">
              <button
                onClick={() => setActive(active === i ? -1 : i)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left font-landing-body font-medium text-sm transition-colors ${
                  active === i ? "bg-[hsl(25,95%,53%)] text-white" : "bg-white text-[hsl(20,14%,8%)]"
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
              {active === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-4 pt-3"
                >
                  <h3 className="font-landing-heading font-bold text-lg text-[hsl(20,14%,8%)] mb-3">{t.headline}</h3>
                  <ul className="space-y-2 mb-4">
                    {t.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm font-landing-body text-[hsl(25,5%,45%)]">
                        <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 text-[hsl(25,95%,53%)] shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <MockupCard tab={t} />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
