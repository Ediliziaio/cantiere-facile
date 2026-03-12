

# Piano: Ottimizzazione pagina Tariffe

## Stato attuale
La pagina ha una buona struttura (Hero, Pricing cards, "Perche costa cosi poco", FAQ, Garanzia, CTA finale) ma manca di elementi che aumentano la conversione e la completezza rispetto alla landing page principale.

## Miglioramenti proposti

### 1. Tabella comparativa feature per piano
Aggiungere una matrice dettagliata che confronti le feature di ogni piano (Starter vs Professional vs Business) con checkmark, per chi vuole un confronto rapido. Posizionata subito dopo le pricing cards.

### 2. Sezione social proof compatta
Aggiungere una riga con loghi clienti e/o una stat ("Scelto da 200+ imprese edili") tra Hero e pricing cards per dare credibilita immediata.

### 3. Calcolatore ROI interattivo
Un widget semplice: "Quanti cantieri gestisci?" (slider) -> mostra il risparmio stimato vs metodi tradizionali. Molto efficace per una pagina tariffe B2B.

### 4. Sezione "Cosa include ogni piano" espandibile
Sotto le cards, una tabella completa con tutte le feature raggruppate per categoria (Documenti, Accessi, Firma, Supporto) con check/cross per piano.

### 5. Badge trust sotto l'hero
GDPR, garanzia 30gg, nessuna carta richiesta — in formato compatto orizzontale.

## Implementazione

### File: `src/pages/Tariffe.tsx`

Modifiche:
1. **Trust bar sotto hero**: Riga con icone (Shield, CreditCard, Clock) + testi brevi ("GDPR compliant", "30gg rimborso", "No carta di credito")
2. **Feature comparison table**: Griglia con categorie raggruppate e check per piano, scrollabile su mobile con colonna sticky (riusa pattern del ComparisonTable)
3. **ROI calculator**: Slider "Numero cantieri" (1-50) + calcolo automatico costo/risparmio vs "gestione tradizionale" stimata a €150/cantiere/mese
4. **Riordinamento sezioni**: Hero -> Trust bar -> Toggle + Cards -> Feature table -> ROI calculator -> "Perche costa cosi poco" -> FAQ -> Garanzia -> CTA

Tutto in un unico file `Tariffe.tsx` per mantenere la struttura attuale.

