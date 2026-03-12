import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Check, X, Minus } from "lucide-react";

const rows = [
  { feature: "Documenti sempre aggiornati", us: true, excel: false, traditional: "partial" },
  { feature: "Avvisi scadenze automatici", us: true, excel: false, traditional: "partial" },
  { feature: "Tesserini digitali con QR", us: true, excel: false, traditional: false },
  { feature: "Controllo accessi geolocalizzato", us: true, excel: false, traditional: false },
  { feature: "Firma elettronica legale (eIDAS)", us: true, excel: false, traditional: "partial" },
  { feature: "App mobile iOS/Android", us: true, excel: false, traditional: "partial" },
  { feature: "Portale subappaltatori", us: true, excel: false, traditional: false },
  { feature: "Setup in 15 minuti", us: true, excel: true, traditional: false },
  { feature: "Costo mensile", us: "Da €0", excel: "€0", traditional: "€200+" },
];

function CellIcon({ value }: { value: boolean | string }) {
  if (value === true) return <Check className="h-5 w-5 text-[hsl(142,71%,45%)]" />;
  if (value === false) return <X className="h-5 w-5 text-[hsl(0,84%,60%)]" />;
  if (value === "partial") return <Minus className="h-5 w-5 text-[hsl(38,92%,50%)]" />;
  return <span className="font-landing-body text-sm font-medium text-[hsl(20,14%,8%)]">{value}</span>;
}

export default function ComparisonTable() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-20 md:py-28 bg-[#FAFAF9]" ref={ref}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="font-landing-heading font-bold text-3xl md:text-4xl text-[hsl(20,14%,8%)]">
            Perché scegliere noi?
          </h2>
          <p className="mt-3 font-landing-body text-[hsl(25,5%,45%)] text-lg">
            Confronta Cantiere in Cloud con le alternative tradizionali.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl border border-[hsl(30,6%,90%)] overflow-hidden shadow-sm"
        >
          {/* Header */}
          <div className="grid grid-cols-4 gap-0 border-b border-[hsl(30,6%,90%)]">
            <div className="p-4 md:p-5" />
            <div className="p-4 md:p-5 text-center bg-[hsl(25,95%,53%)]/5 border-x border-[hsl(25,95%,53%)]/10">
              <div className="font-landing-heading font-bold text-sm text-[hsl(25,95%,53%)]">Cantiere in Cloud</div>
              <div className="text-[10px] text-[hsl(25,5%,45%)] font-landing-body mt-0.5">⭐ Consigliato</div>
            </div>
            <div className="p-4 md:p-5 text-center">
              <div className="font-landing-body font-semibold text-sm text-[hsl(20,14%,8%)]">Excel / Drive</div>
            </div>
            <div className="p-4 md:p-5 text-center">
              <div className="font-landing-body font-semibold text-sm text-[hsl(20,14%,8%)]">Software tradizionali</div>
            </div>
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-4 gap-0 ${i < rows.length - 1 ? "border-b border-[hsl(30,6%,93%)]" : ""}`}
            >
              <div className="p-3 md:p-4 flex items-center">
                <span className="font-landing-body text-sm text-[hsl(20,14%,8%)]">{row.feature}</span>
              </div>
              <div className="p-3 md:p-4 flex items-center justify-center bg-[hsl(25,95%,53%)]/[0.03] border-x border-[hsl(25,95%,53%)]/10">
                <CellIcon value={row.us} />
              </div>
              <div className="p-3 md:p-4 flex items-center justify-center">
                <CellIcon value={row.excel} />
              </div>
              <div className="p-3 md:p-4 flex items-center justify-center">
                <CellIcon value={row.traditional} />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
