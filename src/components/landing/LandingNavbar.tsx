import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Menu, X } from "lucide-react";
import logoDark from "@/assets/logo-dark.png";
import logoLight from "@/assets/logo-light.png";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Funzionalità", to: "/funzionalita" },
  { label: "Tariffe", to: "/tariffe" },
  { label: "Chi siamo", to: "/chi-siamo" },
];

export default function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 400], [0, 1]);
  const shadow = useTransform(scrollY, [0, 400], ["0px 0px 0px rgba(0,0,0,0)", "0px 1px 12px rgba(0,0,0,0.08)"]);

  // Color transitions: white (on dark hero) → dark (on scrolled white bg)
  const linkColor = useTransform(scrollY, [0, 400], ["rgba(255,255,255,0.7)", "hsl(25,5%,45%)"]);
  const linkHoverColor = "hsl(25,95%,53%)";
  const menuIconColor = useTransform(scrollY, [0, 400], ["rgba(255,255,255,1)", "hsl(20,14%,8%)"]);
  const btnTextColor = useTransform(scrollY, [0, 400], ["rgba(255,255,255,0.9)", "hsl(20,14%,8%)"]);
  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 border-b border-transparent"
        style={{
          backgroundColor: useTransform(bgOpacity, (v) => `rgba(255,255,255,${v})`),
          boxShadow: shadow,
          borderColor: useTransform(bgOpacity, (v) => `rgba(0,0,0,${v * 0.06})`),
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <motion.img
              src={logoDark}
              alt="Cantiere in Cloud"
              className="h-10"
              style={{ opacity: useTransform(scrollY, [0, 400], [1, 0]) }}
            />
            <motion.img
              src={logoLight}
              alt="Cantiere in Cloud"
              className="h-10 absolute"
              style={{ opacity: useTransform(scrollY, [0, 400], [0, 1]) }}
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to}>
                <motion.span
                  className="font-landing-body text-sm font-medium transition-colors"
                  style={{ color: linkColor }}
                  whileHover={{ color: linkHoverColor }}
                >
                  {l.label}
                </motion.span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild className="font-landing-body">
              <Link to="/login">
                <motion.span style={{ color: btnTextColor }}>Accedi</motion.span>
              </Link>
            </Button>
            <Button size="sm" asChild className="font-landing-body rounded-full bg-[hsl(25,95%,53%)] hover:bg-[hsl(25,95%,48%)]">
              <Link to="/register">Prova gratis</Link>
            </Button>
          </div>

          <motion.button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(true)}
            aria-label="Menu"
            style={{ color: menuIconColor }}
          >
            <Menu className="h-6 w-6" />
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <motion.div
          className="fixed inset-0 z-[60] bg-white flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center justify-between px-4 h-16">
            <Link to="/" className="flex items-center">
              <img src={logoLight} alt="Cantiere in Cloud" className="h-10" />
            </Link>
            <button onClick={() => setMobileOpen(false)} aria-label="Chiudi">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-col items-center gap-6 pt-12">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className="font-landing-body text-xl font-medium text-[hsl(20,14%,8%)]"
              >
                {l.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 w-full px-8 pt-6">
              <Button variant="outline" asChild className="font-landing-body w-full">
                <Link to="/login">Accedi</Link>
              </Button>
              <Button asChild className="font-landing-body w-full rounded-full bg-[hsl(25,95%,53%)] hover:bg-[hsl(25,95%,48%)]">
                <Link to="/register">Prova gratis</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
