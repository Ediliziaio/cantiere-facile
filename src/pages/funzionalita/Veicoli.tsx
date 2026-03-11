import FeaturePageTemplate, { type FeaturePageData } from "@/components/landing/FeaturePageTemplate";
import { Truck, Bell, ClipboardList, Shield, MapPin, FileText, Wrench, BarChart3 } from "lucide-react";

const data: FeaturePageData = {
  tag: "Gestione Veicoli",
  headline: "Revisione scaduta = mezzo fermo = cantiere fermo. Mai più.",
  subtitle: "Ogni mezzo d'opera ha la sua anagrafica digitale: targa, assicurazione, revisione, cantiere di assegnazione. Scadenze sotto controllo, sempre.",
  painHeadline: "Senza gestione veicoli, il rischio è enorme.",
  pains: [
    { text: "L'escavatore ha la revisione scaduta da 2 mesi. Lo scopri quando arriva l'ispettore.", cost: "Fermo mezzo + sanzione fino a €5.000" },
    { text: "L'assicurazione del camion è scaduta. Ha un incidente nel tragitto verso il cantiere.", cost: "Responsabilità civile e penale" },
    { text: "Il committente chiede l'elenco mezzi in cantiere per il POS. Tu non sai quali sono entrati e usciti.", cost: "POS non aggiornato = irregolarità" },
    { text: "Il libretto di un mezzo è in ufficio. Il mezzo è in cantiere a 50 km. Serve adesso.", cost: "Tempo e spostamenti inutili" },
  ],
  steps: [
    { icon: ClipboardList, title: "Registra il mezzo", description: "Inserisci i dati del mezzo: tipo, targa, proprietario, documenti. Carica assicurazione, revisione e libretto. Tutto digitale." },
    { icon: Bell, title: "Scadenze automatiche", description: "Il sistema monitora assicurazione e revisione. Alert 30, 7, 1 giorno prima. Tu e il proprietario del mezzo siete sempre avvisati." },
    { icon: MapPin, title: "Assegna al cantiere", description: "Associa ogni mezzo al cantiere di utilizzo. L'elenco mezzi per il POS si aggiorna automaticamente." },
  ],
  stats: [
    { value: 100, suffix: "%", label: "Mezzi monitorati" },
    { value: 0, suffix: "", label: "Revisioni scadute non rilevate" },
    { value: 30, suffix: " sec", label: "Per generare elenco POS" },
    { value: 95, suffix: "%", label: "Riduzione fermi mezzo" },
  ],
  features: [
    { icon: Truck, title: "Anagrafica completa", description: "Ogni mezzo ha la sua scheda: tipo, marca, modello, targa, numero telaio, proprietario, certificazioni. Tutto in un posto." },
    { icon: Shield, title: "Documenti sempre validi", description: "Assicurazione, revisione, libretto, certificato CE: il sistema traccia ogni scadenza e avvisa in anticipo." },
    { icon: MapPin, title: "Assegnazione cantiere", description: "Associa ogni mezzo al cantiere dove opera. Data ingresso, data uscita, motivo. Storico completo." },
    { icon: FileText, title: "Elenco mezzi POS", description: "Genera in un click l'elenco dei mezzi presenti in cantiere, con tutti i dati richiesti dal Piano Operativo di Sicurezza." },
    { icon: Wrench, title: "Manutenzioni programmate", description: "Registra le manutenzioni ordinarie e straordinarie. Il sistema ti ricorda quando è ora del prossimo intervento." },
    { icon: BarChart3, title: "Dashboard flotta", description: "Vista d'insieme di tutti i tuoi mezzi: quanti sono in regola, quanti in scadenza, quanti fermi. Tutto in un colpo d'occhio." },
  ],
  testimonial: {
    quote: "Avevamo un escavatore con revisione scaduta da 45 giorni. Nessuno se n'era accorto. Con Cantiere in Cloud, non può più succedere.",
    name: "Roberto Verdi",
    role: "Responsabile Mezzi",
    company: "Verdi Movimento Terra S.r.l.",
  },
  faqs: [
    { question: "Posso gestire mezzi di subappaltatori?", answer: "Sì. Ogni subappaltatore può registrare i propri mezzi dal portale dedicato, oppure puoi farlo tu centralmente. I documenti del mezzo sono visibili a chi ha i permessi." },
    { question: "Come funziona l'assegnazione al cantiere?", answer: "Dalla scheda del mezzo, selezioni il cantiere e le date di ingresso/uscita. Il mezzo compare automaticamente nell'elenco mezzi del cantiere e nel POS." },
    { question: "Posso esportare i dati per il POS?", answer: "Sì. L'elenco mezzi è esportabile in PDF con tutti i dati richiesti: tipo, targa, proprietario, stato assicurazione e revisione, certificazioni." },
    { question: "Gestite anche le manutenzioni?", answer: "Sì. Puoi registrare ogni manutenzione con data, tipo di intervento e prossima scadenza. Il sistema ti avvisa quando è ora del prossimo tagliando o controllo." },
  ],
  ctaHeadline: "I tuoi mezzi, sempre in regola.",
  ctaSubtitle: "Attiva la gestione veicoli. Gratis per 14 giorni.",
};

export default function FunzionalitaVeicoli() {
  return <FeaturePageTemplate data={data} />;
}
