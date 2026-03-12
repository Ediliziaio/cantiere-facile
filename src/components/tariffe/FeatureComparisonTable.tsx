import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Check, X } from "lucide-react";

type FeatureRow = { label: string; starter: boolean | string; pro: boolean | string; business: boolean | string };
type Category = { name: string; rows: FeatureRow[] };

const categories: Category[] = [
  {
    name: "Cantieri e lavoratori",
    rows: [
      { label: "Cantieri attivi", starter: "1", pro: "Illimitati", business: "Illimitati" },
      { label: "Lavoratori", starter: "5", pro: "Illimitati", business: "Illimitati" },
      { label: "Dashboard cantiere", starter: true, pro: true, business: true },
    ],
  },
  {
    name: "Documenti",
    rows: [
      { label: "Gestione documenti", starter: "Base", pro: true, business: true },
      { label: "Scadenzario automatico", starter: false, pro: true, business: true },
      { label: "Report e export PDF", starter: false, pro: true, business: true },
    ],
  },
  {
    name: "Accessi e tesserini",
    rows: [
      { label: "Tesserini digitali QR", starter: true, pro: true, business: true },
      { label: "Accessi geolocalizzati", starter: true, pro: true, business: true },
      { label: "Portale subappaltatori", starter: false, pro: true, business: true },
    ],
  },
  {
    name: "Firma digitale",
    rows: [
      { label: "Firma digitale nativa", starter: false, pro: "Inclusa", business: "Inclusa" },
      { label: "Firme illimitate", starter: false, pro: true, business: true },
      { label: "Certificato di conformità", starter: false, pro: true, business: true },
    ],
  },
  {
    name: "Supporto e integrazioni",
    rows: [
      { label: "Supporto email", starter: true, pro: true, business: true },
      { label: "Supporto prioritario chat", starter: false, pro: true, business: true },
      { label: "Account manager dedicato", starter: false, pro: false, business: true },
      { label: "API e integrazioni custom", starter: false, pro: false, business: true },
      { label: "SLA garantito", starter: false, pro: false, business: true },
      { label: "SuperAdmin multi-sede", starter: false, pro: false, business: true },
    ],
  },
];

function CellValue({ value }: { value: boolean | string }) {
  if (typeof value === "string") return <span className="text-sm font-medium text-[hsl(20,14%,8%)]">{value}</span>;
  if (value) return <Check className="h-4 w-4 text-[hsl(25,95%,53%)] mx-auto" />;
  return <X className="h-4 w-4 text-[hsl(30,6%,80%)] mx-auto" />;
}

export default function FeatureComparisonTable() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section className="py-20 md:py-24 bg-white" ref={ref}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="font-landing-heading font-bold text-3xl md:text-4xl text-[hsl(20,14%,8%)] text-center mb-12"
        >
          Confronta i piani nel dettaglio
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="overflow-x-auto -mx-4 sm:mx-0"
        >
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-[hsl(30,6%,90%)]">
                <th className="text-left py-3 px-4 font-medium text-[hsl(25,5%,45%)] w-[40%] sticky left-0 bg-white z-10" />
                <th className="py-3 px-4 text-center font-bold text-[hsl(20,14%,8%)]">Starter</th>
                <th className="py-3 px-4 text-center font-bold text-[hsl(25,95%,53%)]">Professional</th>
                <th className="py-3 px-4 text-center font-bold text-[hsl(20,14%,8%)]">Business</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <React.Fragment key={cat.name}>
                  <tr>
                    <td
                      colSpan={4}
                      className="pt-6 pb-2 px-4 font-landing-heading font-bold text-xs uppercase tracking-widest text-[hsl(25,5%,45%)] sticky left-0 bg-white z-10"
                    >
                      {cat.name}
                    </td>
                  </tr>
                  {cat.rows.map((row) => (
                    <tr key={row.label} className="border-b border-[hsl(30,6%,95%)] hover:bg-[hsl(30,6%,97%)] transition-colors">
                      <td className="py-3 px-4 text-[hsl(20,14%,8%)] sticky left-0 bg-white z-10">{row.label}</td>
                      <td className="py-3 px-4 text-center"><CellValue value={row.starter} /></td>
                      <td className="py-3 px-4 text-center bg-[hsl(25,95%,53%)]/[0.03]"><CellValue value={row.pro} /></td>
                      <td className="py-3 px-4 text-center"><CellValue value={row.business} /></td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}

import React from "react";
