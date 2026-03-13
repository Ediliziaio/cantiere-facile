

# Filtri avanzati su tutte le pagine — Piano incrementale

Lavoro suddiviso in 11 step, uno per pagina. Ogni step aggiunge filtri `Select` coerenti con i dati disponibili.

## Riepilogo modifiche per pagina

| # | Pagina | Filtri da aggiungere | Note |
|---|--------|---------------------|------|
| 1 | **SuperAdmin Audit Log** | Filtro Azienda (tenant) | Elenco tenant da `tenant_name` nei log |
| 2 | **SuperAdmin Billing** | Filtro Azienda (tenant) | Elenco tenant da `tenant_name` nelle fatture |
| 3 | **Dashboard** | Filtro Cantiere | Filtra stat cards, scadenze, accessi per cantiere |
| 4 | **Comunicazioni** | Già ha filtro cantiere e tipo | Nessuna modifica necessaria |
| 5 | **Scadenze** | Filtro Cantiere | Filtra per `cantiere` (stringa nel mock) |
| 6 | **Analytics** | Filtro Cantiere | Passa cantiere selezionato ai sotto-componenti |
| 7 | **Cantieri** | Filtro Stato (attivo/completato) | Già ha search, aggiunge stato |
| 8 | **Documenti** | Già ha filtri completi | Nessuna modifica necessaria |
| 9 | **Lavoratori** | Filtro Tipo (interno/esterno), Filtro Cantiere | Cantiere via worker assignments |
| 10 | **Subappaltatori** | Filtro Cantiere, Filtro Stato documenti | |
| 11 | **Mezzi** | Già ha filtro cantiere e stato | Nessuna modifica necessaria |

## Pagine che NON richiedono modifiche
- **Comunicazioni**: ha già filtri cantiere + tipo
- **Documenti**: ha già filtri stato, cantiere, categoria, processing, riferimento
- **Mezzi**: ha già filtri cantiere + stato operativo

## Approccio tecnico

Ogni pagina usa lo stesso pattern:
1. `useState` per ogni filtro con valore default `"tutti"`
2. `Select` component dal design system esistente
3. Filtri inline nella barra header con `flex-wrap gap-2`
4. Pipeline: `search → filtri → (sort → paginate dove presente)`

## File modificati (8 file)

| File | Modifica |
|------|----------|
| `src/pages/superadmin/SuperAdminAuditLog.tsx` | + Select tenant |
| `src/pages/superadmin/SuperAdminBilling.tsx` | + Select tenant |
| `src/pages/Dashboard.tsx` | + Select cantiere, filtrare dati |
| `src/pages/Scadenze.tsx` | + Select cantiere |
| `src/pages/Analytics.tsx` | + Select cantiere, passare a sotto-componenti |
| `src/pages/Cantieri.tsx` | + Select stato |
| `src/pages/Lavoratori.tsx` | + Select tipo + Select cantiere (opzionale, basato su subappaltatore→cantiere) |
| `src/pages/Subappaltatori.tsx` | + Select cantiere + Select stato documenti |

Implemento uno alla volta come richiesto, partendo dalle pagine SuperAdmin e procedendo verso le pagine app.

