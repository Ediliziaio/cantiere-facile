

# Cosa manca alla landing page

Dopo aver analizzato la struttura, ecco gli elementi che secondo me potrebbero mancare o essere migliorati:

## 1. App Mobile Download Section ⭐ Priorità alta
Vedo `capacitor.config.ts` nel progetto, quindi c'è un'app iOS/Android. Manca completamente una sezione che promuova l'app mobile con badge App Store / Play Store. Per un software da cantiere è fondamentale.

## 2. Prenota una Demo / Call to Action alternativa
Oltre a "Prova gratis", molte aziende B2B vogliono una demo guidata. Un CTA secondario "Prenota una demo" con calendario (Calendly/HubSpot) aiuterebbe a catturare lead più qualificati.

## 3. Trust & Security Badges
Per un software che gestisce documenti sensibili di cantieri (DURC, idoneità sanitarie), mancano badge di conformità:
- GDPR compliant
- ISO 27001
- Crittografia AES-256
- Server in Europa

## 4. Integrazioni
Con chi si integra il software? Esempi tipici per settore edile:
- ADL (Albo Delegati)
- INAIL / INPS
- Fatture in Cloud / Zucchetti
- Google Calendar / Outlook

## 5. Case Study / Success Story dettagliata
C'è una TestimonialsSection ma manca una vera case study con numeri:
- "Come Rossi Costruzioni ha ridotto il 60% del tempo di gestione documentale"
- Before/After con metriche concrete

## 6. FAQ Espansa o Chat Widget
La FaqSection c'è, ma manca un widget di supporto/chat per domande immediate.

## 7. Confronto Concorrenza (Comparison Table)
Tabella comparativa "Noi vs Excel/Software tradizionali" visibile a colpo d'occhio.

## File coinvolti (se vuoi implementare):
- `src/components/landing/MobileAppSection.tsx` — nuova sezione
- `src/components/landing/TrustBadges.tsx` — nuova sezione
- `src/components/landing/IntegrationsSection.tsx` — nuova sezione
- `src/components/landing/ComparisonTable.tsx` — nuova sezione
- `src/pages/Landing.tsx` — aggiungere import e posizionamento

