import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import { FileText, MapPin, PenTool, ArrowRight, CheckCircle2, Upload, Shield } from "lucide-react";

const rows = [
  {
    tag: "DOCUMENTO DIGITALE",
    headline: "Addio alle cartelle. Tutto in cloud, accessibile da cantiere.",
    body: "Quante volte hai perso tempo a cercare un documento scaduto? Con Cantiere in Cloud, ogni documento è in cloud, indicizzato, con scadenza tracciata. Il subappaltatore lo carica dal suo telefono. Tu lo approvi con un click. Il sistema fa il resto.",
    cta: "Scopri il modulo documenti",
    icon: FileText,
    visual: "upload",
  },
  {
    tag: "ACCESSO GEOLOCALIZZATO",
    headline: "Sa chi entra. Sa chi esce. Sa dove sono.",
    body: "Il tuo cantiere ha un perimetro digitale. Quando un lavoratore scansiona il QR code, la piattaforma verifica che sia fisicamente nel cantiere. Non puoi registrare un accesso da casa. Non puoi falsificare le presenze. Punto.",
    cta: "Scopri il controllo accessi",
    icon: MapPin,
    visual: "geo",
  },
  {
    tag: "FIRMA DIGITALE NATIVA",
    headline: "Il verbale firmato in 60 secondi. Anche dal cantiere.",
    body: "Niente più \"te lo mando per email\". Carica il documento, posiziona i campi firma, invia il link. Il firmatario apre dal telefono, legge il documento, firma con il dito. Il PDF firmato — con certificato allegato — viene generato in automatico.",
    cta: "Scopri la firma digitale",
    icon: PenTool,
    visual: "sign",
  },
];

function RowVisual({ type }: { type: string }) {
  return (
    <div className="bg-[#FAFAF9] rounded-xl border border-[hsl(30,6%,90%)] shadow-lg p-6">
      {type === "upload" && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 bg-white rounded-lg border border-[hsl(30,6%,92%)] p-3">
            <Upload className="h-5 w-5 text-[hsl(25,95%,53%)]" />
            <div className="flex-1">
              <div className="h-2.5 bg-[hsl(25,95%,53%)]/20 rounded-full w-3/4" />
              <div className="h-2 bg-[hsl(30,6%,92%)] rounded-full w-1/2 mt-1.5" />
            </div>
            <CheckCircle2 className="h-5 w-5 text-[hsl(142,71%,45%)]" />
          </div>
          <div className="flex items-center gap-3 bg-white rounded-lg border border-[hsl(30,6%,92%)] p-3">
            <FileText className="h-5 w-5 text-[hsl(25,5%,45%)]" />
            <div className="flex-1">
              <div className="text-sm font-landing-body font-medium text-[hsl(20,14%,8%)]">DURC</div>
              <div className="text-xs text-[hsl(25,5%,45%)]">Scade: 15/09/2026</div>
            </div>
            <span className="bg-[hsl(142,71%,45%)] text-white text-xs px-2 py-0.5 rounded-full">Valido</span>
          </div>
          <div className="flex items-center gap-3 bg-white rounded-lg border border-[hsl(30,6%,92%)] p-3">
            <Shield className="h-5 w-5 text-[hsl(38,92%,50%)]" />
            <div className="flex-1">
              <div className="text-sm font-landing-body font-medium text-[hsl(20,14%,8%)]">Polizza RCT</div>
              <div className="text-xs text-[hsl(25,5%,45%)]">Scade: 22/03/2026</div>
            </div>
            <span className="bg-[hsl(38,92%,50%)] text-white text-xs px-2 py-0.5 rounded-full">In scadenza</span>
          </div>
        </div>
      )}
      {type === "geo" && (
        <div className="text-center py-4">
          <div className="relative mx-auto w-40 h-40 rounded-full border-2 border-dashed border-[hsl(25,95%,53%)]/30 flex items-center justify-center mb-4">
            <div className="absolute inset-2 rounded-full bg-[hsl(25,95%,53%)]/5" />
            <MapPin className="h-10 w-10 text-[hsl(25,95%,53%)]" />
            <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-[hsl(142,71%,45%)] animate-pulse" />
            <div className="absolute bottom-8 left-4 w-3 h-3 rounded-full bg-[hsl(142,71%,45%)] animate-pulse" />
          </div>
          <div className="bg-white rounded-lg border border-[hsl(30,6%,92%)] px-4 py-2 inline-flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[hsl(142,71%,45%)]" />
            <span className="text-sm font-landing-body text-[hsl(20,14%,8%)]">Accesso registrato — 07:32</span>
          </div>
        </div>
      )}
      {type === "sign" && (
        <div className="py-4">
          <div className="bg-white rounded-lg border border-[hsl(30,6%,92%)] p-4 mb-4">
            <div className="space-y-2">
              <div className="h-2.5 bg-[hsl(30,6%,92%)] rounded w-full" />
              <div className="h-2.5 bg-[hsl(30,6%,92%)] rounded w-5/6" />
              <div className="h-2.5 bg-[hsl(30,6%,92%)] rounded w-3/4" />
            </div>
            <div className="mt-4 border-2 border-dashed border-[hsl(25,95%,53%)]/40 rounded p-3 text-center">
              <PenTool className="h-4 w-4 text-[hsl(25,95%,53%)] mx-auto" />
              <div className="text-xs text-[hsl(25,95%,53%)] font-medium mt-1">Firma qui</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[hsl(142,71%,45%)]" />
            <span className="text-sm font-landing-body font-medium text-[hsl(142,71%,45%)]">Documento firmato</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AlternatingFeatures() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-20 md:space-y-28">
        {rows.map((row, i) => {
          const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });
          const isEven = i % 2 === 0;

          return (
            <motion.div
              ref={ref}
              key={row.tag}
              initial={{ opacity: 0, x: isEven ? -40 : 40, scale: 0.98 }}
              animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
              transition={{ duration: 0.6 }}
              className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center ${!isEven ? "md:[direction:rtl]" : ""}`}
            >
              <div className={!isEven ? "md:[direction:ltr]" : ""}>
                <span className="text-xs font-landing-body font-semibold uppercase tracking-widest text-[hsl(25,95%,53%)]">
                  {row.tag}
                </span>
                <h3 className="mt-3 font-landing-heading font-bold text-2xl md:text-3xl text-[hsl(20,14%,8%)] leading-tight">
                  {row.headline}
                </h3>
                <p className="mt-4 font-landing-body text-[hsl(25,5%,45%)] text-sm leading-relaxed">
                  {row.body}
                </p>
                <a href="#" className="mt-5 inline-flex items-center gap-1.5 text-sm font-landing-body font-semibold text-[hsl(25,95%,53%)] hover:underline">
                  {row.cta} <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <div className={!isEven ? "md:[direction:ltr]" : ""}>
                <RowVisual type={row.visual} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
