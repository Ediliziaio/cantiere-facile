import { useEffect } from "react";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import { CheckCircle2, XCircle, ArrowRight, HardHat } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
      <section className="pt-28 pb-20 md:pt-36 md:pb-28 bg-[#0F0E0D]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-block text-xs font-semibold uppercase tracking-widest text-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10 px-3 py-1 rounded-full mb-6"
          >
            {data.tag}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-landing-heading font-bold text-3xl md:text-5xl lg:text-6xl text-white leading-tight"
          >
            {data.headline}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 text-lg md:text-xl text-[hsl(30,6%,60%)] max-w-2xl mx-auto leading-relaxed"
          >
            {data.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-[hsl(var(--primary))] text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Prova gratis 14 giorni <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/#funzionalita"
              className="text-sm text-[hsl(30,6%,50%)] hover:text-white transition-colors"
            >
              Torna alle funzionalità →
            </Link>
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
      <section className="py-20 md:py-28 bg-[#0F0E0D]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-landing-heading font-bold text-2xl md:text-4xl text-white mb-4"
          >
            {data.ctaHeadline}
          </motion.h2>
          <p className="text-[hsl(30,6%,50%)] mb-8">{data.ctaSubtitle}</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-[hsl(var(--primary))] text-white font-semibold px-8 py-3.5 rounded-lg text-lg hover:opacity-90 transition-opacity"
          >
            Inizia gratis oggi <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}

function PainSection({ headline, pains }: { headline: string; pains: Pain[] }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  return (
    <section className="py-20 md:py-28 bg-white" ref={ref}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="font-landing-heading font-bold text-2xl md:text-3xl text-[hsl(var(--foreground))] text-center mb-12"
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
              className="flex items-start gap-3 bg-[hsl(var(--destructive))]/5 border border-[hsl(var(--destructive))]/10 rounded-lg p-5"
            >
              <XCircle className="h-5 w-5 text-[hsl(var(--destructive))] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[hsl(var(--foreground))]">{p.text}</p>
                {p.cost && <p className="text-xs text-[hsl(var(--destructive))] font-semibold mt-1">{p.cost}</p>}
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
    <section className="py-20 md:py-28 bg-[hsl(var(--muted))]" ref={ref}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="font-landing-heading font-bold text-2xl md:text-3xl text-[hsl(var(--foreground))] text-center mb-14"
        >
          Come funziona
        </motion.h2>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <div className="mx-auto w-14 h-14 rounded-full bg-[hsl(var(--primary))]/10 flex items-center justify-center mb-4">
                <s.icon className="h-6 w-6 text-[hsl(var(--primary))]" />
              </div>
              <div className="text-xs font-bold text-[hsl(var(--primary))] mb-2">STEP {i + 1}</div>
              <h3 className="font-landing-heading font-bold text-lg text-[hsl(var(--foreground))] mb-2">{s.title}</h3>
              <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{s.description}</p>
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
    <section className="py-16 md:py-24 bg-[#0F0E0D]" ref={ref}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
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
              className="text-center"
            >
              <div className="font-landing-heading font-bold text-3xl md:text-4xl text-[hsl(var(--primary))]">
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
    <section className="py-20 md:py-28 bg-white" ref={ref}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="font-landing-heading font-bold text-2xl md:text-3xl text-[hsl(var(--foreground))] text-center mb-14"
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
              className="bg-[hsl(var(--muted))] rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="w-10 h-10 rounded-lg bg-[hsl(var(--primary))]/10 flex items-center justify-center mb-4">
                <f.icon className="h-5 w-5 text-[hsl(var(--primary))]" />
              </div>
              <h3 className="font-landing-heading font-bold text-base text-[hsl(var(--foreground))] mb-2">{f.title}</h3>
              <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{f.description}</p>
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
    <section className="py-20 md:py-28 bg-[hsl(var(--muted))]" ref={ref}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="text-4xl mb-6">💬</div>
          <blockquote className="font-landing-heading text-xl md:text-2xl text-[hsl(var(--foreground))] leading-relaxed italic">
            "{testimonial.quote}"
          </blockquote>
          <div className="mt-6">
            <div className="font-semibold text-[hsl(var(--foreground))]">{testimonial.name}</div>
            <div className="text-sm text-[hsl(var(--muted-foreground))]">{testimonial.role} — {testimonial.company}</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FaqSection({ faqs }: { faqs: Faq[] }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  return (
    <section className="py-20 md:py-28 bg-white" ref={ref}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="font-landing-heading font-bold text-2xl md:text-3xl text-[hsl(var(--foreground))] text-center mb-12"
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
              <AccordionItem value={`faq-${i}`} className="border border-[hsl(var(--border))] rounded-lg px-4">
                <AccordionTrigger className="text-sm font-medium text-[hsl(var(--foreground))] hover:no-underline">
                  {f.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
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
