

# Piano: Sezione Case Study Before/After

## Cosa fare

Creare una nuova sezione `CaseStudySection` che racconti la trasformazione di "Rossi Costruzioni S.r.l." con metriche concrete Before/After. La sezione segue lo stile dark della StatsSection per coerenza visiva e impatto emotivo.

## Elementi della sezione

1. **Header** — Titolo "Da €15.000 di sanzioni a zero rischi" con sottotitolo
2. **Card principale** — Layout a 2 colonne con foto/story a sinistra e metriche a destra
3. **Metriche Before/After** — 4 KPI con confronto visivo:
   - Tempo gestione documentale (12h/settimana → 2h)
   - Sanzioni/verbali (2/anno → 0)
   - Documenti smarriti (1-2/mese → 0)
   - Tempo risposta ispettore (45min → 3min)
4. **Quote testimonial** — Frase iconica del titolare
5. **CTA** — "Vuoi risultati simili? Inizia gratis"

## Implementazione

### Nuovo file: `src/components/landing/CaseStudySection.tsx`

Struttura:
- Section con bg `#0F0E0D` per coerenza StatsSection
- Container max-w-6xl
- Griglia 2 colonne su desktop, stack su mobile
- Card metriche con design "Before (rosso/grigio) → After (verde/arancione)"
- Animazioni con `framer-motion` + `useInView`

### File da modificare: `src/pages/Landing.tsx`

Aggiungere import e posizionare tra `TestimonialsSection` e `ComparisonTable`

## Stile visivo

- Colori Before: `text-red-400` / `bg-red-500/10` / `border-red-500/20`
- Colori After: `text-[hsl(25,95%,53%)]` / `bg-[hsl(25,95%,53%)]/10`
- Font: `font-landing-heading` per numeri, `font-landing-body` per testi
- Icone: ArrowRight per indicare transizione

