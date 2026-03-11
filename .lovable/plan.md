

# Piano: Ottimizzazione Mobile Completa - Step by Step

L'app ha già una buona base mobile (bottom nav, sidebar nascosta, safe areas), ma diverse pagine hanno problemi su schermi piccoli: tabelle che traboccano, filtri che non si adattano, header con pulsanti schiacciati, tabs con scroll orizzontale mancante. Ecco il piano area per area.

---

## Step 1: Layout globale e TopBar

**Problemi**: I pulsanti nella TopBar sono compatti ma il dropdown notifiche da `w-80` potrebbe traboccare su schermi < 375px.

**Interventi**:
- Rendere il dropdown notifiche `w-[calc(100vw-2rem)]` su mobile con `max-w-80`
- Aggiungere `touch-manipulation` al bottom nav per eliminare il delay di 300ms sui tap

---

## Step 2: Dashboard

**Problemi**: La griglia stat cards `grid-cols-2` funziona, ma i pulsanti azione `flex-wrap` possono risultare stretti. Le sezioni lista non hanno padding ottimale.

**Interventi**:
- Pulsanti azione: stack verticale su mobile (`flex-col sm:flex-row`), full-width
- Titoli sezione: ridurre a `text-xl` su mobile
- Stat cards: testo più compatto su schermi piccoli (`text-xl` invece di `text-2xl` sotto sm)

---

## Step 3: CantiereDetail - TabsList con scroll orizzontale

**Problemi**: 7 tabs (Documenti, Subappaltatori, Lavoratori, Mezzi, Accessi, Galleria, Diario) non entrano su mobile. Nessuno scroll orizzontale configurato.

**Interventi**:
- Wrappare `TabsList` in un container con `overflow-x-auto` e `scrollbar-hide`
- Aggiungere `flex-nowrap` e `w-max` alla TabsList
- Rimuovere i conteggi dai tab label su mobile per risparmiare spazio

---

## Step 4: BadgeList - Tabella responsive

**Problemi**: La tabella HTML nativa non è responsive. Su mobile mostra solo Lavoratore e Stato, ma la riga "Dettaglio" con testo occupa troppo spazio.

**Interventi**:
- Convertire in card layout su mobile: ogni badge diventa una card compatta con info impilate
- Mostrare tabella solo da `md:` in su
- Card mobile: nome, mansione, stato, scadenza in layout verticale con link all'intera card

---

## Step 5: FirmaDashboard - Tabella documenti

**Problemi**: Stessa questione della tabella. I filtri Select con `w-[180px]` fisso possono traboccare.

**Interventi**:
- Filtri: `w-full sm:w-[180px]` per stack su mobile
- Tabella: card view su mobile (ogni documento = card con nome, stato, firmatari)
- Header con pulsanti: stack verticale su mobile, bottoni full-width

---

## Step 6: Documenti - Filtri stato

**Problemi**: I bottoni filtro stato (`Tutti`, `Valido`, `In scadenza`, `Scaduto`, `Da verificare`) non entrano su una riga su mobile.

**Interventi**:
- Wrappare i filtri in un container con `overflow-x-auto` e `flex-nowrap`
- Oppure usare un `Select` dropdown su mobile al posto dei bottoni

---

## Step 7: Accessi - Pagina complessa

**Problemi**: Pagina molto densa (573 righe) con filtri multipli, tabs, tabelle, mappa e grafici. I filtri (Select, Input, DatePicker, ToggleGroup) possono risultare caotici su mobile.

**Interventi**:
- Raggruppare filtri in un `Collapsible` su mobile ("Filtri" con toggle)
- Tabs (Tabella/Mappa/Grafici): assicurare scroll orizzontale
- Tabella accessi: card view su mobile

---

## Step 8: Timbrature e Mezzi

**Timbrature**: Stessi problemi dei filtri multipli. Convertire in layout filtri collassabili su mobile.

**Mezzi**: La griglia cards `md:grid-cols-2` funziona bene, ma i filtri (search + 2 select) necessitano stack verticale su mobile con `w-full`.

---

## Step 9: Scadenze e Lavoratori

**Scadenze**: I bottoni filtro range possono traboccare. Wrappare con `overflow-x-auto`.

**Lavoratori**: Già abbastanza responsive. Aggiungere `active:bg-accent` per feedback tattile.

---

## Step 10: Firma pubblica e NuovoCantiere

**Firma pubblica**: Già ottimizzata con le animazioni recenti. Verificare che il canvas firma funzioni bene con touch events su tutti i dispositivi.

**NuovoCantiere/NuovoMezzo**: Form lunghi - assicurare che gli input non siano tagliati e che i bottoni submit siano sticky in fondo.

---

## Dettagli tecnici di implementazione

Ogni step modifica 1-3 file. Pattern ricorrenti:
- **Tabelle → Card su mobile**: `hidden md:block` per tabella, `md:hidden` per card grid
- **Filtri → Stack o Collapsible**: `flex-col sm:flex-row` oppure `Collapsible` con trigger "Mostra filtri"
- **Tabs overflow**: container `overflow-x-auto scrollbar-hide`, TabsList con `w-max`
- **Bottoni header**: `flex-col sm:flex-row gap-2` con `w-full sm:w-auto`
- **Touch feedback**: `active:scale-95 transition-transform` sui card interattivi

Stima: ~10 file da modificare, nessun nuovo componente necessario.

