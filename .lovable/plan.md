

# Piano: Tabella comparativa mobile-friendly

## Problema
Su mobile (< 768px) la tabella a 4 colonne risulta compressa e poco leggibile.

## Soluzione
- La prima colonna (feature name) resta **sticky a sinistra** con sfondo solido
- Le 3 colonne dati scorrono orizzontalmente
- Aggiungere un hint "Scorri →" visibile solo su mobile
- Aumentare la larghezza minima delle colonne dati per leggibilità
- Gradient fade sul bordo destro per indicare contenuto scrollabile

## Implementazione — `src/components/landing/ComparisonTable.tsx`

1. Wrappare la tabella in un container `overflow-x-auto scrollbar-hide` su mobile
2. Usare `min-w-[600px]` sulla griglia interna per forzare lo scroll su schermi piccoli
3. Prima colonna sticky: `sticky left-0 z-10 bg-white` con `min-w-[160px]`
4. Header della prima colonna sticky con stesso bg
5. Aggiungere un piccolo testo "Scorri →" sotto la tabella, visibile solo `md:hidden`
6. Colonne header con `min-w-[110px]` per non troncare il testo

## File modificato
- `src/components/landing/ComparisonTable.tsx` — layout responsive con scroll orizzontale e colonna sticky

