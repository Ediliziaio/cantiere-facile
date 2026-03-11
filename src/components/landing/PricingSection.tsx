import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    monthly: 49,
    annual: 39,
    audience: "Imprese con 1-3 cantieri",
    features: [
      "3 cantieri attivi",
      "20 lavoratori",
      "Gestione documenti + scadenze",
      "Tesserini digitali QR",
      "Accessi geolocalizzati",
      "Supporto email",
    ],
    cta: "Inizia gratis 14 giorni",
    highlighted: false,
  },
  {
    name: "Pro",
    monthly: 129,
    annual: 99,
    audience: "Imprese con fino a 10 cantieri",
    badge: "Più popolare",
    features: [
      "Cantieri illimitati",
      "Lavoratori illimitati",
      "Firma digitale nativa (inclusa)",
      "Portale subappaltatori",
      "Comunicazioni tracciate",
      "Gestione veicoli e mezzi",
      "Report e export PDF",
      "Supporto prioritario chat",
    ],
    cta: "Inizia gratis 14 giorni",
    highlighted: true,
  },
  {
    name: "Enterprise",
    monthly: null,
    annual: null,
    audience: "General contractor, grandi imprese",
    features: [
      "Tutto in Pro, più:",
      "SuperAdmin multi-sede",
      "API e integrazioni custom",
      "SLA garantito",
      "Onboarding dedicato",
      "Account manager dedicato",
      "Fatturazione centralizzata",
    ],
    cta: "Parla con noi",
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
        <div className="grid md:grid-cols-3 gap-5">
          {/* Mobile order: Pro first */}
          {[plans[1], plans[0], plans[2]].map((plan, mobileIdx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: mobileIdx * 0.1 }}
              className={`rounded-xl border p-6 flex flex-col ${
                plan.highlighted
                  ? "border-[hsl(25,95%,53%)] bg-white shadow-xl shadow-[hsl(25,95%,53%)]/10 md:order-2 order-first"
                  : "border-[hsl(30,6%,90%)] bg-white md:order-none"
              } ${plan.name === "Starter" ? "md:order-1" : ""} ${plan.name === "Enterprise" ? "md:order-3" : ""}`}
            >
              {plan.badge && (
                <span className="self-start bg-[hsl(25,95%,53%)] text-white text-xs font-landing-body font-semibold px-3 py-1 rounded-full mb-4">
                  {plan.badge}
                </span>
              )}
              <h3 className="font-landing-heading font-bold text-xl text-[hsl(20,14%,8%)]">{plan.name}</h3>
              <p className="font-landing-body text-sm text-[hsl(25,5%,45%)] mt-1">{plan.audience}</p>

              <div className="mt-5 mb-6">
                {plan.monthly !== null ? (
                  <div className="flex items-baseline gap-1">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={annual ? "annual" : "monthly"}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="font-landing-heading font-extrabold text-4xl text-[hsl(20,14%,8%)]"
                      >
                        €{annual ? plan.annual : plan.monthly}
                      </motion.span>
                    </AnimatePresence>
                    <span className="font-landing-body text-sm text-[hsl(25,5%,45%)]">/mese</span>
                  </div>
                ) : (
                  <div className="font-landing-heading font-extrabold text-4xl text-[hsl(20,14%,8%)]">
                    Su misura
                  </div>
                )}
              </div>

              <ul className="space-y-2.5 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm font-landing-body text-[hsl(25,5%,45%)]">
                    <Check className="h-4 w-4 mt-0.5 text-[hsl(25,95%,53%)] shrink-0" />
                    {f}
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
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm font-landing-body text-[hsl(25,5%,45%)]">
          ✓ Nessuna carta di credito richiesta &nbsp; ✓ Setup in 15 minuti &nbsp; ✓ Migrazione dati assistita
        </p>
      </div>
    </section>
  );
}
