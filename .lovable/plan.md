

## Form Nuovo Mezzo + Notifiche Scadenze Mezzi in Dashboard

### 1. Nuova pagina `NuovoMezzo.tsx`

Form completo con i seguenti campi:
- **Tipo** (select: Escavatore, Gru a torre, Autocarro, Piattaforma aerea, Betoniera, Altro)
- **Targa/Matricola** (input text)
- **Descrizione** (textarea)
- **Cantiere** (select da `mockCantieri`)
- **Stato operativo** (select: operativo, in_manutenzione, fermo)
- **Data immatricolazione** (date picker)
- **Data prossima revisione** (date picker)
- **Data prossima manutenzione** (date picker)
- **Scadenza assicurazione** (date picker)
- **Scadenza collaudo** (date picker, opzionale)
- **Ore lavoro** (input number)
- **Km percorsi** (input number, opzionale)
- **Responsabile** (input text)
- **Note** (textarea, opzionale)

Submit: mostra toast di successo e naviga a `/app/mezzi`. Validazione con zod + react-hook-form.

### 2. Route + navigazione

- **`App.tsx`**: Aggiunta route `/app/mezzi/nuovo`
- **`Mezzi.tsx`**: Aggiunta bottone "Nuovo mezzo" in cima che linka a `/app/mezzi/nuovo`

### 3. Dashboard — Sezione scadenze mezzi

- **`Dashboard.tsx`**: Nuova sezione "Scadenze mezzi" dopo "Prossime scadenze", che mostra i mezzi con revisione/manutenzione/assicurazione in scadenza o scadute (usando `getScadenzaStatus`). Ogni riga mostra tipo mezzo, targa, tipo scadenza, data, chip stato. Link a dettaglio mezzo.
- Aggiunta stat card "Mezzi con scadenze" nel grid stats esistente con icona Truck.

### File

- **Creato**: `src/pages/NuovoMezzo.tsx`
- **Modificati**: `src/App.tsx`, `src/pages/Mezzi.tsx`, `src/pages/Dashboard.tsx`

