

## Badge con Validità Legale — D.L. 159/2025

### Obiettivo
Rendere il badge digitale conforme al D.L. 159/2025 (Decreto Sicurezza Cantieri) aggiungendo tutti i campi obbligatori per legge, firma digitale simulata, numerazione progressiva e dichiarazione di conformità normativa.

### Modifiche

**1. `src/data/mock-badges.ts`** — Estendere l'interfaccia `Badge`:
- `codice_fiscale_lavoratore`: CF del lavoratore (derivato dai mock)
- `numero_progressivo`: numero univoco sequenziale per tenant
- `ente_emittente`: ragione sociale + P.IVA dell'azienda emittente
- `firma_digitale_hash`: stringa SHA-256 simulata (anti-contraffazione)
- `riferimento_normativo`: "D.L. 159/2025 — Art. 4"
- `data_verifica_documenti`: timestamp ultima verifica conformità

Aggiornare i mockBadges con questi campi.

**2. `src/components/badge/BadgeCard.tsx`** — Aggiungere al layout:
- Codice fiscale del lavoratore sotto il nome
- Numero progressivo badge (es. "N° 001/2026")
- Dicitura "Conforme D.L. 159/2025" con icona Shield nel footer
- Hash firma digitale troncato (prime 12 cifre) come codice anti-contraffazione
- Data emissione visibile

**3. `src/pages/VerificaBadge.tsx`** — Potenziare la pagina pubblica:
- Sezione "Validità Legale" con:
  - Numero progressivo
  - Ente emittente (azienda + P.IVA)
  - Riferimento normativo D.L. 159/2025
  - Hash firma digitale completo
  - Data e ora di emissione
  - Data ultima verifica documenti
- Banner colorato: verde = "Badge valido e conforme", giallo = "Attenzione: documenti in scadenza", rosso = "Badge non valido"
- Disclaimer legale in fondo: "Documento conforme al D.L. 159/2025. La verifica è stata effettuata in tempo reale sul sistema Cantiere in Cloud."

**4. `src/pages/BadgeDetail.tsx`** — Aggiungere sezione "Dati Legali":
- Card con tutti i campi normativi: numero progressivo, ente emittente, hash firma, riferimento normativo, data emissione
- Bottone "Verifica autenticità" che apre il link pubblico di verifica

**5. `src/pages/BadgeNuovo.tsx`** — Nella preview del badge e nell'emissione:
- Generare automaticamente numero progressivo (conteggio badge esistenti + 1)
- Generare hash firma digitale simulata
- Mostrare la dicitura normativa nell'anteprima

### Campi obbligatori D.L. 159/2025 coperti
- Nome e cognome lavoratore
- Codice fiscale lavoratore
- Mansione
- Impresa di appartenenza + P.IVA
- Cantiere di assegnazione
- Data emissione e scadenza
- Numero progressivo univoco
- QR code per verifica pubblica
- Stato conformità documentale (documenti, formazione, idoneità)
- Riferimento normativo esplicito

### File coinvolti
- `src/data/mock-badges.ts`
- `src/components/badge/BadgeCard.tsx`
- `src/pages/VerificaBadge.tsx`
- `src/pages/BadgeDetail.tsx`
- `src/pages/BadgeNuovo.tsx`

