import { useEffect } from "react";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import { ArrowRight, XCircle, CheckCircle2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import LandingNavbar from "./LandingNavbar";
import LandingFooter from "./LandingFooter";

interface Stat {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
}

interface Pain {
  text: string;
  cost?: string;
}

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface SubFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface Faq {
  question: string;
  answer: string;
}

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
}

export interface FeaturePageData {
  tag: string;
  headline: string;
  headlineAccent: string;
  subtitle: string;
  pains: Pain[];
  painHeadline: string;
  steps: Step[];
  stats: Stat[];
  features: SubFeature[];
  testimonial: Testimonial;
  faqs: Faq[];
  ctaHeadline: string;
  ctaSubtitle: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

function AnimatedCounter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix: string }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, (v) => `${prefix}${Math.round(v)}${suffix}`);

  useEffect(() => {
    if (inView) motionVal.set(value);
  }, [inView, value, motionVal]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

export default function FeaturePageTemplate({ data }: { data: FeaturePageData }) {
  return (
    <div className="font-landing-body">
      <LandingNavbar />

      {/* Hero */}
      <section className="relative bg-[#0F0E0D] overflow-hidden">
        {/* Orange radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[hsl(25,95%,53%)] opacity-[0.07] rounded-full blur-[120px] pointer-events-none" />

        {/* Floating shapes */}
        <div className="absolute top-20 left-[10%] w-16 h-16 border border-[hsl(25,95%,53%)]/20 rounded-lg animate-float-slow pointer-events-none" />
        <div className="absolute top-40 right-[15%] w-10 h-10 border border-[hsl(38,92%,64%)]/15 rounded-full animate-float-slow-reverse pointer-events-none" />
        <div className="absolute bottom-32 left-[20%] w-8 h-8 bg-[hsl(25,95%,53%)]/10 rounded animate-float-slow pointer-events-none" />
        <div className="absolute bottom-20 right-[10%] w-12 h-12 border border-[hsl(25,95%,53%)]/15 rounded-lg rotate-45 animate-float-slow-reverse pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-20 md:pt-36 md:pb-28">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            <motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(25,95%,53%)]/30 text-[hsl(25,95%,53%)] text-sm font-landing-body font-medium">
                {data.tag}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mt-6 font-landing-heading font-bold text-3xl sm:text-4xl md:text-[3.5rem] text-white leading-[1.1] tracking-tight"
            >
              {data.headline}
              <br />
              <span className="text-[hsl(25,95%,53%)]">{data.headlineAccent}</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mt-5 text-lg md:text-xl text-[hsl(30,6%,60%)] font-landing-body leading-relaxed max-w-[600px]"
            >
              {data.subtitle}
            </motion.p>

            <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="mt-8 flex flex-col sm:flex-row items-start gap-3">
              <Button
                size="lg"
                asChild
                className="rounded-full bg-[hsl(25,95%,53%)] hover:bg-[hsl(25,95%,48%)] text-white font-landing-body text-base px-8 h-12"
              >
                <Link to="/register">
                  Prova gratis 14 giorni
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Link
                to="/#funzionalita"
                className="text-sm text-[hsl(30,6%,50%)] hover:text-white transition-colors h-12 flex items-center"
              >
                ← Torna alle funzionalità
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-sm text-[hsl(30,6%,50%)] font-landing-body">
              <span>✓ Setup in 15 minuti</span>
              <span>✓ Prova 14 giorni gratis</span>
              <span>✓ Cancelli quando vuoi</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pain Points */}
      <PainSection headline={data.painHeadline} pains={data.pains} />

      {/* How It Works */}
      <StepsSection steps={data.steps} />

      {/* Stats */}
      <StatsSection stats={data.stats} />

      {/* Feature Deep-Dive */}
      <FeaturesGrid features={data.features} />

      {/* Testimonial */}
      <TestimonialSection testimonial={data.testimonial} />

      {/* FAQ */}
      <FaqSection faqs={data.faqs} />

      {/* CTA */}
      <section className="relative py-20 md:py-28 bg-[#0F0E0D] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[hsl(25,95%,53%)] opacity-[0.06] rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-landing-heading font-bold text-2xl md:text-4xl text-white mb-4"
          >
            {data.ctaHeadline}
          </motion.h2>
          <p className="text-[hsl(30,6%,50%)] mb-8">{data.ctaSubtitle}</p>
          <Button
            size="lg"
            asChild
            className="rounded-full bg-[hsl(25,95%,53%)] hover:bg-[hsl(25,95%,48%)] text-white font-landing-body text-lg px-10 h-14"
          >
            <Link to="/register">
              Inizia gratis oggi <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}

