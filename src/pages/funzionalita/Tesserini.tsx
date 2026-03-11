import FeaturePageTemplate, { type FeaturePageData } from "@/components/landing/FeaturePageTemplate";
import { CreditCard, QrCode, Smartphone, Camera, Shield, UserCheck, Printer, RefreshCw } from "lucide-react";

const data: FeaturePageData = {
  tag: "Tesserini Digitali",
  headline: "Il badge che l'ASL vuole vedere.",
  subtitle: "Conforme al D.L. 159/2025. Ogni lavoratore ha il suo tesserino digitale con QR code, sempre aggiornato, sempre con sé. Nessun hardware, nessuna stampante.",
  painHeadline: "Senza tesserini digitali, in cantiere succede questo.",
  pains: [
    { text: "L'ispettore chiede il tesserino. Il lavoratore non ce l'ha. Tu non sai dove sia il suo.", cost: "Verbale e sospensione immediata" },
    { text: "I badge cartacei si rovinano, si perdono, si dimenticano in auto.", cost: "Ristampa e tempo perso ogni settimana" },
    { text: "Cambia la mansione o scade un documento. Il badge cartaceo è già obsoleto.", cost: "Informazioni false in circolazione" },
    { text: "Devi stampare 50 tesserini per un nuovo cantiere. Servono 2 giorni e una stampante speciale.", cost: "Costi e ritardi evitabili" },
  ],
  steps: [
    { icon: UserCheck, title: "Registra il lavoratore", description: "Inserisci i dati del lavoratore: nome, foto, mansione, documenti. Il sistema genera automaticamente il badge digitale." },
    { icon: QrCode, title: "QR code univoco", description: "Ogni badge ha un QR code unico e sicuro. Scansionabile da qualsiasi smartphone, mostra tutti i dati in tempo reale." },
    { icon: Camera, title: "Scansiona e verifica", description: "L'ispettore, il committente o il CSE scansionano il QR dal proprio telefono. Vedono subito se i documenti sono in regola." },
  ],
  stats: [
    { value: 100, suffix: "%", label: "Digitale, zero carta" },
    { value: 3, suffix: " sec", label: "Per verificare un lavoratore" },
    { value: 0, suffix: "", label: "Hardware necessario" },
    { value: 50, suffix: "+", label: "Badge generati in 1 minuto" },
  ],
  features: [
    { icon: CreditCard, title: "Badge sempre aggiornato", description: "Quando un documento scade o viene rinnovato, il badge si aggiorna automaticamente. Mai più informazioni obsolete." },
    { icon: Smartphone, title: "Sempre in tasca", description: "Il lavoratore accede al suo badge dal telefono. Niente da stampare, niente da portare, niente da perdere." },
    { icon: Shield, title: "Conforme al D.L. 159/2025", description: "Il tesserino digitale rispetta tutti i requisiti normativi: foto, dati anagrafici, datore di lavoro, mansione, documenti." },
    { icon: QrCode, title: "QR code sicuro", description: "Il QR code è crittografato e univoco. Non può essere duplicato o falsificato. Ogni scansione è registrata nel sistema." },
    { icon: Printer, title: "Stampabile se serve", description: "Se preferisci il cartaceo, puoi stampare il badge in formato tessera. Ma il QR funziona ugualmente dal telefono." },
    { icon: RefreshCw, title: "Aggiornamento in tempo reale", description: "Documenti scaduti? Il badge lo mostra subito. Il lavoratore sa cosa deve rinnovare, il CSE sa chi è in regola." },
  ],
  testimonial: {
    quote: "L'ultima ispezione, l'ispettore ha scansionato il QR code di 3 operai. In 10 secondi aveva tutto. Mi ha detto: 'Così dovrebbero fare tutti.'",
    name: "Giuseppe Ferraro",
    role: "CSE",
    company: "Studio Ferraro Ingegneria",
  },
  faqs: [
    { question: "Il badge digitale è legalmente valido?", answer: "Sì. Il tesserino digitale contiene tutte le informazioni richieste dal D.L. 159/2025 e dal D.Lgs. 81/2008. La scansione del QR code permette la verifica immediata di tutti i dati." },
    { question: "Serve un'app dedicata per mostrare il badge?", answer: "No. Il lavoratore accede al suo badge tramite un link web sul proprio smartphone. Nessuna app da scaricare, funziona su qualsiasi dispositivo." },
    { question: "Posso generare badge per subappaltatori?", answer: "Sì. Ogni subappaltatore può generare i badge per i propri lavoratori dal portale dedicato, oppure puoi farlo tu centralmente." },
    { question: "Cosa succede se un documento scade?", answer: "Il badge mostra automaticamente lo stato 'Documenti scaduti' in rosso. Il lavoratore e il suo datore di lavoro ricevono una notifica per il rinnovo." },
  ],
  ctaHeadline: "Il tesserino del futuro. Attivalo in 2 minuti.",
  ctaSubtitle: "Genera badge digitali per tutti i tuoi lavoratori. Gratis per 14 giorni.",
};

export default function FunzionalitaTesserini() {
  return <FeaturePageTemplate data={data} />;
}
