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
  if (value === true) return <Check className="h-5 w-5 text-success" />;
  if (value === false) return <X className="h-5 w-5 text-destructive" />;
  if (value === "partial") return <Minus className="h-5 w-5 text-warning" />;
  return <span className="font-landing-body text-sm font-medium text-foreground">{value}</span>;
}

export default function ComparisonTable() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-20 md:py-28 bg-muted/50" ref={ref}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="font-landing-heading font-bold text-3xl md:text-4xl text-foreground">
            Perché scegliere noi?
          </h2>
          <p className="mt-3 font-landing-body text-muted-foreground text-lg">
            Confronta Cantiere in Cloud con le alternative tradizionali.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm"
        >
          {/* Scrollable wrapper */}
          <div className="overflow-x-auto scrollbar-hide">
            <div className="min-w-[600px]">
              {/* Header */}
              <div className="grid grid-cols-[minmax(160px,1.5fr)_repeat(3,minmax(110px,1fr))] border-b border-border">
                <div className="p-4 md:p-5 sticky left-0 z-10 bg-card" />
                <div className="p-4 md:p-5 text-center bg-primary/5 border-x border-primary/10">
                  <div className="font-landing-heading font-bold text-sm text-primary">Cantiere in Cloud</div>
                  <div className="text-[10px] text-muted-foreground font-landing-body mt-0.5">⭐ Consigliato</div>
                </div>
                <div className="p-4 md:p-5 text-center">
                  <div className="font-landing-body font-semibold text-sm text-foreground">Excel / Drive</div>
                </div>
                <div className="p-4 md:p-5 text-center">
                  <div className="font-landing-body font-semibold text-sm text-foreground">Software tradizionali</div>
                </div>
              </div>

              {/* Rows */}
              {rows.map((row, i) => (
                <div
                  key={row.feature}
                  className={`grid grid-cols-[minmax(160px,1.5fr)_repeat(3,minmax(110px,1fr))] ${i < rows.length - 1 ? "border-b border-border/50" : ""}`}
                >
                  <div className="p-3 md:p-4 flex items-center sticky left-0 z-10 bg-card">
                    <span className="font-landing-body text-sm text-foreground">{row.feature}</span>
                  </div>
                  <div className="p-3 md:p-4 flex items-center justify-center bg-primary/[0.03] border-x border-primary/10">
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
            </div>
          </div>
        </motion.div>

        {/* Mobile scroll hint */}
        <p className="md:hidden text-center text-xs text-muted-foreground mt-3">
          Scorri orizzontalmente per confrontare →
        </p>
      </div>
    </section>
  );
}
