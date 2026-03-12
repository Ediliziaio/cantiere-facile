import { motion } from "framer-motion";
import { Users } from "lucide-react";

const logos = [
  "/logos/costruzioni-rossi.png",
  "/logos/edilmaster-group.png",
  "/logos/impresa-bianchi.png",
  "/logos/gec-lombarda.png",
  "/logos/impresa-verdi.png",
  "/logos/rizzo-costruzioni.png",
];

export default function SocialProofBar() {
  return (
    <section className="py-10 bg-[#FAFAF9] border-b border-[hsl(30,6%,90%)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-2 text-sm font-medium text-[hsl(25,5%,45%)] mb-6"
        >
          <Users className="h-4 w-4 text-[hsl(25,95%,53%)]" />
          Scelto da oltre 200 imprese edili in Italia
        </motion.div>
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 opacity-40 grayscale">
          {logos.map((logo) => (
            <img
              key={logo}
              src={logo}
              alt=""
              className="h-7 md:h-8 object-contain"
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
