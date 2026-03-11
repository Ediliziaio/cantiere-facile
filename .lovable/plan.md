

# Piano: Upgrade Hero delle pagine funzionalita

## Problema attuale
La hero section del `FeaturePageTemplate.tsx` e' molto basica: solo testo centrato su sfondo scuro, senza gli effetti visivi presenti nella homepage (glow arancione, quadrati floating, animazioni stagger).

## Cosa fare

### Modificare `FeaturePageTemplate.tsx` — sezione Hero (righe 80-127)

Replicare lo stile della homepage hero:

1. **Glow arancione sfumato** — Aggiungere il div con radial blur arancione (`bg-[hsl(25,95%,53%)] opacity-[0.07] blur-[120px]`) come background della hero
2. **Floating shapes** — 3-4 quadrati/cerchi con bordo arancione e `animate-float-slow` / `animate-float-slow-reverse`, posizionati assoluti
3. **Layout left-aligned** — Cambiare da `text-center` a layout allineato a sinistra come la homepage, con `max-w-2xl`
4. **Headline con parte arancione** — Splittare l'headline: prima riga bianca, sottolineare parole chiave in `text-[hsl(25,95%,53%)]` (aggiungere campo `headlineAccent` opzionale all'interfaccia, oppure colorare automaticamente l'ultima parte)
5. **Stagger animations** — Usare `variants` con `staggerChildren: 0.12` come nella homepage invece di animazioni individuali con delay
6. **CTA rounded-full** — Bottone CTA con `rounded-full` e stile identico alla homepage
7. **Trust badges** — Aggiungere riga "Setup in 15 minuti / Prova 14 giorni gratis / Cancelli quando vuoi" sotto il CTA
8. **Overflow hidden** — Aggiungere `overflow-hidden` alla section per contenere i floating shapes

### Migliorare anche le altre sezioni

- **Pain section**: sfondo scuro (`bg-[#0F0E0D]`) invece di bianco, testo chiaro, card con bordi sottili
- **Steps section**: sfondo scuro, numeri step in arancione, connettori visivi tra step
- **Features grid**: card con sfondo `bg-white/5` su sfondo scuro, hover con glow arancione
- **Testimonial**: sfondo scuro, quote in bianco
- **FAQ**: sfondo leggermente piu scuro, accordion con bordi sottili
- **CTA finale**: glow arancione sfumato dietro il testo

### Aggiornare le 6 pagine funzionalita

Aggiungere un campo `headlineAccent` ai dati di ogni pagina per la parte arancione dell'headline (es. "Nessuno puo timbrare da casa." in arancione).

## File modificati
- `src/components/landing/FeaturePageTemplate.tsx` — redesign completo con effetti homepage
- `src/pages/funzionalita/Documenti.tsx` — aggiunta headlineAccent
- `src/pages/funzionalita/Tesserini.tsx` — aggiunta headlineAccent
- `src/pages/funzionalita/Accessi.tsx` — aggiunta headlineAccent
- `src/pages/funzionalita/Firma.tsx` — aggiunta headlineAccent
- `src/pages/funzionalita/Comunicazioni.tsx` — aggiunta headlineAccent
- `src/pages/funzionalita/Veicoli.tsx` — aggiunta headlineAccent

