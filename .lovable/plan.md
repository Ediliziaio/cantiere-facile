
# Piano: Aggiungere animazioni counter a StatsSection

## Obiettivo
Aggiungere le stesse animazioni counter animate (come in TestimonialsSection) alla sezione "Numeri che contano" su StatsSection.

## Implementazione

Modificare `src/components/landing/StatsSection.tsx`:

1. **Aggiungere import**: `useSpring`, `useMotionValue` da `framer-motion` e `useEffect` da `react`

2. **Creare componente CountUp**: Copiare la stessa logica da TestimonialsSection — usa `useMotionValue` + `useSpring` per animare i numeri con effetto molla quando `inView` diventa true

3. **Ristrutturare i dati**: Modificare l'array stats per separare valore numerico da prefisso/suffisso:
   - `{ value: 78, suffix: "%", ... }`
   - `{ value: 18500, prefix: "€", suffix: "", ... }`
   - `{ value: 3, suffix: " ore", ... }`
   - `{ value: 60, suffix: " sec", ... }`

4. **Aggiornare il render**: Sostituire `{s.value}` statico con `<CountUp target={s.value} inView={inView} />` + prefisso/suffisso

## File modificato
- `src/components/landing/StatsSection.tsx` — aggiunge animazioni counter
