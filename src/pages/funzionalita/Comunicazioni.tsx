import FeaturePageTemplate, { type FeaturePageData } from "@/components/landing/FeaturePageTemplate";
import { MessageSquare, Paperclip, Clock, Shield, Download, Users, Search, Bell } from "lucide-react";

const data: FeaturePageData = {
  tag: "Comunicazioni",
  headline: "Ogni messaggio è timestampato. Hai sempre le prove.",
  subtitle: "Basta WhatsApp, basta email perse, basta 'non l'ho mai ricevuto'. Ogni comunicazione è tracciata, archiviata e scaricabile in PDF. In caso di controversia, hai tutto.",
  painHeadline: "Senza comunicazioni tracciate, sei vulnerabile.",
  pains: [
    { text: "Il subappaltatore dice 'non mi avete mai comunicato la modifica'. Tu sai di averlo fatto. Ma su WhatsApp hai cancellato la chat.", cost: "Contestazione senza prove" },
    { text: "L'ordine di servizio è stato mandato per email. Si è perso tra 200 email. Nessuno lo ha letto.", cost: "Lavori eseguiti in modo errato" },
    { text: "Il committente vuole lo storico delle comunicazioni con il subappaltatore. Tu devi ricostruirlo da 3 canali diversi.", cost: "Ore di lavoro buttate" },
    { text: "Foto dal cantiere inviate su WhatsApp. Il telefono si rompe. Le foto sono perse per sempre.", cost: "Documentazione irrecuperabile" },
  ],
  steps: [
    { icon: MessageSquare, title: "Scrivi nel canale", description: "Ogni cantiere ha il suo canale di comunicazione. Scrivi messaggi, allega foto, PDF, video. Tutto è archiviato automaticamente." },
    { icon: Paperclip, title: "Allega dal cantiere", description: "Scatta una foto dal cantiere e allegala direttamente. Il file è archiviato con data, ora e posizione GPS." },
    { icon: Download, title: "Scarica le prove", description: "In qualsiasi momento puoi scaricare lo storico completo delle comunicazioni in PDF. Ogni messaggio ha timestamp e identità del mittente." },
  ],
  stats: [
    { value: 100, suffix: "%", label: "Messaggi tracciati" },
    { value: 0, suffix: "", label: "Comunicazioni perse" },
    { value: 1, suffix: " click", label: "Per esportare in PDF" },
    { value: 24, suffix: "/7", label: "Accessibilità archivio" },
  ],
  features: [
    { icon: Clock, title: "Timestamp certificato", description: "Ogni messaggio ha data e ora certificati. Sai esattamente quando è stato inviato, letto e da chi. Non è modificabile." },
    { icon: Shield, title: "Valore probatorio", description: "Le comunicazioni tracciate hanno valore legale in caso di contestazione. Il PDF esportato include tutti i metadati necessari." },
    { icon: Paperclip, title: "Allegati multimediali", description: "Foto, video, PDF, documenti tecnici. Tutto allegabile ai messaggi. Tutto archiviato nel cloud con backup automatici." },
    { icon: Users, title: "Canali per cantiere", description: "Ogni cantiere ha il suo canale. Puoi comunicare con subappaltatori, committenti, DL e CSE in canali separati o condivisi." },
    { icon: Search, title: "Ricerca full-text", description: "Cerca qualsiasi parola in qualsiasi conversazione. Trova subito il messaggio che ti serve, anche tra migliaia di comunicazioni." },
    { icon: Bell, title: "Notifiche intelligenti", description: "Ricevi notifiche push e via email per nuovi messaggi. Configura le priorità: urgente, normale, informativo." },
  ],
  testimonial: {
    quote: "In una controversia con un subappaltatore, abbiamo esportato lo storico delle comunicazioni in PDF. Il giudice ha visto tutto: date, orari, contenuti. Caso chiuso in 5 minuti.",
    name: "Francesca Russo",
    role: "Responsabile Legale",
    company: "Gruppo Russo Costruzioni",
  },
  faqs: [
    { question: "Posso sostituire completamente WhatsApp?", answer: "Sì. Le comunicazioni di cantiere includono messaggi di testo, allegati multimediali, e notifiche push. A differenza di WhatsApp, tutto è tracciato, archiviato e ha valore legale." },
    { question: "Chi può accedere ai canali di comunicazione?", answer: "Tu controlli gli accessi. Puoi creare canali per singolo cantiere e decidere chi può leggere e scrivere: subappaltatori, committenti, DL, CSE, o team interni." },
    { question: "I messaggi sono modificabili dopo l'invio?", answer: "No. Una volta inviato, il messaggio è registrato con timestamp e non può essere modificato o cancellato. Questo garantisce l'integrità dello storico comunicativo." },
    { question: "Come funziona l'esportazione PDF?", answer: "Con un click esporti l'intero storico di un canale o di un periodo specifico. Il PDF include ogni messaggio con data, ora, mittente e allegati. Pronto per uso legale." },
  ],
  ctaHeadline: "Mai più 'non l'ho mai ricevuto'.",
  ctaSubtitle: "Attiva le comunicazioni tracciate. Gratis per 14 giorni.",
};

export default function FunzionalitaComunicazioni() {
  return <FeaturePageTemplate data={data} />;
}
