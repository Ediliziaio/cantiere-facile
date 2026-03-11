import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowRight, FileText, MapPin, Shield, Clock, QrCode, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const logos = [
  { name: "Costruzioni Rossi", src: "/logos/costruzioni-rossi.png" },
  { name: "Impresa Bianchi", src: "/logos/impresa-bianchi.png" },
  { name: "General Contracting Sud", src: "/logos/general-contracting-sud.png" },
  { name: "Edilmaster Group", src: "/logos/edilmaster-group.png" },
  { name: "Cantieri del Nord", src: "/logos/cantieri-del-nord.png" },
  { name: "Rizzo Costruzioni", src: "/logos/rizzo-costruzioni.png" },
  { name: "GEC Lombarda", src: "/logos/gec-lombarda.png" },
  { name: "Impresa Verdi", src: "/logos/impresa-verdi.png" },
];

export default function HeroSection() {
  const [videoOpen, setVideoOpen] = useState(false);
  const mockupRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [8, -8]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-8, 8]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = mockupRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <section className="relative bg-[#0F0E0D] overflow-hidden">
      {/* Orange radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[hsl(25,95%,53%)] opacity-[0.07] rounded-full blur-[120px] pointer-events-none" />

      {/* Floating shapes */}
      <div className="absolute top-20 left-[10%] w-16 h-16 border border-[hsl(25,95%,53%)]/20 rounded-lg animate-float-slow pointer-events-none" />
      <div className="absolute top-40 right-[15%] w-10 h-10 border border-[hsl(38,92%,64%)]/15 rounded-full animate-float-slow-reverse pointer-events-none" />
      <div className="absolute bottom-32 left-[20%] w-8 h-8 bg-[hsl(25,95%,53%)]/10 rounded animate-float-slow pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-16 md:pt-36 md:pb-24">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="max-w-2xl"
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(25,95%,53%)]/30 text-[hsl(25,95%,53%)] text-sm font-landing-body font-medium">
              🏗️ Il software cloud per la sicurezza in cantiere
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mt-6 font-landing-heading font-bold text-3xl sm:text-4xl md:text-[3.5rem] text-white leading-[1.1] tracking-tight"
          >
            Il cantiere sotto controllo.
            <br />
            <span className="text-[hsl(25,95%,53%)]">Sempre. Da ovunque.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mt-5 text-lg md:text-xl text-[hsl(30,6%,60%)] font-landing-body leading-relaxed max-w-[600px]"
          >
            Documenti sempre aggiornati, accessi geolocalizzati, tesserini digitali, firma elettronica e comunicazioni tracciate. Zero carta. Zero rischi. Zero sanzioni.
          </motion.p>

          <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="mt-8 flex flex-col sm:flex-row items-start gap-3">
            <Button
              size="lg"
              asChild
              className="rounded-full bg-[hsl(25,95%,53%)] hover:bg-[hsl(25,95%,48%)] text-white font-landing-body text-base px-8 h-12"
            >
              <Link to="/register">
                Inizia gratis — nessuna carta di credito
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setVideoOpen(true)}
              className="text-white/70 hover:text-white hover:bg-white/5 font-landing-body h-12 gap-2"
            >
              <Play className="h-4 w-4 fill-current" />
              Guarda come funziona
            </Button>
          </motion.div>

          <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-sm text-[hsl(30,6%,50%)] font-landing-body">
            <span>✓ Setup in 15 minuti</span>
            <span>✓ Prova 14 giorni gratis</span>
            <span>✓ Cancelli quando vuoi</span>
          </motion.div>
        </motion.div>

        {/* Dashboard mockup */}
        <motion.div
          ref={mockupRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, type: "spring", stiffness: 80 }}
          style={{ rotateX, rotateY, perspective: 1200 }}
          className="mt-12 md:mt-16 relative mx-auto max-w-4xl"
        >
          {/* Orange glow under mockup */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-[hsl(25,95%,53%)] opacity-20 rounded-full blur-[60px]" />

          <div className="relative bg-[#1A1918] rounded-xl border border-white/10 shadow-2xl p-4 sm:p-6">
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              <div className="ml-4 flex-1 h-6 bg-white/5 rounded-md" />
            </div>

            {/* Mock dashboard content */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {[
                { label: "Cantieri attivi", val: "12", icon: MapPin, color: "text-[hsl(25,95%,53%)]" },
                { label: "Documenti OK", val: "94%", icon: Shield, color: "text-[hsl(142,71%,45%)]" },
                { label: "In scadenza", val: "7", icon: Clock, color: "text-[hsl(38,92%,50%)]" },
                { label: "Badge attivi", val: "148", icon: QrCode, color: "text-[hsl(25,95%,53%)]" },
              ].map((s) => (
                <div key={s.label} className="bg-white/5 rounded-lg p-3">
                  <s.icon className={`h-4 w-4 ${s.color} mb-1`} />
                  <div className="text-white font-landing-heading font-semibold text-xl">{s.val}</div>
                  <div className="text-white/40 text-xs font-landing-body">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Mock document list */}
            <div className="space-y-2">
              {[
                { name: "DURC - Rossi Costruzioni", status: "Valido", color: "bg-[hsl(142,71%,45%)]" },
                { name: "Visura camerale - Impresa Bianchi", status: "In scadenza", color: "bg-[hsl(38,92%,50%)]" },
                { name: "Idoneità sanitaria - M. Conti", status: "Scaduto", color: "bg-[hsl(0,84%,60%)]" },
              ].map((d) => (
                <div key={d.name} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-white/30" />
                    <span className="text-white/70 text-sm font-landing-body">{d.name}</span>
                  </div>
                  <span className={`${d.color} text-white text-xs px-2 py-0.5 rounded-full font-medium`}>
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Social proof marquee */}
      <div className="bg-[#FAFAF9] py-10 border-t border-[hsl(30,6%,90%)]">
        <p className="text-center text-sm text-[hsl(25,5%,45%)] font-landing-body mb-4">
          Scelto da imprese edili in tutta Italia
        </p>
        <div className="overflow-hidden">
          <div className="marquee-track">
            {[...logos, ...logos].map((logo, i) => (
              <div
                key={i}
                className="flex items-center gap-3 mx-12 select-none shrink-0"
              >
                <img src={logo.src} alt={logo.name} className="h-14 w-auto grayscale opacity-50 hover:opacity-70 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Demo Modal */}
      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="sm:max-w-3xl p-0 bg-[#0F0E0D] border-white/10 overflow-hidden">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="text-white font-landing-heading font-bold">
              Come funziona Cantiere in Cloud
            </DialogTitle>
          </DialogHeader>
          <div className="relative w-full aspect-video bg-[#1A1918]">
            {videoOpen && (
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1"
                title="Demo Cantiere in Cloud"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
