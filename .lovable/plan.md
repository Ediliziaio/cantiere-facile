

# Piano: Loghi fake SVG con marquee auto-scroll

## Cosa fare

Sostituire i nomi testuali nella sezione "Scelto da imprese edili in tutta Italia" con loghi fake SVG inline — icona stilizzata + nome azienda — che scorrono automaticamente in loop continuo (già funzionante con `marquee-track`).

## Implementazione

### `src/components/landing/HeroSection.tsx`

Sostituire l'array `logos` di stringhe con un array di oggetti `{ name, icon }` dove `icon` è un mini SVG inline (forme geometriche semplici: edificio, gru, casco, mattone, ecc.) diverso per ogni azienda. Ogni logo sarà un `div` flex con icona SVG + testo, stile grigio chiaro/opaco come i loghi social proof tipici.

**8 loghi fake** con icone SVG diverse:
- Costruzioni Rossi → icona edificio
- Impresa Bianchi → icona gru  
- General Contracting Sud → icona casco
- Edilmaster Group → icona mattoni
- Cantieri del Nord → icona montagna
- Rizzo Costruzioni → icona casa
- GEC Lombarda → icona triangolo/tetto
- Impresa Verdi → icona albero

Ogni logo: `flex items-center gap-2`, icona SVG 24x24px + testo semibold, tutto in grigio `text-[hsl(25,5%,45%)]/40`.

### CSS (`src/index.css`)

Aggiungere il `@keyframes marquee` se mancante (translateX da 0 a -50%), già referenziato dalla classe `.marquee-track`.

## File modificati
- `src/components/landing/HeroSection.tsx` — loghi SVG inline
- `src/index.css` — verifica/aggiunta keyframes marquee

