

## Certificato PDF + Verifica DURC/Formazione Automatica

### 1. Certificato di conformità legale scaricabile in PDF

**`src/pages/BadgeDetail.tsx`** — Aggiungere bottone "Scarica Certificato" che genera un PDF via `html2canvas`:
- Creare un div nascosto (`ref`) con layout certificato formale contenente:
  - Header con logo/nome "Cantiere in Cloud" e dicitura "Certificato di Conformità Legale"
  - Dati lavoratore: nome, cognome, CF, mansione, impresa
  - Dati badge: numero progressivo, codice univoco, data emissione, data scadenza
  - Dati cantiere: nome, indirizzo
  - Stato conformità: documenti, formazione, idoneità sanitaria (con icone)
  - Riferimento normativo D.L. 159/2025
  - Firma digitale hash completa
  - QR code (già presente, via `qrcode.react`)
  - Timestamp generazione e disclaimer legale
- Bottone nella sezione azioni accanto a "Esporta PDF"
- Export come PNG ad alta risoluzione (scale: 3) con nome `certificato-{codice}.png`

**`src/pages/VerificaBadge.tsx`** — Aggiungere bottone "Scarica Certificato" anche nella pagina pubblica di verifica, con lo stesso layout.

### 2. Verifica automatica DURC e formazione

**`src/data/mock-data.ts`** — Aggiungere documenti mock per lavoratori mancanti:
- Documenti DURC per subappaltatori dei lavoratori (già presenti per s1, s2)
- Documenti "Formazione" per lavoratori l1, l3, l4, l5 (attualmente solo l2 ha "Attestato Sicurezza" scaduto)
- Documenti "Idoneità Sanitaria" per l3 (in scadenza, per coerenza con mock verifiche)

**`src/data/mock-badges.ts`** — Creare funzione helper `calcolaStatoConformita(badge)`:
- Cerca documenti lavoratore in `mockDocumenti` per categorie: "Attestato Sicurezza" / "Formazione", "Idoneità Sanitaria", "DURC" (tramite subappaltatore_id del lavoratore)
- Per ogni categoria restituisce: `ok` (valido), `warning` (in_scadenza), `bloccato` (scaduto/mancante)
- Restituisce anche `esito_finale`: verde/giallo/rosso
- Questa funzione sostituisce i valori hardcoded in `mockVerificheAccesso`

**`src/pages/BadgeDetail.tsx`** — Usare `calcolaStatoConformita` al posto di `mockVerificheAccesso`:
- Stato conformità calcolato dinamicamente dai documenti reali
- Aggiungere riga "DURC impresa" con stato derivato dal DURC del subappaltatore/tenant
- Mostrare data scadenza accanto a ogni check

**`src/pages/VerificaBadge.tsx`** — Usare `calcolaStatoConformita`:
- Le CheckRow riflettono lo stato reale dei documenti (DURC, formazione, idoneità)
- Aggiungere riga DURC
- Banner stato basato su `esito_finale` calcolato

**`src/components/badge/BadgeCard.tsx`** — Aggiungere indicatore visivo piccolo (pallino colorato) nell'angolo della card che riflette l'esito conformità calcolato.

### File coinvolti
- `src/data/mock-data.ts` — nuovi documenti mock lavoratori
- `src/data/mock-badges.ts` — funzione `calcolaStatoConformita`
- `src/pages/BadgeDetail.tsx` — certificato PDF + conformità dinamica
- `src/pages/VerificaBadge.tsx` — certificato PDF + conformità dinamica
- `src/components/badge/BadgeCard.tsx` — indicatore conformità

