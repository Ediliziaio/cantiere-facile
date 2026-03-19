import { Link } from "react-router-dom";
import logoDark from "@/assets/logo-dark.png";

const cols = [
  {
    title: "Prodotto",
    links: [
      { label: "Funzionalità", href: "/funzionalita" },
      { label: "Tariffe", href: "/tariffe" },
      { label: "Documenti", href: "/funzionalita/documenti" },
      { label: "Firma Digitale", href: "/funzionalita/firma" },
    ],
  },
  {
    title: "Azienda",
    links: [
      { label: "Chi siamo", href: "/chi-siamo" },
      { label: "Blog", href: "#" },
      { label: "Contatti", href: "#" },
      { label: "Partnership", href: "#" },
    ],
  },
  {
    title: "Legale",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Termini", href: "#" },
      { label: "Cookie", href: "#" },
      { label: "GDPR", href: "#" },
    ],
  },
];

export default function LandingFooter() {
  return (
    <footer className="bg-[#0F0E0D] border-t border-white/5 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="mb-4 inline-block">
              <img src={logoDark} alt="Cantiere in Cloud" className="h-8" />
            </Link>
            <p className="font-landing-body text-sm text-[hsl(30,6%,50%)] leading-relaxed">
              La sicurezza del tuo cantiere, sempre sotto controllo.
            </p>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="font-landing-body font-semibold text-sm text-white mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="font-landing-body text-sm text-[hsl(30,6%,50%)] hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-6 text-center">
          <p className="font-landing-body text-xs text-[hsl(30,6%,40%)]">
            © 2026 Cantiere in Cloud S.r.l. — P.IVA IT00000000000
          </p>
        </div>
      </div>
    </footer>
  );
}
