import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Calculator, TrendingDown, TrendingUp } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const COST_PER_SITE_TRADITIONAL = 150; // €/cantiere/mese stima gestione tradizionale
const PRO_MONTHLY = 32;

export default function RoiCalculator() {
  const [sites, setSites] = useState(5);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const traditionalCost = sites * COST_PER_SITE_TRADITIONAL;
  const platformCost = sites <= 1 ? 0 : PRO_MONTHLY;
  const monthlySavings = traditionalCost - platformCost;
  const annualSavings = monthlySavings * 12;

  return (
    <section className="py-20 md:py-24 bg-[#FAFAF9]" ref={ref}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10"
        >
          <div className="w-14 h-14 rounded-2xl bg-[hsl(25,95%,53%)]/10 flex items-center justify-center mx-auto mb-4">
            <Calculator className="h-7 w-7 text-[hsl(25,95%,53%)]" />
          </div>
          <h2 className="font-landing-heading font-bold text-3xl md:text-4xl text-[hsl(20,14%,8%)]">
            Calcola il tuo risparmio
          </h2>
          <p className="mt-2 text-[hsl(25,5%,45%)]">
            Quanto risparmi rispetto alla gestione tradizionale con fogli Excel, telefonate e carta?
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-[hsl(30,6%,90%)] bg-white p-6 md:p-8"
        >
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium text-[hsl(20,14%,8%)]">Quanti cantieri gestisci?</label>
              <span className="font-landing-heading font-bold text-2xl text-[hsl(25,95%,53%)]">{sites}</span>
            </div>
            <Slider
              value={[sites]}
              onValueChange={([v]) => setSites(v)}
              min={1}
              max={50}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-xs text-[hsl(25,5%,45%)]">
              <span>1</span>
              <span>50</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-center">
              <TrendingDown className="h-5 w-5 text-red-400 mx-auto mb-2" />
              <p className="text-xs text-[hsl(25,5%,45%)] mb-1">Costo tradizionale</p>
              <p className="font-landing-heading font-bold text-xl text-red-500">€{traditionalCost}/mese</p>
            </div>
            <div className="rounded-xl bg-[hsl(25,95%,53%)]/5 border border-[hsl(25,95%,53%)]/20 p-4 text-center">
              <TrendingUp className="h-5 w-5 text-[hsl(25,95%,53%)] mx-auto mb-2" />
              <p className="text-xs text-[hsl(25,5%,45%)] mb-1">Con Cantiere in Cloud</p>
              <p className="font-landing-heading font-bold text-xl text-[hsl(25,95%,53%)]">
                {platformCost === 0 ? "Gratis" : `€${platformCost}/mese`}
              </p>
            </div>
            <div className="rounded-xl bg-[hsl(142,71%,45%)]/5 border border-[hsl(142,71%,45%)]/20 p-4 text-center">
              <p className="text-xs text-[hsl(25,5%,45%)] mb-1">Risparmio annuo</p>
              <p className="font-landing-heading font-bold text-2xl text-[hsl(142,71%,45%)]">€{annualSavings.toLocaleString("it-IT")}</p>
            </div>
          </div>

          <p className="mt-4 text-xs text-[hsl(25,5%,45%)] text-center">
            *Stima basata su €{COST_PER_SITE_TRADITIONAL}/cantiere/mese per gestione documentale, accessi e comunicazioni tradizionali.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
