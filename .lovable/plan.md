

# Piano: Landing Page Marketing "Cantiere in Cloud"

Ricostruzione completa della landing page (`/`) con design ispirato a JetHR.com, animazioni Framer Motion, e copy direct-response in italiano.

---

## Dipendenze da aggiungere

- `framer-motion` — animazioni hero, tabs, scroll reveal, parallax
- `react-intersection-observer` — trigger animazioni on scroll

## Font

Aggiornare `index.html` per caricare **Syne** (headings) + **DM Sans** (body) da Google Fonts al posto di Inter. Aggiornare `tailwind.config.ts` con le nuove font family.

## Struttura file

La landing e molto grande (~2000+ righe di JSX). Per mantenibilita, la divido in componenti modulari:

```text
src/pages/Landing.tsx              ← orchestratore, importa tutte le sezioni
src/components/landing/
  ├── LandingNavbar.tsx            ← sticky navbar con scroll animation
  ├── HeroSection.tsx              ← hero dark + mockup + social proof marquee
  ├── PainSection.tsx              ← 3 problem cards su sfondo scuro
  ├── FeatureTabsSection.tsx       ← tabs interattivi stile JetHR (il piu complesso)
  ├── HowItWorksSection.tsx        ← 3 step con linea collegamento
  ├── AlternatingFeatures.tsx      ← 3 righe alternanti immagine/testo
  ├── TestimonialsSection.tsx      ← testimonial cards + stat row
  ├── PricingSection.tsx           ← 3 piani con toggle mensile/annuale
  ├── ManifestoSection.tsx         ← sezione emozionale dark
  ├── FinalCtaSection.tsx          ← CTA gradient arancione
  ├── LandingFooter.tsx            ← footer 4 colonne
  └── MobileStickyBar.tsx          ← barra CTA sticky bottom su mobile
```

## Interventi per file

### 1. `index.html`
- Aggiungere Google Fonts: Syne (600, 700, 800) + DM Sans (400, 500, 600)

### 2. `tailwind.config.ts`
- Font: `heading: ['Syne', ...]`, `body: ['DM Sans', ...]`
- Aggiungere keyframes per marquee (`marquee`: translateX(0) → translateX(-50%))
- Aggiungere colori landing specifici se necessario (ma useremo classi dirette tipo `bg-[#0F0E0D]`)

### 3. `src/pages/Landing.tsx`
- Riscrivere completamente: importa e compone tutte le sezioni nell'ordine specificato
- Nessuna logica, solo layout sequenziale

### 4. Componenti landing (dettaglio sezioni principali)

**LandingNavbar**: `useScroll` di Framer Motion per background opacity. Mobile hamburger con overlay full-screen. Links: Funzionalita, Prezzi, Chi siamo, Blog. CTAs: Accedi (ghost) + Prova gratis (filled).

**HeroSection**: Background `#0F0E0D` con radial gradient arancione. Floating geometric shapes (CSS keyframes). Staggered entry con `motion.div` (eyebrow → headline → sub → CTAs → mockup). Mockup con 3D tilt via `useMotionValue` + `useTransform`. Social proof marquee con 8 loghi fake in scorrimento infinito.

**PainSection**: 3 card problema su sfondo scuro, bordo sinistro arancione, stagger reveal con leggera rotazione.

**FeatureTabsSection** (sezione piu complessa): 6 tabs orizzontali con pill active state arancione. `AnimatePresence` per swap contenuto. Ogni tab: testo a sinistra (headline + bullets + CTA) + mockup UI a destra (card stilizzata con dati finti). Su mobile: accordion verticale anziche tabs.

**HowItWorksSection**: 3 step orizzontali con linea tratteggiata di collegamento. Stagger fadeUp on scroll con `useInView`.

**AlternatingFeatures**: 3 righe con layout alternato (testo sx/dx). Slide-in da sinistra/destra basato su indice pari/dispari.

**TestimonialsSection**: 3 card testimonial su sfondo scuro. Hover scale 1.02. Sotto: riga statistiche con count-up animation on viewport entry.

**PricingSection**: Toggle mensile/annuale con `AnimatePresence` sui prezzi. 3 card, Pro evidenziata con bordo arancione + badge "PIU POPOLARE". Su mobile: stack verticale con Pro in cima.

**ManifestoSection**: Full-width dark, testo centrato, linea decorativa arancione.

**FinalCtaSection**: Sfondo gradient `from-orange-500 to-amber-400`. Due bottoni. Trust badges sotto.

**LandingFooter**: 4 colonne, sfondo scuro. Links prodotto, azienda, legale. Bottom bar con P.IVA.

**MobileStickyBar**: Barra fissa bottom su mobile con CTA "Inizia gratis", nascosta su desktop.

### 5. `src/index.css`
- Aggiungere keyframes `@keyframes marquee` per lo scroll infinito dei loghi
- Classe `.marquee-track` con animation

## Animazioni (tutte Framer Motion tranne marquee)

- Hero entry: `staggerChildren: 0.12`, `fadeUp` (y: 30→0, opacity 0→1)
- Mockup: `scale 0.95→1` spring + mouse parallax `rotateX/Y`
- Navbar: `backgroundColor` transition on scroll > 50px
- Tabs: `AnimatePresence` mode="wait" con slide orizzontale
- Sezioni: `useInView` con `once: true` + stagger children
- Pricing toggle: `LayoutGroup` per animazione numeri
- Testimonials: hover `scale(1.02)` + shadow
- Stats: count-up custom con `useSpring` di Framer Motion
- CTA buttons: `whileHover={{ scale: 1.04 }}`, `whileTap={{ scale: 0.98 }}`

## Responsive

- Mobile: colonna singola, tabs→accordion, pricing stack verticale (Pro primo), mockup sotto testo, sticky CTA bar bottom
- Tablet: griglie 2 colonne dove desktop ha 3
- Desktop: layout completo come specificato

## Build order

Implementero in un'unica passata creando tutti i file componente e aggiornando Landing.tsx, tailwind.config.ts e index.html. I file saranno ~8-10 componenti + gli aggiornamenti di configurazione.

