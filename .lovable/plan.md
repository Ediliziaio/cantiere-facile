

# Piano: Sidebar secondaria per Impostazioni + Ruolo "Utente" + Profilo arricchito

## 1. UX: Sidebar secondaria al posto dei Tab

Sostituire i `Tabs` con un layout a **due colonne**: una sidebar sinistra con le voci di navigazione (Profilo Azienda, Utenti & Accessi, Log Attività, Notifiche Email, Preferenze) e il contenuto a destra. Su mobile la sidebar diventa un menu orizzontale scrollabile o una select.

**Implementazione**: Usare `useState` per la sezione attiva e un semplice rendering condizionale. Niente più `<Tabs>` — elimina il bug `TabsContent must be within Tabs`.

```text
┌──────────────────┬────────────────────────────────────┐
│ Profilo Azienda  │                                    │
│ Utenti & Accessi │  [Contenuto sezione selezionata]   │
│ Log Attività     │                                    │
│ Notifiche Email  │                                    │
│ Preferenze       │                                    │
└──────────────────┴────────────────────────────────────┘
```

## 2. Profilo Azienda arricchito

Aggiungere al profilo i campi mancanti dal `mockTenant` e nuovi campi mock:
- **Telefono**, **PEC**, **Codice SDI**, **Indirizzo sede legale**, **Codice ATECO**, **CCNL applicato**, **Responsabile legale**, **Data iscrizione piattaforma**, **N. cantieri attivi**, **N. lavoratori totali**

Aggiungere questi campi a `mockTenant` in `mock-data.ts`.

## 3. Nuovo ruolo "Utente" (dipendente operativo)

**`src/data/mock-data.ts`**:
- `UtenteRuolo` diventa `"admin" | "manager" | "utente"`
- Aggiungere utenti mock con ruolo `"utente"`

**`src/contexts/AuthContext.tsx`**:
- `UserRole` diventa `"superadmin" | "admin" | "manager" | "utente"`

**`src/pages/Impostazioni.tsx`**:
- Aggiornare tabella permessi con colonna "Utente"
- Aggiornare badge ruolo, select invito, dropdown cambio ruolo
- Permessi utente: check-in/out, comunicazioni, badge, firma documenti (se abilitato), no gestione cantieri/impostazioni

## File modificati

| File | Modifica |
|------|----------|
| `src/data/mock-data.ts` | Arricchire `mockTenant`, aggiungere `"utente"` a `UtenteRuolo`, mock utenti |
| `src/contexts/AuthContext.tsx` | Aggiungere `"utente"` a `UserRole` |
| `src/pages/Impostazioni.tsx` | Sostituire Tabs con sidebar layout, arricchire profilo, supportare ruolo utente |

