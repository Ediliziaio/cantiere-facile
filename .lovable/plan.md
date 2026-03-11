

# Piano: Pagine dedicate per ogni funzionalità

## Panoramica

Creare 6 pagine lunghe e persuasive, una per ogni funzionalità della piattaforma. Ogni pagina segue lo stesso template strutturale ma con contenuti, copy e visual unici.

## Le 6 pagine

| Rotta | Funzionalità | File |
|-------|-------------|------|
| `/funzionalita/documenti` | Gestione Documenti | `src/pages/funzionalita/Documenti.tsx` |
| `/funzionalita/tesserini` | Badge Digitali | `src/pages/funzionalita/Tesserini.tsx` |
| `/funzionalita/accessi` | Controllo Accessi Geo | `src/pages/funzionalita/Accessi.tsx` |
| `/funzionalita/firma` | Firma Digitale | `src/pages/funzionalita/Firma.tsx` |
| `/funzionalita/comunicazioni` | Comunicazioni | `src/pages/funzionalita/Comunicazioni.tsx` |
| `/funzionalita/veicoli` | Gestione Veicoli | `src/pages/funzionalita/Veicoli.tsx` |

## Struttura di ogni pagina (template comune)

Ogni pagina include queste sezioni nell'ordine:

1. **Hero della funzionalità** — Tag colorato, headline bold, sottotitolo persuasivo, CTA "Prova gratis", visual/mockup animato a destra
2. **Problema / Pain** — "Senza Cantiere in Cloud..." con 3-4 pain point concreti (icone rosse, numeri reali come "€12.000 di multa media per documenti scaduti")
3. **Come funziona** — 3-4 step numerati con animazione stagger, icone e breve descrizione
4. **Risultati concreti** — Counter animati con numeri d'impatto (es. "98% documenti in regola", "–70% tempo gestione", "0 sanzioni ricevute")
5. **Feature deep-dive** — 4-6 sotto-funzionalità con icona, titolo e paragrafo, layout a griglia 2x2 o 2x3
6. **Testimonianza specifica** — Quote di un "cliente" relativa a quella funzionalità
7. **FAQ specifiche** — 3-4 domande frequenti sulla funzionalità, accordion animato
8. **CTA finale** — "Inizia gratis oggi" con bottone che porta a `/register`

Tutte le sezioni usano `framer-motion` con `useInView` per animazioni di ingresso (fade+slide+scale), counter animati con `useSpring`, e lo stesso design system (colori HSL arancio, font Syne/Inter).

## File modificati

- **`src/App.tsx`** — Aggiunta delle 6 rotte pubbliche `/funzionalita/*`
- **`src/components/landing/FeatureTabsSection.tsx`** — I link CTA puntano alle nuove pagine invece di `#`
- **`src/components/landing/AlternatingFeatures.tsx`** — I link CTA puntano alle nuove pagine
- **`src/components/landing/LandingFooter.tsx`** — Aggiunta link alle pagine funzionalità nel footer

## File creati (7 nuovi)

- `src/pages/funzionalita/Documenti.tsx`
- `src/pages/funzionalita/Tesserini.tsx`
- `src/pages/funzionalita/Accessi.tsx`
- `src/pages/funzionalita/Firma.tsx`
- `src/pages/funzionalita/Comunicazioni.tsx`
- `src/pages/funzionalita/Veicoli.tsx`
- `src/components/landing/FeaturePageTemplate.tsx` — Componente template riutilizzabile che riceve i dati come props e renderizza tutte le 8 sezioni. Le singole pagine passano solo i contenuti.

## Contenuti persuasivi per pagina (esempi chiave)

**Documenti**: "Il 43% delle sanzioni in cantiere è per documenti scaduti o mancanti. Con noi: zero."
**Tesserini**: "Conforme al D.L. 159/2025. Il badge che l'ASL vuole vedere."
**Accessi**: "GPS + QR code. Nessuno può timbrare da casa."
**Firma**: "60 secondi per firmare un verbale. Dal cantiere. Col dito."
**Comunicazioni**: "Ogni messaggio è timestampato. In caso di controversia, hai le prove."
**Veicoli**: "Revisione scaduta = mezzo fermo = cantiere fermo. Mai più."

