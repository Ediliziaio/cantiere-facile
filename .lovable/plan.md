

# Pagina /install - Istruzioni PWA

## Obiettivo

Creare una pagina pubblica dedicata `/install` con istruzioni visive e passo-passo per installare la PWA su iPhone (Safari) e Android (Chrome). La pagina utilizzerà lo stesso design system della landing page.

## Cosa viene creato

| File | Descrizione |
|------|-------------|
| `src/pages/Install.tsx` | Nuova pagina con istruzioni iPhone/Android |
| `src/App.tsx` | Aggiunta rotta `/install` nei public routes |

## Struttura della pagina

1. **LandingNavbar** - Navigazione coerente con il sito
2. **Hero section** - Titolo "Installa Cantiere Facile" con spiegazione vantaggi
3. **Tab/Accordion dual-view** - Selettore iPhone vs Android
4. **Istruzioni iPhone** (3 step):
   - Tocca il pulsante Condividi in Safari
   - Scorri e seleziona "Aggiungi a Home"
   - L'app è installata e pronta
5. **Istruzioni Android** (3 step):
   - Tocca il menu ⋮ in Chrome
   - Seleziona "Aggiungi a schermo Home" o "Installa app"
   - L'app è installata e pronta
6. **Vantaggi PWA** - Card con icone: Offline, Notifiche, Accesso rapido
7. **FAQ mini** - Domande frequenti sull'installazione
8. **LandingFooter** - Chiusura coerente

## Design

- Layout responsive: su mobile mostra le istruzioni in verticale, su desktop side-by-side
- Colori del design system arancione (#f97316) per CTA e accenti
- Screenshot placeholder (illustrazioni SVG) che mostrano le interfacce iOS/Android
- Pulsante "Torna alla home" sticky in basso su mobile

## Implementazione

1. Creare `src/pages/Install.tsx` con componente React
2. Importare `LandingNavbar` e `LandingFooter` dai componenti landing esistenti
3. Usare `Tabs` o `ToggleGroup` per switch iPhone/Android
4. Creare sezione step-by-step con numeri e icone
5. Aggiungere rotta in `App.tsx` tra le public routes

