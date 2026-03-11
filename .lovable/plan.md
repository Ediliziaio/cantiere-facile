

# Piano: Navbar con testo bianco su sezioni scure

## Problema
La navbar ha testo e logo scuri (hardcoded), invisibili sulle hero scure delle pagine funzionalità e della homepage (sfondo `#0F0E0D`).

## Soluzione

### `LandingNavbar.tsx` — adattamento colori basato sullo scroll

Usare `useTransform(scrollY)` per interpolare i colori del testo da bianco (quando si è in cima, sopra la hero scura) a scuro (quando si scrolla e il bg diventa bianco):

1. **Logo text**: da `white` → `hsl(20,14%,8%)` su scroll (0→80px)
2. **Nav links**: da `rgba(255,255,255,0.7)` → `hsl(25,5%,45%)` su scroll
3. **Accedi button**: da testo bianco → testo scuro su scroll
4. **Menu icon (mobile)**: da bianco → scuro su scroll
5. **HardHat icon**: resta arancione (invariato)
6. **Background navbar**: da `transparent` → `rgba(255,255,255,1)` (già funzionante)

Tutte le transizioni usano `useTransform` di framer-motion per un effetto fluido, collegato alla stessa `scrollY` già presente.

### File modificato
- `src/components/landing/LandingNavbar.tsx` — aggiungere motion values per i colori del testo, applicarli come `style={{ color }}` tramite `motion.span`, `motion.a`, ecc.

