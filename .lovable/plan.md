

# Piano: Sidebar Impostazioni stile GHL (replace main sidebar)

## Concetto

Quando l'utente naviga su `/app/impostazioni/*`, la sidebar principale dell'app viene **sostituita** da una sidebar dedicata alle impostazioni con un pulsante "← Torna indietro" in cima. Esattamente come GoHighLevel.

## Approccio tecnico

### 1. Nuove route separate per Impostazioni

Spostare `/app/impostazioni` fuori da `AppLayout` e creare un **`SettingsLayout`** dedicato che usa la stessa struttura (SidebarProvider + Sidebar + TopBar + Outlet) ma con una **sidebar diversa**.

```text
/app/impostazioni          → SettingsLayout + SettingsSidebar
  /app/impostazioni/profilo
  /app/impostazioni/utenti
  /app/impostazioni/log
  /app/impostazioni/notifiche
  /app/impostazioni/preferenze
```

### 2. Nuovo componente `SettingsSidebar`

Sostituisce `AppSidebar` dentro `SettingsLayout`:
- In cima: bottone "← Torna all'app" che naviga a `/app/dashboard`
- Logo/titolo "Impostazioni"
- Voci: Profilo Azienda, Utenti & Accessi, Log Attività, Notifiche Email, Preferenze
- Stessa estetica della sidebar principale (usa gli stessi componenti Sidebar di shadcn)

### 3. Nuovo componente `SettingsLayout`

Identico ad `AppLayout` ma usa `SettingsSidebar` al posto di `AppSidebar`. Riusa `TopBar` e `MobileBottomNav` (o una versione semplificata).

### 4. Spezzare Impostazioni in pagine separate

Ogni sezione diventa una pagina dedicata sotto `src/pages/impostazioni/`:
- `ImpostazioniProfilo.tsx` — Profilo azienda
- `ImpostazioniUtenti.tsx` — Utenti & Accessi  
- `ImpostazioniLog.tsx` — Log Attività
- `ImpostazioniNotifiche.tsx` — Notifiche Email
- `ImpostazioniPreferenze.tsx` — Preferenze

La logica viene spostata dal monolitico `Impostazioni.tsx` in queste pagine.

### 5. Aggiornamento routing in `App.tsx`

```text
// Rimpiazzare:
<Route path="impostazioni" element={<Impostazioni />} />

// Con:
<Route path="/app/impostazioni" element={<SettingsLayout />}>
  <Route index element={<Navigate to="profilo" />} />
  <Route path="profilo" element={<ImpostazioniProfilo />} />
  <Route path="utenti" element={<ImpostazioniUtenti />} />
  <Route path="log" element={<ImpostazioniLog />} />
  <Route path="notifiche" element={<ImpostazioniNotifiche />} />
  <Route path="preferenze" element={<ImpostazioniPreferenze />} />
</Route>
```

Su mobile: la sidebar delle impostazioni appare come bottom nav o menu orizzontale scrollabile in cima.

## File

| File | Azione |
|------|--------|
| `src/components/layout/SettingsSidebar.tsx` | Nuovo — sidebar impostazioni con back button |
| `src/components/layout/SettingsLayout.tsx` | Nuovo — layout wrapper per impostazioni |
| `src/pages/impostazioni/ImpostazioniProfilo.tsx` | Nuovo — sezione profilo |
| `src/pages/impostazioni/ImpostazioniUtenti.tsx` | Nuovo — sezione utenti |
| `src/pages/impostazioni/ImpostazioniLog.tsx` | Nuovo — sezione log |
| `src/pages/impostazioni/ImpostazioniNotifiche.tsx` | Nuovo — sezione notifiche |
| `src/pages/impostazioni/ImpostazioniPreferenze.tsx` | Nuovo — sezione preferenze |
| `src/App.tsx` | Aggiornare routing |
| `src/pages/Impostazioni.tsx` | Eliminare (sostituito dalle sub-pages) |

