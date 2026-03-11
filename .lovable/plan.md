

# Piano: Creare pagine Chi Siamo, Tariffe, Funzionalita e collegare tutto

## Panoramica

Creare 3 nuove pagine standalone con la stessa estetica della landing (hero scura, glow arancione, floating shapes, navbar con transizione colori):

1. **`/chi-siamo`** — Pagina Chi Siamo (espansione del ManifestoSection attuale)
2. **`/tariffe`** — Pagina Tariffe (espansione del PricingSection attuale, con FAQ pricing)
3. **`/funzionalita`** — Pagina Funzionalita panoramica (espansione del FeatureTabsSection con link alle sotto-pagine)

Poi aggiornare tutti i collegamenti: navbar, footer, link interni.

---

## File da creare

### 1. `src/pages/ChiSiamo.tsx`
- Hero scura con glow arancione e floating shapes (stile FeaturePageTemplate)
- Headline: "Odiamo i cantieri fuori controllo." + accent arancione
- Sezione missione/valori con testo espanso dal ManifestoSection
- Sezione team/numeri con stats animate (anni esperienza, cantieri gestiti, etc.)
- CTA finale con glow
- Usa LandingNavbar + LandingFooter

### 2. `src/pages/Tariffe.tsx`
- Hero scura con glow arancione: "Tariffe chiare. Zero sorprese."
- Riusa il toggle mensile/annuale e le 3 card pricing dal PricingSection (copiato e adattato)
- Sezione FAQ dedicata ai prezzi (sotto le card)
- Sezione CTA finale
- Usa LandingNavbar + LandingFooter

### 3. `src/pages/Funzionalita.tsx`
- Hero scura con glow: "Una piattaforma. Tutto sotto controllo."
- Griglia delle 6 funzionalita con card cliccabili che linkano a `/funzionalita/documenti`, etc.
- Ogni card con icona, titolo, descrizione breve, link "Scopri di piu"
- Sezione CTA finale
- Usa LandingNavbar + LandingFooter

## File da modificare

### 4. `src/App.tsx`
- Aggiungere 3 rotte pubbliche: `/chi-siamo`, `/tariffe`, `/funzionalita` (exact, non conflitta con `/funzionalita/:slug`)

### 5. `src/components/landing/LandingNavbar.tsx`
- Cambiare i navLinks da anchor (`#funzionalita`, `#prezzi`, `#manifesto`) a rotte (`/funzionalita`, `/tariffe`, `/chi-siamo`)
- Cambiare `<a href=...>` in `<Link to=...>` per questi link
- Nel mobile overlay, stessa cosa

### 6. `src/components/landing/LandingFooter.tsx`
- Aggiornare link "Chi siamo" da `#manifesto` a `/chi-siamo`
- Aggiungere link "Tariffe" nella colonna Prodotto con href `/tariffe`
- Aggiungere link "Funzionalita" con href `/funzionalita`

## Dettagli tecnici

- Tutte le nuove pagine usano lo stesso pattern visivo: `bg-[#0F0E0D]` per hero, glow arancione con `blur-[120px]`, floating shapes, `framer-motion` stagger animations
- La navbar funziona gia con transizione colori scroll-based, quindi sulle nuove pagine (che hanno hero scura) il testo sara bianco in cima e scuro dopo scroll
- Le pagine Tariffe e Chi Siamo includono sezioni con sfondo alternato (scuro/chiaro) per ritmo visivo

