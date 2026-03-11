import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Server, Lock } from "lucide-react";

export default function FinalCtaSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-[hsl(25,95%,53%)] to-[hsl(38,92%,55%)]" ref={ref}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-landing-heading font-bold text-3xl md:text-4xl text-white leading-tight">
            Pronto a mettere ordine nel tuo cantiere?
          </h2>
          <p className="mt-4 font-landing-body text-white/80 text-lg">
            14 giorni gratis. Nessuna carta di credito. Setup in 15 minuti.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              asChild
              className="rounded-full bg-white text-[hsl(25,95%,53%)] hover:bg-white/90 font-landing-body font-semibold px-8 h-12"
            >
              <Link to="/register">Inizia gratis ora</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-white/40 text-white hover:bg-white/10 font-landing-body px-8 h-12"
            >
              Prenota una demo
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-white/60 text-sm font-landing-body">
            <span className="flex items-center gap-1.5"><Shield className="h-4 w-4" /> GDPR Compliant</span>
            <span className="flex items-center gap-1.5"><Server className="h-4 w-4" /> Server in Europa</span>
            <span className="flex items-center gap-1.5"><Lock className="h-4 w-4" /> Dati crittografati</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
