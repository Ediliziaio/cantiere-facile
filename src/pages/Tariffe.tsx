import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import {
  Check, Building2, Users, FileText, QrCode, MapPin, Mail, PenTool, Truck,
  Download, MessageSquare, Shield, Headphones, Globe, Zap, UserCheck, Receipt, LayoutDashboard,
  BadgeCheck, Cpu, CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";
import TrustBar from "@/components/tariffe/TrustBar";
import SocialProofBar from "@/components/tariffe/SocialProofBar";
import FeatureComparisonTable from "@/components/tariffe/FeatureComparisonTable";
import RoiCalculator from "@/components/tariffe/RoiCalculator";

const plans = [
  {
    name: "Starter",
    monthly: 0,
    annual: 0,
    audience: "Per iniziare — fino a 1 cantiere",
    features: [
      { text: "1 cantiere attivo", icon: Building2 },
      { text: "5 lavoratori", icon: Users },
      { text: "Gestione documenti base", icon: FileText },
      { text: "Tesserini digitali QR", icon: QrCode },
      { text: "Accessi geolocalizzati", icon: MapPin },
      { text: "Supporto email", icon: Mail },
    ],
    cta: "Inizia gratis",
    highlighted: false,
  },
  {
    name: "Professional",
    monthly: 32,
    annual: 26,
    audience: "Imprese con più cantieri",
    badge: "Più popolare",
    features: [
      { text: "Cantieri illimitati", icon: Building2 },
      { text: "Lavoratori illimitati", icon: Users },
      { text: "Firma digitale nativa (inclusa)", icon: PenTool },
      { text: "Portale subappaltatori", icon: UserCheck },
      { text: "Comunicazioni tracciate", icon: MessageSquare },
      { text: "Gestione veicoli e mezzi", icon: Truck },
      { text: "Report e export PDF", icon: Download },
      { text: "Supporto prioritario chat", icon: Headphones },
    ],
    cta: "Inizia gratis 14 giorni",
    highlighted: true,
  },
  {
    name: "Business",
    monthly: 42,
    annual: 34,
    audience: "General contractor, grandi imprese",
    features: [
      { text: "Tutto in Professional, più:", icon: Zap },
      { text: "SuperAdmin multi-sede", icon: LayoutDashboard },
      { text: "API e integrazioni custom", icon: Globe },
      { text: "SLA garantito", icon: Shield },
      { text: "Onboarding dedicato", icon: UserCheck },
      { text: "Account manager dedicato", icon: Headphones },
      { text: "Fatturazione centralizzata", icon: Receipt },
    ],
    cta: "Inizia gratis 14 giorni",
    highlighted: false,
  },
];

const whyCheap = [
  {
    icon: Users,
    title: "Nessun costo per utente",
    description: "Altri software cantiere ti fanno pagare per ogni lavoratore aggiunto. Noi no. Aggiungi 10 o 200 persone: il prezzo non cambia.",
  },
  {
    icon: PenTool,
    title: "Firma digitale inclusa",
    description: "Competitor ti chiedono €1-2 per ogni firma. Con Cantiere in Cloud la firma digitale è inclusa in tutti i piani — firme illimitate, zero costi extra.",
  },
  {
    icon: Cpu,
    title: "Zero hardware da comprare",
    description: "Niente tornelli, niente badge fisici, niente stampanti. Tutto funziona con lo smartphone che hai già in tasca. Risparmio immediato.",
  },
];

const faqs = [
  { q: "Posso cambiare piano in qualsiasi momento?", a: "Sì, puoi fare upgrade o downgrade in qualsiasi momento. Il cambio è immediato e il costo viene ricalcolato pro-rata." },
  { q: "Cosa succede alla fine della prova gratuita?", a: "Il tuo account passa automaticamente al piano Starter gratuito. Non perdi nessun dato e non ti viene addebitato nulla." },
  { q: "Quali metodi di pagamento accettate?", a: "Accettiamo tutte le principali carte di credito/debito (Visa, Mastercard, American Express) e bonifico bancario per piani annuali." },
  { q: "Ci sono costi nascosti o limiti di utilizzo?", a: "No. Il prezzo che vedi è quello che paghi. Nessun costo per utente, nessun costo per documento, nessun costo per firma digitale." },
  { q: "Offrite sconti per volumi o convenzioni?", a: "Sì, per imprese con più di 10 cantieri attivi o associazioni di categoria offriamo condizioni dedicate. Contattaci per un preventivo." },
  { q: "Come funziona la fatturazione?", a: "Emettiamo fattura elettronica mensile o annuale (a seconda del piano scelto). Per il piano Business è disponibile la fatturazione centralizzata multi-sede." },
];

export default function Tariffe() {
  const [annual, setAnnual] = useState(false);
  const [cardsRef, cardsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [cheapRef, cheapInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div className="font-landing-body">
      <LandingNavbar />

      {/* Hero */}
      <section className="relative bg-[#0F0E0D] pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[hsl(25,95%,53%)]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-32 right-[10%] w-8 h-8 border border-[hsl(25,95%,53%)]/20 rounded rotate-12 hidden md:block" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-xs font-semibold uppercase tracking-widest text-[hsl(25,95%,53%)]">Tariffe</span>
            <h1 className="mt-4 font-landing-heading font-bold text-4xl md:text-5xl text-white leading-tight">
              Tariffe chiare. Zero sorprese.
            </h1>
            <p className="mt-4 text-lg text-[hsl(30,6%,60%)] max-w-2xl mx-auto">
              Un DURC scaduto costa <strong className="text-white">€12.000 di multa</strong>. Il piano Professional costa <strong className="text-white">€26/mese</strong>. Fai i conti.
            </p>
          </motion.div>
        </div>
      </section>

      <TrustBar />
      <SocialProofBar />

      {/* Pricing cards */}
      <section className="py-20 md:py-28 bg-[#FAFAF9]" ref={cardsRef}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Toggle */}
          <div className="flex items-center justify-center gap-3 mb-12">
            <span className={`text-sm font-medium ${!annual ? "text-[hsl(20,14%,8%)]" : "text-[hsl(25,5%,45%)]"}`}>Mensile</span>
            <button
              onClick={() => setAnnual(!annual)}
              className="relative w-14 h-7 rounded-full bg-[hsl(30,6%,90%)] transition-colors"
              style={{ backgroundColor: annual ? "hsl(25,95%,53%)" : undefined }}
            >
              <motion.div
                className="absolute top-1 w-5 h-5 rounded-full bg-white shadow"
                animate={{ left: annual ? 32 : 4 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            </button>
            <span className={`text-sm font-medium ${annual ? "text-[hsl(20,14%,8%)]" : "text-[hsl(25,5%,45%)]"}`}>
              Annuale <span className="text-[hsl(25,95%,53%)]">(–20%)</span>
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-5 items-start">
            {[plans[1], plans[0], plans[2]].map((plan, mobileIdx) => {
              const cardContent = (
                <>
                  {plan.badge && (
                    <span className="self-start bg-[hsl(25,95%,53%)] text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                      {plan.badge}
                    </span>
                  )}
                  <h3 className="font-landing-heading font-bold text-xl text-[hsl(20,14%,8%)]">{plan.name}</h3>
                  <p className="text-sm text-[hsl(25,5%,45%)] mt-1">{plan.audience}</p>

                  <div className="mt-5 mb-6 min-h-[60px]">
                    {plan.monthly === 0 ? (
                      <div className="font-landing-heading font-bold text-4xl text-[hsl(25,95%,53%)]">Gratis</div>
                    ) : (
                      <div>
                        <div className="flex items-baseline gap-1">
                          <AnimatePresence mode="wait">
                            <motion.span
                              key={annual ? "annual" : "monthly"}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="font-landing-heading font-bold text-4xl text-[hsl(20,14%,8%)]"
                            >
                              €{annual ? plan.annual : plan.monthly}
                            </motion.span>
                          </AnimatePresence>
                          <span className="text-sm text-[hsl(25,5%,45%)]">/mese</span>
                        </div>
                        <AnimatePresence>
                          {annual && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <span className="text-sm text-[hsl(25,5%,45%)] line-through decoration-red-400">€{plan.monthly}/mese</span>
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-[hsl(142,71%,45%)]/10 text-[hsl(142,71%,45%)] text-xs font-semibold">
                                Risparmi €{(plan.monthly - plan.annual!) * 12}/anno
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>

                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map((f) => (
                      <li key={f.text} className="flex items-start gap-2.5 text-sm text-[hsl(25,5%,45%)]">
                        <f.icon className="h-4 w-4 mt-0.5 text-[hsl(25,95%,53%)] shrink-0" />
                        {f.text}
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    className={`mt-6 w-full rounded-full ${
                      plan.highlighted
                        ? "bg-[hsl(25,95%,53%)] hover:bg-[hsl(25,95%,48%)] text-white"
                        : "bg-[hsl(20,14%,8%)] hover:bg-[hsl(20,14%,15%)] text-white"
                    }`}
                  >
                    <Link to="/register">{plan.cta}</Link>
                  </Button>
                </>
              );

              if (plan.highlighted) {
                return (
                  <motion.div
                    key={plan.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={cardsInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: mobileIdx * 0.1 }}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    className="md:order-2 order-first"
                  >
                    <div className="relative rounded-2xl bg-gradient-to-b from-[hsl(25,95%,53%)] to-[hsl(38,92%,55%)] p-[2px] shadow-xl shadow-[hsl(25,95%,53%)]/20 overflow-hidden">
                      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
                        <div className="animate-shine absolute top-0 -left-full h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      </div>
                      <div className="rounded-[14px] bg-white p-6 flex flex-col relative">{cardContent}</div>
                    </div>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={cardsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: mobileIdx * 0.1 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className={`rounded-xl border border-[hsl(30,6%,90%)] bg-white p-6 flex flex-col hover:shadow-lg transition-shadow ${
                    plan.name === "Starter" ? "md:order-1" : "md:order-3"
                  }`}
                >
                  {cardContent}
                </motion.div>
              );
            })}
          </div>

          <p className="mt-8 text-center text-sm text-[hsl(25,5%,45%)]">
            ✓ Nessuna carta di credito richiesta &nbsp; ✓ Setup in 15 minuti &nbsp; ✓ Migrazione dati assistita
          </p>
        </div>
      </section>

      <FeatureComparisonTable />
      <RoiCalculator />

      {/* Perché costa così poco */}
      <section className="py-20 md:py-24 bg-[#0F0E0D]" ref={cheapRef}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={cheapInView ? { opacity: 1, y: 0 } : {}}
            className="font-landing-heading font-bold text-3xl md:text-4xl text-white text-center mb-4"
          >
            Perché costa così poco?
          </motion.h2>
          <p className="text-center text-[hsl(30,6%,60%)] mb-12 max-w-xl mx-auto">
            Abbiamo eliminato tutto ciò che gonfia i costi dei software tradizionali per cantiere.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {whyCheap.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={cheapInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-[hsl(25,95%,53%)]/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-7 w-7 text-[hsl(25,95%,53%)]" />
                </div>
                <h3 className="font-landing-heading font-bold text-lg text-white mb-2">{item.title}</h3>
                <p className="text-sm text-[hsl(30,6%,60%)] leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2 className="font-landing-heading font-bold text-3xl md:text-4xl text-[hsl(20,14%,8%)] text-center mb-10">
            Domande frequenti sulle tariffe
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-[hsl(30,6%,90%)] rounded-xl px-5 data-[state=open]:bg-[hsl(30,6%,97%)]">
                <AccordionTrigger className="text-left text-sm font-medium text-[hsl(20,14%,8%)] hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-[hsl(25,5%,45%)] leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Garanzia */}
      <section className="py-16 md:py-20 bg-[#FAFAF9]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[hsl(142,71%,45%)]/10 flex items-center justify-center mx-auto mb-6">
            <BadgeCheck className="h-8 w-8 text-[hsl(142,71%,45%)]" />
          </div>
          <h2 className="font-landing-heading font-bold text-2xl md:text-3xl text-[hsl(20,14%,8%)]">
            Soddisfatto o rimborsato. 30 giorni.
          </h2>
          <p className="mt-4 text-[hsl(25,5%,45%)] leading-relaxed max-w-lg mx-auto">
            Nessun rischio, nessun vincolo contrattuale. Prova Cantiere in Cloud per 30 giorni:
            se non fa per te, ti rimborsiamo al 100%. Cancelli in 2 click, senza domande.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24 bg-[#0F0E0D] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[hsl(25,95%,53%)]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-landing-heading font-bold text-3xl md:text-4xl text-white">
            Ogni mese senza Cantiere in Cloud ti costa più del piano Professional.
          </h2>
          <p className="mt-4 text-[hsl(30,6%,60%)]">
            14 giorni di prova gratuita su tutti i piani. Nessuna carta di credito.
          </p>
          <Button
            size="lg"
            asChild
            className="mt-8 rounded-full bg-[hsl(25,95%,53%)] hover:bg-[hsl(25,95%,48%)] text-white px-8"
          >
            <Link to="/register">Prova gratis 14 giorni</Link>
          </Button>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
