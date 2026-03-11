import FeaturePageTemplate, { type FeaturePageData } from "@/components/landing/FeaturePageTemplate";
import { Upload, Bell, CheckCircle2, Shield, FolderOpen, Users, Clock, FileCheck } from "lucide-react";

const data: FeaturePageData = {
  tag: "Gestione Documenti",
  headline: "Zero sanzioni. 100% documenti in regola.",
  subtitle: "Il 43% delle sanzioni in cantiere è per documenti scaduti o mancanti. Con Cantiere in Cloud, non succede più. Ogni documento è tracciato, ogni scadenza è sotto controllo.",
  painHeadline: "Senza Cantiere in Cloud, ogni giorno rischi questo.",
  pains: [
    { text: "Il subappaltatore arriva con il DURC scaduto. Lo scopri solo dopo il controllo ASL.", cost: "Multa media: €12.000" },
    { text: "L'idoneità sanitaria di un operaio è scaduta da 2 mesi. Nessuno se ne è accorto.", cost: "Rischio penale per il CSE" },
    { text: "Cerchi la visura camerale tra 200 email e 3 cartelle condivise. Non la trovi.", cost: "2 ore perse ogni volta" },
    { text: "Il committente chiede la checklist documentale. Passi mezza giornata a compilarla a mano.", cost: "Tempo che non fatturi" },
  ],
  steps: [
    { icon: Upload, title: "Carica o fai caricare", description: "Tu o il subappaltatore caricate i documenti dal portale dedicato. Il sistema sa già cosa serve per ogni categoria." },
    { icon: Bell, title: "Alert automatici", description: "30 giorni, 7 giorni, 1 giorno prima della scadenza: il sistema avvisa te e il subappaltatore via email e notifica." },
    { icon: CheckCircle2, title: "Approva con un click", description: "Verifica il documento e approvalo. La checklist si aggiorna automaticamente. In caso di controllo, è tutto pronto." },
  ],
  stats: [
    { value: 98, suffix: "%", label: "Documenti in regola" },
    { value: 70, suffix: "%", prefix: "-", label: "Tempo di gestione" },
    { value: 0, suffix: "", label: "Sanzioni ricevute" },
    { value: 15, suffix: " min", label: "Per generare un report" },
  ],
  features: [
    { icon: FolderOpen, title: "Archivio centralizzato", description: "Tutti i documenti in un unico posto: DURC, visure, polizze, idoneità sanitarie, attestati. Indicizzati e ricercabili." },
    { icon: Bell, title: "Scadenze intelligenti", description: "Alert multi-livello configurabili. Non dimentichi più nulla. Il sistema insegue il subappaltatore al posto tuo." },
    { icon: Users, title: "Portale subappaltatore", description: "Ogni subappaltatore ha il suo accesso. Carica i documenti in autonomia. Tu approvi. Fine." },
    { icon: Shield, title: "Checklist automatica", description: "Per ogni cantiere, il sistema genera la checklist di tutti i documenti necessari e ti mostra cosa manca." },
    { icon: Clock, title: "Storico completo", description: "Ogni upload, ogni approvazione, ogni scadenza: tutto è tracciato con data e ora. In caso di contestazione, hai le prove." },
    { icon: FileCheck, title: "Report istantanei", description: "Genera il report documentale del cantiere in un click. PDF pronto per il committente o per l'ispezione." },
  ],
  testimonial: {
    quote: "Prima passavo 2 ore al giorno a rincorrere documenti scaduti. Ora il sistema fa tutto. L'ultima ispezione ASL è durata 10 minuti: tutto in ordine.",
    name: "Marco Bianchi",
    role: "Direttore Tecnico",
    company: "Bianchi Costruzioni S.r.l.",
  },
  faqs: [
    { question: "Quali tipi di documenti posso caricare?", answer: "Qualsiasi documento in formato PDF, JPG o PNG: DURC, visure camerali, polizze assicurative, idoneità sanitarie, attestati di formazione, libretti di immatricolazione mezzi, e qualsiasi altro documento richiesto dal POS o dal PSC." },
    { question: "Il subappaltatore deve avere un account?", answer: "Sì, ma la registrazione è gratuita e immediata. Riceve un invito via email con un link diretto al suo portale, dove può caricare i documenti richiesti senza bisogno di formazione." },
    { question: "Come funzionano gli alert di scadenza?", answer: "Puoi configurare fino a 3 livelli di alert per ogni tipo di documento: ad esempio 30, 7 e 1 giorno prima della scadenza. Gli alert vengono inviati via email e come notifica in-app sia a te che al subappaltatore." },
    { question: "I documenti sono al sicuro?", answer: "Tutti i documenti sono crittografati e archiviati in cloud con backup automatici. L'accesso è controllato da permessi granulari: ogni utente vede solo ciò che gli compete." },
  ],
  ctaHeadline: "Basta sanzioni. Basta rincorrere documenti.",
  ctaSubtitle: "Attiva Cantiere in Cloud in 5 minuti. I primi 14 giorni sono gratis.",
};

export default function FunzionalitaDocumenti() {
  return <FeaturePageTemplate data={data} />;
}
