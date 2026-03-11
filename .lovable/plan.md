

# Piano: Loghi custom generati con AI per la sezione social proof

## Obiettivo
Sostituire le icone SVG generiche con veri e propri loghi aziendali generati tramite l'API di generazione immagini AI, per dare un aspetto più professionale e credibile alla sezione "Scelto da imprese edili in tutta Italia".

## Implementazione

### 1. Generare 8 loghi con l'AI Image Generation API

Creare un servizio/utility che usa `google/gemini-3.1-flash-image-preview` per generare 8 loghi distinti di imprese edili fittizie italiane. Ogni logo sarà generato con prompt specifico per ottenere un logo professionale, minimalista, su sfondo trasparente:

- **Costruzioni Rossi** — logo con edificio stilizzato
- **Impresa Bianchi** — logo con gru
- **General Contracting Sud** — logo con casco/shield
- **Edilmaster Group** — logo con mattoni/geometrico
- **Cantieri del Nord** — logo con montagna
- **Rizzo Costruzioni** — logo con casa/tetto
- **GEC Lombarda** — logo con lettere stilizzate
- **Impresa Verdi** — logo con albero/natura

Le immagini saranno salvate come file PNG nella cartella `public/logos/`.

### 2. Aggiornare `src/components/landing/HeroSection.tsx`

- Rimuovere tutti gli SVG inline dall'array `logos`
- Sostituire con riferimenti alle immagini generate: `{ name: "Costruzioni Rossi", src: "/logos/costruzioni-rossi.png" }`
- Rendere ogni logo come `<img>` con altezza fissa (~28-32px), filtro grayscale e opacità ridotta per il look social proof classico
- Aggiungere `className="h-7 w-auto grayscale opacity-40 hover:opacity-60 transition-opacity"`

### 3. Stile dei loghi nel marquee

I loghi manterranno il layout flex attuale ma con immagini reali:
```
<div className="flex items-center gap-3 mx-8 shrink-0">
  <img src={logo.src} alt={logo.name} className="h-7 w-auto grayscale opacity-40" />
  <span className="text-lg font-semibold text-[hsl(25,5%,45%)]/30">{logo.name}</span>
</div>
```

## File coinvolti
- `public/logos/` — 8 nuovi file PNG generati con AI
- `src/components/landing/HeroSection.tsx` — aggiornamento array logos e rendering

