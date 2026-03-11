

# Piano: Miglioramenti Landing Page

## 3 interventi richiesti

### 1. Font titoli: da Syne extrabold a Syne bold (peso ridotto)
Il font Syne con `font-extrabold` (800) risulta troppo pesante e poco leggibile. Cambio a `font-bold` (700) su tutti i titoli landing e riduco leggermente le dimensioni del hero headline (da `text-[4.25rem]` a `text-[3.5rem]`).

**File coinvolti**: `HeroSection.tsx`, `PainSection.tsx`, `FeatureTabsSection.tsx`, `HowItWorksSection.tsx`, `AlternatingFeatures.tsx`, `TestimonialsSection.tsx`, `PricingSection.tsx`, `ManifestoSection.tsx`

### 2. Pricing: 3 piani con nuovi prezzi + sconto animato
Nuovi piani:
- **Starter**: GRATIS (€0/mese), nessun toggle
- **Professional**: €42/mese mensile → €32/mese annuale (–24% circa, mostrato come –20%)
- **Business**: €52/mese mensile → €42/mese annuale

Animazione sconto: quando si attiva "Annuale", il prezzo vecchio appare barrato con una linea rossa e il nuovo prezzo scivola sotto con `AnimatePresence`. Badge "Risparmi X€/anno" appare con fade-in.

Ordine desktop: Starter | Professional (highlighted, "Più popolare") | Business. Su mobile: Professional primo.

**File**: `PricingSection.tsx` — riscrittura completa dei dati piani e della logica di rendering prezzi.

### 3. Sezione FAQ con accordion animato
Nuova sezione `FaqSection.tsx` inserita tra PricingSection e ManifestoSection in `Landing.tsx`.

~8 FAQ con domande comuni (prova gratuita, dati sicuri, migrazione, firma legale, supporto, cancellazione, integrazioni, formazione). Accordion con `AnimatePresence` + `height: auto` animation. Icona `+`/`−` che ruota. Sfondo chiaro `#FAFAF9`.

**File nuovi**: `src/components/landing/FaqSection.tsx`
**File modificati**: `src/pages/Landing.tsx` (aggiunta import + componente)

### 4. Animazioni avanzate (parallax + transizioni sezioni)
- **Parallax**: Usare `useScroll` + `useTransform` di Framer Motion su HeroSection (mockup si muove più lento dello scroll) e sulle sezioni AlternatingFeatures (visual parallax leggero).
- **Counter più fluidi**: Aumentare `stiffness` a 80 e `damping` a 25 nel `useSpring` dei counter in TestimonialsSection per un'animazione più smooth.
- **Transizioni sezioni**: Aggiungere un leggero effetto di scala (0.98→1) combinato con fade sulle sezioni principali quando entrano in viewport, usando `useInView` già presente.

**File coinvolti**: `HeroSection.tsx` (parallax mockup), `TestimonialsSection.tsx` (counter tuning), `PainSection.tsx`, `HowItWorksSection.tsx`, `AlternatingFeatures.tsx` (scale entrance).

---

## Riepilogo file
- **Modificati**: `HeroSection.tsx`, `PainSection.tsx`, `FeatureTabsSection.tsx`, `HowItWorksSection.tsx`, `AlternatingFeatures.tsx`, `TestimonialsSection.tsx`, `PricingSection.tsx`, `ManifestoSection.tsx`, `Landing.tsx`
- **Creati**: `FaqSection.tsx`

