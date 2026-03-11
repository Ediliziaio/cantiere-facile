

# Piano: Pricing fix, design upgrade, e video demo modal

## 1. Fix prezzi mensili (PricingSection.tsx)

I prezzi mensili corretti sono:
- **Starter**: Gratis (€0) — invariato
- **Professional**: €32/mese mensile → €26/mese annuale (sconto ~20%)
- **Business**: €42/mese mensile → €34/mese annuale (sconto ~20%)

Attualmente i valori sono `monthly: 42, annual: 32` e `monthly: 52, annual: 42`. Vanno corretti a `monthly: 32, annual: 26` e `monthly: 42, annual: 34`.

## 2. Design upgrade card pricing

- Aggiungere icone lucide-react per ogni feature (es. `Building2` per cantieri, `Users` per lavoratori, `PenTool` per firma, `Shield` per SLA, etc.)
- Card Professional: bordo gradient arancione-ambra usando un wrapper `div` con `bg-gradient-to-b from-orange-500 to-amber-400` e `p-[2px]` con card interna bianca
- Aggiungere un sottile glow/shadow arancione più pronunciato sulla card Pro
- Migliorare spacing e visual hierarchy

## 3. Video demo modal (HeroSection.tsx)

- Importare `Dialog` da `@/components/ui/dialog`
- Il bottone "Guarda come funziona →" apre un Dialog/modal
- Il modal contiene un placeholder video embed (iframe YouTube o un placeholder con testo "Demo in arrivo")
- Sfondo scuro overlay, modal centrato con aspect ratio 16:9
- Aggiungere stato `useState` per open/close

## File modificati
- `src/components/landing/PricingSection.tsx` — prezzi + icone + gradient border
- `src/components/landing/HeroSection.tsx` — dialog video demo

