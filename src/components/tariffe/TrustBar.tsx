import { Shield, CreditCard, Clock } from "lucide-react";
import { motion } from "framer-motion";

const badges = [
  { icon: Shield, text: "GDPR compliant" },
  { icon: Clock, text: "Rimborso entro 30 giorni" },
  { icon: CreditCard, text: "Nessuna carta richiesta" },
];

export default function TrustBar() {
  return (
    <section className="py-6 bg-[#0F0E0D] border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {badges.map((b, i) => (
            <motion.div
              key={b.text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-2 text-sm text-[hsl(30,6%,60%)]"
            >
              <b.icon className="h-4 w-4 text-[hsl(25,95%,53%)]" />
              <span>{b.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
