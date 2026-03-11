import FeaturePageTemplate, { type FeaturePageData } from "@/components/landing/FeaturePageTemplate";
import { MapPin, QrCode, Clock, Shield, BarChart3, Users, Navigation, AlertTriangle } from "lucide-react";

const data: FeaturePageData = {
  tag: "Controllo Accessi Geo",
  headline: "GPS + QR code.",
  headlineAccent: "Nessuno può timbrare da casa.",
  subtitle: "Sai esattamente chi è in cantiere, da quando, e se è autorizzato. In tempo reale. Con coordinate GPS verificate.",
  painHeadline: "Senza controllo accessi, il cantiere è una porta aperta.",
  pains: [
    { text: "Non sai chi è entrato stamattina. Non sai chi è ancora dentro. Se succede un incidente, non hai i dati.", cost: "Responsabilità penale diretta" },
    { text: "Le presenze vengono segnate a mano su un foglio. Nessuno le controlla. Nessuno le archivia.", cost: "Dati inaffidabili e contestabili" },
    { text: "Un lavoratore timbra per un collega che è a casa. Nessuno se ne accorge.", cost: "Frode documentale" },
    { text: "Il committente chiede il report presenze. Passi 3 ore a ricostruire i dati da WhatsApp e fogli Excel.", cost: "Tempo perso, dati incompleti" },
  ],
  steps: [
    { icon: QrCode, title: "Scansiona il QR", description: "All'ingresso del cantiere c'è un QR code. Il lavoratore lo scansiona con il proprio smartphone. Niente badge fisici, niente tornelli." },
    { icon: Navigation, title: "Verifica GPS automatica", description: "Il sistema verifica che il lavoratore sia fisicamente dentro il perimetro del cantiere. Se è fuori range, l'accesso viene segnalato." },
    { icon: Clock, title: "Log completo", description: "Ogni ingresso e uscita è registrato con orario, coordinate GPS e durata. Report presenze pronti in un click." },
  ],
  stats: [
    { value: 100, suffix: "%", label: "Accessi verificati GPS" },
    { value: 0, suffix: "", label: "Timbrature false" },
    { value: 5, suffix: " sec", label: "Per un check-in" },
    { value: 1, suffix: " click", label: "Per il report giornaliero" },
  ],
  features: [
    { icon: MapPin, title: "Geofence configurabile", description: "Definisci il perimetro del cantiere sulla mappa. Il sistema verifica automaticamente che ogni check-in avvenga all'interno." },
    { icon: Users, title: "Presenze in tempo reale", description: "Dashboard live con tutti i lavoratori presenti in cantiere. Sai chi c'è e chi non c'è in ogni momento." },
    { icon: BarChart3, title: "Report automatici", description: "Report presenze giornalieri, settimanali, mensili. Esportabili in PDF o Excel. Pronti per DL, committenti e ispettori." },
    { icon: Shield, title: "Anti-frode integrato", description: "GPS + device fingerprint + timestamp. Impossibile timbrare per un collega o da una posizione diversa dal cantiere." },
    { icon: AlertTriangle, title: "Alert accessi anomali", description: "Lavoratore non autorizzato? Documenti scaduti? Il sistema blocca il check-in e ti avvisa immediatamente." },
    { icon: Clock, title: "Storico completo", description: "Ogni accesso è archiviato con tutti i dettagli. In caso di incidente o contestazione, hai i dati certificati." },
  ],
  testimonial: {
    quote: "Prima delle timbrature GPS, avevamo presenze 'fantasma' ogni settimana. Ora sappiamo esattamente chi c'è e per quanto tempo. Il committente è impressionato.",
    name: "Laura Conti",
    role: "Project Manager",
    company: "Conti Edilizia S.p.A.",
  },
  faqs: [
    { question: "Serve installare hardware nel cantiere?", answer: "No. Basta stampare e affiggere il QR code del cantiere. I lavoratori usano il proprio smartphone. Zero costi di installazione." },
    { question: "Funziona senza connessione internet?", answer: "Il lavoratore ha bisogno di connessione per scansionare il QR. In zone con scarsa copertura, il sistema salva i dati offline e li sincronizza appena la rete torna disponibile." },
    { question: "Come gestite la privacy e il GPS?", answer: "Il GPS viene utilizzato SOLO al momento del check-in/check-out. Non tracciamo la posizione continua del lavoratore. Tutto è conforme al GDPR e alla normativa sulla privacy." },
    { question: "Posso usarlo per cantieri multipli?", answer: "Sì. Ogni cantiere ha il suo QR code e il suo geofence. Puoi gestire tutti i cantieri da un'unica dashboard con report separati o aggregati." },
  ],
  ctaHeadline: "Sai chi c'è in cantiere. Sempre.",
  ctaSubtitle: "Attiva il controllo accessi geolocalizzato. Gratis per 14 giorni.",
};

export default function FunzionalitaAccessi() {
  return <FeaturePageTemplate data={data} />;
}
