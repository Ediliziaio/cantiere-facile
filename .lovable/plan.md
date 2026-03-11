

# Piano: Aggiungere sezioni con copy lungo/breve su problemi, multe e mancato controllo

## Cosa aggiungere (4 nuove sezioni tra la griglia e il "Prima e dopo")

### 1. "Il costo dell'improvvisazione" (sfondo scuro `#0F0E0D`)
3 card con numeri grossi arancioni + copy breve e diretto:
- **€12.000 – €30.000** — Sanzione per DURC scaduto o documentazione non conforme (Art. 90 D.Lgs. 81/2008)
- **Blocco cantiere** — Sospensione immediata per irregolarità sugli accessi o lavoratori non tracciati
- **Responsabilità penale** — In caso di incidente con documentazione incompleta, il responsabile rischia da 3 a 7 anni

### 2. "Cosa succede senza controllo" (sfondo chiaro `#FAFAF9`)
Copy lungo in 2 colonne. Colonna SX: scenario reale di cantiere senza sistema digitale (racconto narrativo di una giornata tipo con problemi a cascata — DURC scaduto, operaio senza badge, verbale non firmato, ispezione a sorpresa). Colonna DX: la stessa giornata con Cantiere in Cloud (tutto sotto controllo, alert ricevuti, documenti pronti).

### 3. "Le domande che dovresti farti" (sfondo bianco)
5 domande retoriche con icona AlertTriangle, copy breve per ognuna:
- "Sai quanti documenti scadono questo mese?"
- "Sai chi è in cantiere adesso?"
- "I tuoi verbali sono firmati e archiviati?"
- "Cosa succede se arriva un'ispezione tra 10 minuti?"
- "I tuoi subappaltatori hanno i documenti in regola?"
Sotto: frase chiusura con CTA inline.

### 4. "Numeri che contano" (sfondo scuro)
4 stat animate con `useInView`:
- **78%** delle sanzioni edili è per documentazione non conforme
- **€18.500** multa media per irregolarità in cantiere
- **3 ore/settimana** risparmiate con gestione digitale documenti
- **60 secondi** per una firma digitale vs 5 giorni per una firma cartacea

## File modificato
- `src/pages/FunzionalitaOverview.tsx` — aggiungere 4 sezioni + 4 nuovi `useInView` + icone `AlertTriangle, Clock, Euro, Users`

