import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import {
  Check,
  Building2,
  Users,
  FileText,
  QrCode,
  MapPin,
  Mail,
  PenTool,
  Truck,
  Download,
  MessageSquare,
  Shield,
  Headphones,
  Globe,
  Zap,
  UserCheck,
  Receipt,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

export default function PricingSection() {
  const [annual, setAnnual] = useState(false);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="prezzi" className="py-20 md:py-28 bg-[#FAFAF9]" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10"
        >
          <h2 className="font-landing-heading font-bold text-3xl md:text-4xl text-[hsl(20,14%,8%)]">
            Prezzi chiari. Zero sorprese.
          </h2>
          <p className="mt-3 font-landing-body text-[hsl(25,5%,45%)] text-lg">
            Scegli il piano giusto per la tua impresa. Cancelli quando vuoi.
          </p>
        </motion.div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <span className={`text-sm font-landing-body font-medium ${!annual ? "text-[hsl(20,14%,8%)]" : "text-[hsl(25,5%,45%)]"}`}>
            Mensile
          </span>
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
          <span className={`text-sm font-landing-body font-medium ${annual ? "text-[hsl(20,14%,8%)]" : "text-[hsl(25,5%,45%)]"}`}>
            Annuale <span className="text-[hsl(25,95%,53%)]">(–20%)</span>
          </span>
        </div>

        {/* Cards — on mobile Pro comes first */}
        <div className="grid md:grid-cols-3 gap-5 items-start">
          {[plans[1], plans[0], plans[2]].map((plan, mobileIdx) => {
            const cardContent = (
              <>
                {plan.badge && (
                  <span className="self-start bg-[hsl(25,95%,53%)] text-white text-xs font-landing-body font-semibold px-3 py-1 rounded-full mb-4">
                    {plan.badge}
                  </span>
                )}
                <h3 className="font-landing-heading font-bold text-xl text-[hsl(20,14%,8%)]">{plan.name}</h3>
                <p className="font-landing-body text-sm text-[hsl(25,5%,45%)] mt-1">{plan.audience}</p>

                <div className="mt-5 mb-6 min-h-[60px]">
                  {plan.monthly === 0 ? (
                    <div className="font-landing-heading font-bold text-4xl text-[hsl(25,95%,53%)]">
                      Gratis
                    </div>
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
                        <span className="font-landing-body text-sm text-[hsl(25,5%,45%)]">/mese</span>
                      </div>
                      <AnimatePresence>
                        {annual && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <span className="text-sm font-landing-body text-[hsl(25,5%,45%)] line-through decoration-red-400">
                              €{plan.monthly}/mese
                            </span>
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
                    <li key={f.text} className="flex items-start gap-2.5 text-sm font-landing-body text-[hsl(25,5%,45%)]">
                      <f.icon className="h-4 w-4 mt-0.5 text-[hsl(25,95%,53%)] shrink-0" />
                      {f.text}
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className={`mt-6 w-full rounded-full font-landing-body ${
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
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: mobileIdx * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="md:order-2 order-first"
                >
                  <div className="relative rounded-2xl bg-gradient-to-b from-[hsl(25,95%,53%)] to-[hsl(38,92%,55%)] p-[2px] shadow-xl shadow-[hsl(25,95%,53%)]/20 hover:shadow-2xl hover:shadow-[hsl(25,95%,53%)]/30 transition-shadow overflow-hidden">
                    {/* Shine animation */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
                      <div className="animate-shine absolute top-0 -left-full h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </div>
                    <div className="rounded-[14px] bg-white p-6 flex flex-col relative">
                      {cardContent}
                    </div>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
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

        <p className="mt-8 text-center text-sm font-landing-body text-[hsl(25,5%,45%)]">
          ✓ Nessuna carta di credito richiesta &nbsp; ✓ Setup in 15 minuti &nbsp; ✓ Migrazione dati assistita
        </p>
      </div>
    </section>
  );
}
