import FeaturePageTemplate, { type FeaturePageData } from "@/components/landing/FeaturePageTemplate";
import { PenTool, Send, FileCheck, Shield, Clock, Smartphone, Lock, BarChart3 } from "lucide-react";

const data: FeaturePageData = {
  tag: "Firma Digitale",
  headline: "60 secondi per firmare un verbale. Dal cantiere. Col dito.",
  subtitle: "Niente più 'te lo mando per email'. Carica, posiziona, invia. Il firmatario apre il link dal telefono e firma. Il PDF certificato si genera in automatico.",
  painHeadline: "Senza firma digitale, i tuoi documenti non valgono niente.",
  pains: [
    { text: "Hai mandato il verbale per email. Nessuno lo ha firmato. In tribunale, è carta straccia.", cost: "Documenti senza valore legale" },
    { text: "Il collaudo è pronto ma mancano 3 firme. Aspetti 2 settimane per raccoglierle tutte.", cost: "Ritardi e costi di cantiere" },
    { text: "Stampi il documento, lo fai firmare a mano, lo scansioni, lo ricarichi. Per ogni documento.", cost: "30 minuti persi ogni volta" },
    { text: "Non sai chi ha firmato, quando, e se il documento è stato modificato dopo la firma.", cost: "Zero tracciabilità" },
  ],
  steps: [
    { icon: PenTool, title: "Carica e configura", description: "Carica il PDF, posiziona i campi firma dove servono con drag & drop. Scegli i firmatari e l'ordine di firma." },
    { icon: Send, title: "Invia il link", description: "Ogni firmatario riceve un link univoco via email o SMS. Apre dal telefono, legge il documento, firma con il dito o via OTP." },
    { icon: FileCheck, title: "PDF certificato", description: "Il sistema genera automaticamente il PDF firmato con certificato allegato, hash di integrità e timestamp." },
  ],
  stats: [
    { value: 60, suffix: " sec", label: "Tempo medio per firma" },
    { value: 90, suffix: "%", prefix: "-", label: "Tempo vs firma cartacea" },
    { value: 100, suffix: "%", label: "Valore legale (CAD)" },
    { value: 0, suffix: "", label: "Carta stampata" },
  ],
  features: [
    { icon: Smartphone, title: "Firma dal telefono", description: "Il firmatario apre il link dal proprio smartphone, visualizza il documento e firma con il dito direttamente sullo schermo. Nessuna app da installare." },
    { icon: Shield, title: "Conforme al CAD", description: "La firma elettronica avanzata è conforme al D.Lgs. 82/2005 (Codice dell'Amministrazione Digitale). Vale legalmente come firma autografa." },
    { icon: Lock, title: "Integrità garantita", description: "Ogni documento firmato ha un hash SHA-256 univoco. Se qualcuno modifica anche solo un pixel, l'hash cambia e la manomissione è rilevata." },
    { icon: Clock, title: "Timestamp certificato", description: "Ogni firma include un timestamp verificabile. Sai esattamente chi ha firmato, quando, da quale dispositivo e da quale IP." },
    { icon: BarChart3, title: "Tracking in tempo reale", description: "Vedi in tempo reale chi ha firmato e chi no. Invia solleciti automatici ai firmatari che non hanno ancora completato." },
    { icon: FileCheck, title: "Certificato allegato", description: "Ogni PDF firmato include un certificato di conformità con tutti i dettagli della firma: data, ora, metodo, identità del firmatario." },
  ],
  testimonial: {
    quote: "Un collaudo che prima richiedeva 10 giorni per raccogliere le firme, ora si chiude in 2 ore. Il committente ha firmato dal telefono mentre era in macchina.",
    name: "Andrea Moretti",
    role: "Direttore Lavori",
    company: "Moretti & Partners",
  },
  faqs: [
    { question: "La firma digitale ha valore legale?", answer: "Sì. La firma elettronica avanzata (FEA) è disciplinata dal Regolamento eIDAS e dal D.Lgs. 82/2005. Ha pieno valore legale e probatorio nei rapporti tra privati." },
    { question: "Il firmatario deve avere un account?", answer: "No. Il firmatario riceve un link univoco e firma direttamente dal browser del suo smartphone. Nessuna registrazione necessaria." },
    { question: "Posso firmare documenti con più firmatari?", answer: "Sì. Puoi configurare firme parallele (tutti firmano contemporaneamente) o sequenziali (in un ordine specifico). Il sistema gestisce automaticamente i turni." },
    { question: "Come verifico l'autenticità di un documento firmato?", answer: "Ogni documento firmato ha un QR code e un link di verifica. Chiunque può verificare l'autenticità e l'integrità del documento in qualsiasi momento." },
  ],
  ctaHeadline: "Firma tutto. Da ovunque. In 60 secondi.",
  ctaSubtitle: "Attiva la firma digitale per il tuo cantiere. Gratis per 14 giorni.",
};

export default function FunzionalitaFirma() {
  return <FeaturePageTemplate data={data} />;
}