function PainSection({ headline, pains }: { headline: string; pains: Pain[] }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  return (
    <section className="py-20 md:py-28 bg-[#0F0E0D] border-t border-white/5" ref={ref}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="font-landing-heading font-bold text-2xl md:text-3xl text-white text-center mb-12"
        >
          {headline}
        </motion.h2>
        <div className="grid gap-4 md:grid-cols-2">
          {pains.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3 bg-[hsl(0,84%,60%)]/5 border border-[hsl(0,84%,60%)]/10 rounded-lg p-5"
            >
              <XCircle className="h-5 w-5 text-[hsl(0,84%,60%)] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white/90">{p.text}</p>
                {p.cost && <p className="text-xs text-[hsl(0,84%,60%)] font-semibold mt-1">{p.cost}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepsSection({ steps }: { steps: Step[] }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  return (
    <section className="py-20 md:py-28 bg-[#131211]" ref={ref}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="font-landing-heading font-bold text-2xl md:text-3xl text-white text-center mb-14"
        >
          Come funziona
        </motion.h2>
        <div className="grid gap-8 md:grid-cols-3 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-7 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-[hsl(25,95%,53%)]/30 via-[hsl(25,95%,53%)]/50 to-[hsl(25,95%,53%)]/30" />
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15 }}
              className="text-center relative"
            >
              <div className="mx-auto w-14 h-14 rounded-full bg-[hsl(25,95%,53%)]/10 border border-[hsl(25,95%,53%)]/20 flex items-center justify-center mb-4 relative z-10">
                <s.icon className="h-6 w-6 text-[hsl(25,95%,53%)]" />
              </div>
              <div className="text-xs font-bold text-[hsl(25,95%,53%)] mb-2 font-landing-body tracking-widest">STEP {i + 1}</div>
              <h3 className="font-landing-heading font-bold text-lg text-white mb-2">{s.title}</h3>
              <p className="text-sm text-[hsl(30,6%,50%)] leading-relaxed">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection({ stats }: { stats: Stat[] }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });
  return (
    <section className="relative py-16 md:py-24 bg-[#0F0E0D] overflow-hidden" ref={ref}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[hsl(25,95%,53%)] opacity-[0.05] rounded-full blur-[100px] pointer-events-none" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="font-landing-heading font-bold text-xl md:text-2xl text-white text-center mb-12"
        >
          Risultati concreti dei nostri clienti
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.1 }}
              className="text-center bg-white/5 rounded-xl p-6 border border-white/5"
            >
              <div className="font-landing-heading font-bold text-3xl md:text-4xl text-[hsl(25,95%,53%)]">
                <AnimatedCounter value={s.value} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <div className="text-sm text-[hsl(30,6%,50%)] mt-2">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesGrid({ features }: { features: SubFeature[] }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <section className="py-20 md:py-28 bg-[#131211]" ref={ref}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="font-landing-heading font-bold text-2xl md:text-3xl text-white text-center mb-14"
        >
          Tutto nel dettaglio
        </motion.h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08 }}
              className="bg-white/5 rounded-xl p-6 border border-white/5 hover:border-[hsl(25,95%,53%)]/20 hover:bg-white/[0.07] transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-lg bg-[hsl(25,95%,53%)]/10 flex items-center justify-center mb-4 group-hover:bg-[hsl(25,95%,53%)]/20 transition-colors">
                <f.icon className="h-5 w-5 text-[hsl(25,95%,53%)]" />
              </div>
              <h3 className="font-landing-heading font-bold text-base text-white mb-2">{f.title}</h3>
              <p className="text-sm text-[hsl(30,6%,50%)] leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialSection({ testimonial }: { testimonial: Testimonial }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });
  return (
    <section className="py-20 md:py-28 bg-[#0F0E0D]" ref={ref}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="bg-white/5 rounded-2xl p-8 md:p-12 border border-white/5"
        >
          <div className="text-4xl mb-6">💬</div>
          <blockquote className="font-landing-heading text-xl md:text-2xl text-white leading-relaxed italic">
            "{testimonial.quote}"
          </blockquote>
          <div className="mt-6">
            <div className="font-semibold text-white">{testimonial.name}</div>
            <div className="text-sm text-[hsl(30,6%,50%)]">{testimonial.role} — {testimonial.company}</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FaqSection({ faqs }: { faqs: Faq[] }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  return (
    <section className="py-20 md:py-28 bg-[#131211]" ref={ref}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="font-landing-heading font-bold text-2xl md:text-3xl text-white text-center mb-12"
        >
          Domande frequenti
        </motion.h2>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
            >
              <AccordionItem value={`faq-${i}`} className="border border-white/10 rounded-lg px-4 bg-white/5">
                <AccordionTrigger className="text-sm font-medium text-white hover:no-underline">
                  {f.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-[hsl(30,6%,50%)] leading-relaxed">
                  {f.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
