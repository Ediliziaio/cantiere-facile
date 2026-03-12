import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Shield, Server, Lock, FileCheck } from "lucide-react";

const badges = [
  { icon: Shield, label: "GDPR Compliant", desc: "Trattamento dati conforme al Reg. UE 2016/679" },
  { icon: Server, label: "Server in Europa", desc: "Infrastruttura cloud con data center EU" },
  { icon: Lock, label: "Crittografia AES-256", desc: "Dati protetti in transito e a riposo" },
  { icon: FileCheck, label: "Backup giornalieri", desc: "Backup automatici con retention a 30 giorni" },
];

export default function TrustBadges() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="py-16 md:py-20 bg-[#FAFAF9] border-y border-[hsl(30,6%,90%)]" ref={ref}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10"
        >
          <h2 className="font-landing-heading font-bold text-2xl md:text-3xl text-[hsl(20,14%,8%)]">
            I tuoi dati sono al sicuro. Sul serio.
          </h2>
          <p className="mt-2 font-landing-body text-[hsl(25,5%,45%)] text-base">
            Gestisci DURC, idoneità sanitarie e POS con la massima protezione.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((b, i) => (
            <motion.div
              key={b.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white rounded-xl border border-[hsl(30,6%,90%)] p-5 text-center hover:shadow-md transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[hsl(25,95%,53%)]/10 mb-3">
                <b.icon className="h-6 w-6 text-[hsl(25,95%,53%)]" />
              </div>
              <div className="font-landing-body font-semibold text-sm text-[hsl(20,14%,8%)]">{b.label}</div>
              <div className="font-landing-body text-xs text-[hsl(25,5%,45%)] mt-1 leading-snug">{b.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
