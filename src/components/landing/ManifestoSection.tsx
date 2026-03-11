import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function ManifestoSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section id="manifesto" className="py-20 md:py-28 bg-[#0F0E0D]" ref={ref}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="w-16 h-1 bg-[hsl(25,95%,53%)] rounded-full mx-auto mb-8" />

          <h2 className="font-landing-heading font-bold text-3xl md:text-4xl text-white leading-tight">
            Odiamo i cantieri fuori controllo.
          </h2>

          <div className="mt-8 space-y-4 font-landing-body text-[hsl(30,6%,60%)] text-base leading-relaxed">
            <p>
              Ogni anno in Italia migliaia di imprese edili ricevono sanzioni evitabili.
              Documenti scaduti, accessi non tracciati, firme mancanti, verbali persi.
            </p>
            <p>
              Non per negligenza — ma per mancanza di strumenti adeguati.
            </p>
            <p>
              Cantiere in Cloud nasce da chi i cantieri li conosce dall'interno.
              La nostra missione è semplice: nessuna impresa edile dovrebbe perdere una gara,
              ricevere una multa o rischiare un incidente per un problema di gestione documentale.
            </p>
            <p className="text-white font-medium">
              Il cantiere sicuro non è un optional. È il minimo sindacale.
            </p>
            <p>Noi ti diamo gli strumenti per arrivarci.</p>
          </div>

          <Button
            size="lg"
            asChild
            className="mt-8 rounded-full bg-[hsl(25,95%,53%)] hover:bg-[hsl(25,95%,48%)] text-white font-landing-body px-8"
          >
            <Link to="/register">Inizia oggi — gratis</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
