

# Piano: Video YouTube nel modal + micro-interazioni pricing

## 1. Video YouTube reale nel modal (HeroSection.tsx)

Sostituire il placeholder in `HeroSection.tsx` (righe 200-208) con un iframe YouTube embed. Userò un video demo generico di software gestionale cantiere come placeholder (es. un video di presentazione SaaS). L'iframe sarà lazy-loaded e si attiverà solo quando il modal è aperto per evitare caricamenti inutili.

- Rimuovere il div placeholder con icona Play e testo "Video demo in arrivo"
- Inserire un `iframe` YouTube con `allow="autoplay"` dentro il container `aspect-video`
- L'iframe si renderizza solo quando `videoOpen` è true (già gestito dal Dialog)
- Aggiungere `allowFullScreen` e parametri YouTube per autoplay on open

**File**: `src/components/landing/HeroSection.tsx` (righe 200-208)

## 2. Micro-interazioni card pricing (PricingSection.tsx)

### Hover lift su tutte le card
- Convertire le card non-highlighted in `motion.div` con `whileHover={{ y: -6, transition: { duration: 0.2 } }}`
- Card Professional: `whileHover={{ y: -8 }}` + aumento shadow

### Shine animation sulla card Professional
- Aggiungere un pseudo-elemento CSS (via un div overlay) che simula un riflesso luminoso che scorre da sinistra a destra con animazione CSS
- Implementazione: div con gradient `transparent → white/10 → transparent`, `position: absolute`, animato con CSS keyframe `shine` (translateX da -100% a 200%) ogni 3-4 secondi
- Aggiungere il keyframe `shine` in `src/index.css`

**File modificati**:
- `src/components/landing/PricingSection.tsx` — hover lift + shine overlay
- `src/index.css` — keyframe `@keyframes shine`

