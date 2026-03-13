import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Smartphone,
  Share,
  PlusSquare,
  CheckCircle2,
  MoreVertical,
  Download,
  Wifi,
  Bell,
  Zap,
  HelpCircle,
  Apple,
  Chrome,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const iosSteps = [
  {
    icon: Share,
    title: "Tocca il pulsante Condividi",
    description:
      "Apri il sito in Safari e tocca l'icona di condivisione (il quadrato con la freccia verso l'alto) nella barra in basso.",
  },
  {
    icon: PlusSquare,
    title: 'Seleziona "Aggiungi a Home"',
    description:
      'Scorri le opzioni e tocca "Aggiungi a schermata Home". Conferma il nome e tocca "Aggiungi".',
  },
  {
    icon: CheckCircle2,
    title: "L'app è pronta!",
    description:
      "Troverai l'icona di Cantiere in Cloud nella schermata Home del tuo iPhone, proprio come un'app nativa.",
  },
];

const androidSteps = [
  {
    icon: MoreVertical,
    title: "Tocca il menu ⋮ in Chrome",
    description:
      "Apri il sito in Chrome e tocca i tre puntini verticali in alto a destra per aprire il menu.",
  },
  {
    icon: Download,
    title: 'Seleziona "Installa app"',
    description:
      'Tocca "Installa app" o "Aggiungi a schermo Home". Conferma l\'installazione nel popup.',
  },
  {
    icon: CheckCircle2,
    title: "L'app è pronta!",
    description:
      "L'icona apparirà nel launcher del tuo dispositivo. Aprila per un'esperienza a schermo intero.",
  },
];

const benefits = [
  {
    icon: Zap,
    title: "Accesso istantaneo",
    description: "Un tap dalla Home per accedere al cantiere. Niente browser, niente URL da ricordare.",
  },
  {
    icon: Wifi,
    title: "Funziona offline",
    description: "Consulta documenti e dati anche senza connessione. Sincronizzazione automatica al ritorno online.",
  },
  {
    icon: Bell,
    title: "Notifiche push",
    description: "Ricevi avvisi su scadenze, timbrature e comunicazioni direttamente sul dispositivo.",
  },
];

const faqs = [
  {
    q: "È gratuita?",
    a: "Sì, l'installazione è completamente gratuita. L'app utilizza la tecnologia PWA integrata nel tuo browser.",
  },
  {
    q: "Occupa spazio sul telefono?",
    a: "Pochissimo. A differenza delle app tradizionali, una PWA occupa solo pochi MB di spazio.",
  },
  {
    q: "Funziona su iPad e tablet Android?",
    a: "Assolutamente sì. L'app si adatta automaticamente a qualsiasi dimensione dello schermo.",
  },
  {
    q: "Come si aggiorna?",
    a: "Automaticamente! Ogni volta che apri l'app, viene scaricata l'ultima versione in background.",
  },
];

function StepCard({ step, index }: { step: typeof iosSteps[0]; index: number }) {
  const Icon = step.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
    >
      <Card className="border-border/60 bg-card/80 backdrop-blur-sm h-full">
        <CardContent className="p-6 flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[hsl(25,95%,53%)]/10 flex items-center justify-center relative">
            <Icon className="h-7 w-7 text-[hsl(25,95%,53%)]" />
            <span className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-[hsl(25,95%,53%)] text-white text-sm font-bold flex items-center justify-center font-landing-body">
              {index + 1}
            </span>
          </div>
          <h3 className="font-landing-heading font-bold text-lg text-foreground">{step.title}</h3>
          <p className="font-landing-body text-sm text-muted-foreground leading-relaxed">{step.description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Install() {
  return (
    <div className="font-landing-body bg-background min-h-screen">
      <LandingNavbar />

      {/* Hero */}
      <section className="pt-28 pb-16 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(25,95%,53%)]/5 to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-[hsl(25,95%,53%)] to-[hsl(25,95%,43%)] flex items-center justify-center shadow-lg"
          >
            <Smartphone className="h-10 w-10 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-landing-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            Installa{" "}
            <span className="text-[hsl(25,95%,53%)]">Cantiere in Cloud</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-xl mx-auto"
          >
            Aggiungi l'app alla schermata Home del tuo dispositivo in 30 secondi. Nessun download dallo store necessario.
          </motion.p>
        </div>
      </section>

      {/* Instructions Tabs */}
      <section className="pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="iphone" className="w-full">
            <TabsList className="grid w-full max-w-sm mx-auto grid-cols-2 mb-10">
              <TabsTrigger value="iphone" className="gap-2 font-landing-body">
                <Apple className="h-4 w-4" />
                iPhone
              </TabsTrigger>
              <TabsTrigger value="android" className="gap-2 font-landing-body">
                <Chrome className="h-4 w-4" />
                Android
              </TabsTrigger>
            </TabsList>

            <TabsContent value="iphone">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {iosSteps.map((step, i) => (
                  <StepCard key={i} step={step} index={i} />
                ))}
              </div>
              <p className="text-center text-sm text-muted-foreground mt-6">
                ⚠️ Su iPhone è necessario usare <strong>Safari</strong>. Chrome e altri browser non supportano l'installazione PWA su iOS.
              </p>
            </TabsContent>

            <TabsContent value="android">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {androidSteps.map((step, i) => (
                  <StepCard key={i} step={step} index={i} />
                ))}
              </div>
              <p className="text-center text-sm text-muted-foreground mt-6">
                💡 Su alcuni dispositivi Samsung, il browser predefinito mostra direttamente un banner "Installa".
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Benefits */}
      <section className="pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-landing-heading text-2xl sm:text-3xl font-bold text-center text-foreground mb-10">
            Perché installare l'app?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="border-border/60 h-full">
                    <CardContent className="p-6 text-center flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[hsl(25,95%,53%)]/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-[hsl(25,95%,53%)]" />
                      </div>
                      <h3 className="font-landing-heading font-bold text-foreground">{b.title}</h3>
                      <p className="text-sm text-muted-foreground">{b.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-8">
            <HelpCircle className="h-5 w-5 text-[hsl(25,95%,53%)]" />
            <h2 className="font-landing-heading text-2xl font-bold text-foreground">Domande frequenti</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="font-landing-body text-left font-medium">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="font-landing-body text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Back CTA */}
      <section className="pb-16 px-4 sm:px-6 text-center">
        <Button variant="outline" asChild className="font-landing-body gap-2">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Torna alla Home
          </Link>
        </Button>
      </section>

      <LandingFooter />
    </div>
  );
}
