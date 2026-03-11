

# Piano: Fix navbar illeggibile su hero scure

## Problema
La navbar transiziona da testo bianco a testo scuro tra 0-80px di scroll. Ma le hero delle pagine funzionalità (e della homepage) sono alte 400-500px+ con sfondo scuro `#0F0E0D`. Dopo 80px di scroll il testo diventa scuro su sfondo scuro = illeggibile.

## Soluzione

Aumentare il range di scroll per la transizione colori da `[0, 80]` a `[0, 400]` in modo che la navbar resti con testo bianco per tutta la durata della hero scura, e transizioni a scuro solo quando si arriva alle sezioni chiare.

Valori da cambiare in `LandingNavbar.tsx`:
- `bgOpacity`: `[0, 400]` invece di `[0, 80]`
- `shadow`: `[0, 400]`
- `logoColor`: `[0, 400]`
- `linkColor`: `[0, 400]`
- `menuIconColor`: `[0, 400]`
- `btnTextColor`: `[0, 400]`
- Border color transform: `[0, 400]`

Questo allinea la transizione con la fine della hero scura sia sulla homepage che sulle pagine funzionalità (entrambe usano `pt-28/pt-36 + contenuto + pb-20/pb-24`).

## File modificato
- `src/components/landing/LandingNavbar.tsx` — aggiornare tutti i range `[0, 80]` → `[0, 400]`

