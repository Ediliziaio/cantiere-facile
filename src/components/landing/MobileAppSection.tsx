import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Smartphone, Bell, MapPin, QrCode } from "lucide-react";

const features = [
  { icon: QrCode, text: "Scansione badge QR istantanea" },
  { icon: MapPin, text: "Timbrature geolocalizzate" },
  { icon: Bell, text: "Notifiche scadenze in tempo reale" },
  { icon: Smartphone, text: "Documenti sempre accessibili" },
];

export default function MobileAppSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="py-20 md:py-28 bg-[#0F0E0D] overflow-hidden" ref={ref}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[hsl(25,95%,53%)]/30 text-[hsl(25,95%,53%)] text-sm font-landing-body font-medium mb-4">
              📱 App Mobile
            </span>
            <h2 className="font-landing-heading font-bold text-3xl md:text-4xl text-white leading-tight">
              Il cantiere nel palmo
              <br />
              <span className="text-[hsl(25,95%,53%)]">della tua mano.</span>
            </h2>
            <p className="mt-4 font-landing-body text-[hsl(30,6%,60%)] text-lg leading-relaxed max-w-md">
              Disponibile per iOS e Android. Gestisci accessi, documenti e timbrature direttamente dal cantiere — anche con connessione instabile.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map((f, i) => (
                <motion.div
                  key={f.text}
                  initial={{ opacity: 0, y: 15 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3 text-[hsl(30,6%,75%)] font-landing-body text-sm"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[hsl(25,95%,53%)]/10">
                    <f.icon className="h-4 w-4 text-[hsl(25,95%,53%)]" />
                  </div>
                  {f.text}
                </motion.div>
              ))}
            </div>

            {/* Store badges */}
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#"
                className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/15 rounded-xl border border-white/10 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] text-white/50 font-landing-body leading-none">Scarica su</div>
                  <div className="text-sm text-white font-landing-body font-semibold leading-tight">App Store</div>
                </div>
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/15 rounded-xl border border-white/10 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 0 1 0 1.38l-2.302 2.302L15.396 12l2.302-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] text-white/50 font-landing-body leading-none">Disponibile su</div>
                  <div className="text-sm text-white font-landing-body font-semibold leading-tight">Google Play</div>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Glow */}
              <div className="absolute inset-0 bg-[hsl(25,95%,53%)] opacity-15 rounded-[3rem] blur-[60px]" />
              {/* Phone frame */}
              <div className="relative w-[280px] bg-[#1A1918] rounded-[2.5rem] border-[3px] border-white/10 p-3 shadow-2xl">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#0F0E0D] rounded-b-2xl" />
                {/* Screen */}
                <div className="bg-[#0F0E0D] rounded-[2rem] p-4 pt-8 min-h-[480px]">
                  <div className="text-white font-landing-heading font-bold text-lg mb-4">Dashboard</div>
                  <div className="space-y-3">
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-[hsl(25,95%,53%)] text-xs font-landing-body font-medium mb-1">Cantiere Via Roma</div>
                      <div className="text-white/60 text-xs font-landing-body">12 lavoratori presenti</div>
                      <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-[85%] bg-[hsl(142,71%,45%)] rounded-full" />
                      </div>
                      <div className="text-white/40 text-[10px] font-landing-body mt-1">Documenti OK: 85%</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="text-[hsl(38,92%,50%)] text-xs font-landing-body font-medium mb-1">⚠ Scadenze</div>
                      <div className="text-white/60 text-xs font-landing-body">3 documenti in scadenza entro 7 giorni</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <div className="text-white/80 text-xs font-landing-body font-medium">Ultimo accesso</div>
                        <div className="text-[hsl(142,71%,45%)] text-[10px] font-landing-body">✓ Verificato</div>
                      </div>
                      <div className="text-white/50 text-[11px] font-landing-body mt-1">Mario Rossi — 08:32</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
