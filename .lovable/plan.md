

# Piano: Aggiungere le 4 sezioni della pagina Funzionalità anche nella Home

## Obiettivo
Portare nella landing page le 4 sezioni ad alto impatto già presenti in `/funzionalita`: penalità, scenario senza/con controllo, domande retoriche e statistiche.

## Approccio
Estrarre le 4 sezioni in componenti standalone riutilizzabili dentro `src/components/landing/`, poi importarli sia nella home che nella pagina funzionalità.

## File da creare

### 1. `src/components/landing/PenaltiesSection.tsx`
Sezione "Il costo dell'improvvisazione" — 3 card scure con sanzioni, blocco cantiere, responsabilità penale.

### 2. `src/components/landing/ScenarioSection.tsx`
Sezione "Cosa succede senza controllo" — 2 colonne con racconto giornata tipo senza vs con piattaforma.

### 3. `src/components/landing/RetoricalQuestionsSection.tsx`
Sezione "Le domande che dovresti farti" — 5 domande con AlertTriangle + copy breve.

### 4. `src/components/landing/StatsSection.tsx`
Sezione "Numeri che contano" — 4 stat animate (78% sanzioni, €18.500, 3 ore, 60 sec).

## File da modificare

### 5. `src/pages/Landing.tsx`
Importare e inserire i 4 nuovi componenti dopo `AlternatingFeatures` e prima di `TestimonialsSection`:
```
<AlternatingFeatures />
<PenaltiesSection />
<ScenarioSection />
<RetoricalQuestionsSection />
<StatsSection />
<TestimonialsSection />
```

### 6. `src/pages/FunzionalitaOverview.tsx`
Sostituire le 4 sezioni inline con i nuovi componenti importati (stessi dati, zero duplicazione).

