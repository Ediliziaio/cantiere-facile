

## Gestione Utenti Azienda — Piano

### Obiettivo
Aggiungere nella pagina Impostazioni una sezione completa per gestire gli utenti dell'azienda con ruoli differenziati (Admin, Manager), permettendo di invitare, modificare e rimuovere utenti.

### Dati mock

**`src/data/mock-data.ts`** — Aggiungere:
- `mockUtentiAzienda[]` con: id, tenant_id, nome, cognome, email, ruolo (`admin` | `manager`), stato (`attivo` | `invitato` | `disabilitato`), ultimo_accesso, cantieri_assegnati (array di cantiere_id)
- ~5 utenti di esempio tra admin e manager, con cantieri assegnati

### Pagina Impostazioni

**`src/pages/Impostazioni.tsx`** — Riscrittura con Tabs:

- **Tab "Profilo Azienda"**: mantiene la scheda attuale con dati tenant
- **Tab "Utenti & Accessi"** (nuova):
  - Tabella utenti con colonne: Nome, Email, Ruolo (badge colorato), Stato, Cantieri assegnati, Ultimo accesso, Azioni
  - **Bottone "Invita Utente"** → Dialog con:
    - Input nome, cognome, email
    - Select ruolo (Admin / Manager)
    - Multi-select cantieri (solo per Manager, Admin ha accesso a tutti)
    - Aggiunge utente allo state locale con stato "invitato"
  - **Azioni per riga**:
    - Modifica ruolo (dropdown inline)
    - Gestisci cantieri assegnati (dialog con checkbox dei cantieri)
    - Disabilita/Riabilita utente
    - Rimuovi utente (con conferma AlertDialog)
  - Chip visivo per ruolo: Admin = blu, Manager = verde
  - Descrizione permessi sotto il titolo: "Admin: accesso completo · Manager: accesso ai cantieri assegnati, no fatturazione/impostazioni"

### Permessi visibili

Sotto la tabella utenti, una card riassuntiva dei permessi per ruolo:

| Funzione | Admin | Manager |
|----------|-------|---------|
| Dashboard | ✅ | ✅ (cantieri assegnati) |
| Cantieri | ✅ tutti | Solo assegnati |
| Documenti | ✅ | Solo cantieri assegnati |
| Lavoratori | ✅ | Sola lettura |
| Impostazioni | ✅ | ❌ |
| Utenti | ✅ | ❌ |

### SuperAdmin — Dettaglio Azienda

**`src/pages/superadmin/SuperAdminAziendaDetail.tsx`** — Aggiungere una sezione "Utenti" sotto i dati azienda che mostra la lista utenti dell'azienda (filtrati per tenant_id dal mock), con ruolo e stato.

### File coinvolti
- `src/data/mock-data.ts` — aggiunta `mockUtentiAzienda`
- `src/pages/Impostazioni.tsx` — riscrittura completa con tabs e gestione utenti
- `src/pages/superadmin/SuperAdminAziendaDetail.tsx` — sezione utenti azienda

