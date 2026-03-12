

# Piano: Sistema Identificazione Digitale Operai con QR Sicuri

## Stato attuale

Il progetto ha già:
- **Badge system completo** (`mock-badges.ts`): Badge type con QR payload, conformità D.L. 159/2025, hash firma digitale
- **BadgeCard.tsx**: Card visiva con QR (qrcode.react), status chip, conformità indicator
- **BadgeList/BadgeDetail/BadgeNuovo**: CRUD completo badge
- **Scan.tsx**: Scanner QR con html5-qrcode, camera posteriore, simulazione
- **CheckIn.tsx**: Sistema check-in GPS con geofencing, offline queue, 3 modalità
- **VerificaBadge.tsx**: Pagina pubblica verifica badge
- **CertificatoConformita.tsx**: Certificato PDF esportabile
- **Mock data**: 5 lavoratori, 5 badge, timbrature, verifiche accesso, documenti con scadenze
- **Supabase NON connesso** — tutto è mock/localStorage

## Cosa manca rispetto ai requirements

1. **Profilo operaio avanzato** — non esiste una pagina `/app/lavoratori/:id`
2. **Qualifiche/formazione strutturate** — mockLavoratori ha solo campi base (nome, cognome, mansione, cf)
3. **Compliance check integrato nel check-in** — CheckIn.tsx non verifica badge/documenti prima di timbrare
4. **Dashboard worker** — timeline scadenze, upload documenti, anteprima tesserino
5. **Rate limiting scanner** — anti-brute force
6. **Integrazione QR scan nel check-in** — CheckIn.tsx ha GPS Auto e Manuale ma non QR Scan mode

## Piano implementativo

### 1. Estendere mock data lavoratori (`src/data/mock-data.ts`)
Aggiungere a `mockLavoratori` campi strutturati:
- `qualifications`: array `{type, expiry, doc_url}`
- `safety_training`: array `{course, date, expiry, hours}`
- `durc_valid`, `durc_expiry`
- `health_status`: "idoneo" | "idoneo_limitato" | "non_idoneo"
- `last_medical_visit`
- `is_compliant`: calcolato (tutti doc in regola)

### 2. Hook `useBadgeVerification.ts`
Verifica completa prima del check-in:
- QR non scaduto e non revocato
- Operaio `is_compliant`
- Assegnazione attiva al cantiere (da `site_assignments` mock)
- Rate limiting: max 10 tentativi errati/minuto per sessione
- Return: `{ canCheckIn, warnings[], blocks[], badge, worker }`

### 3. Hook `useWorkerCompliance.ts`
Calcolo compliance in tempo reale per un lavoratore:
- Controlla scadenze qualifiche, formazione, DURC, idoneità sanitaria
- Return: `{ isCompliant, expiringItems[], expiredItems[], daysToExpiry }`

### 4. Pagina `LavoratoreDetail.tsx` (`/app/lavoratori/:id`)
Dashboard operaio per admin/capo_cantiere:
- **Header**: nome, CF, mansione, stato compliance (badge verde/giallo/rosso)
- **Timeline qualifiche**: barre progresso scadenze con colori (verde >90gg, giallo 30-90gg, rosso <30gg)
- **Sezione formazione**: corsi con scadenze
- **Anteprima tesserino**: BadgeCard del badge attivo
- **Documenti lavoratore**: lista da mockDocumenti con stato
- **Storico presenze**: ultime timbrature

### 5. Integrare QR Scan nel CheckIn.tsx
Aggiungere la terza modalità "QR Scan" nel selettore mode:
- Riusa html5-qrcode per scansionare badge operaio
- Dopo scan: chiama `useBadgeVerification` per validare
- Se compliant: procede con check-in GPS
- Se non compliant: mostra alert con dettaglio blocchi
- Rate limiting visuale: dopo 10 errori mostra "Troppi tentativi, attendi"

### 6. Componente `WorkerComplianceCard.tsx`
Card riutilizzabile che mostra stato compliance:
- Usata in LavoratoreDetail, BadgeDetail, e nel risultato scan CheckIn
- Barre progresso scadenze con giorni restanti
- Alert rosso se documenti scaduti

### 7. Mock data `site_assignments`
Aggiungere in mock-data.ts le assegnazioni operai-cantieri per validare che l'operaio sia assegnato al cantiere dove fa check-in.

## File creati/modificati

| File | Azione |
|------|--------|
| `src/data/mock-data.ts` | Estendere mockLavoratori + aggiungere site_assignments |
| `src/hooks/useBadgeVerification.ts` | Nuovo |
| `src/hooks/useWorkerCompliance.ts` | Nuovo |
| `src/pages/LavoratoreDetail.tsx` | Nuovo |
| `src/components/badge/WorkerComplianceCard.tsx` | Nuovo |
| `src/pages/CheckIn.tsx` | Aggiungere QR mode + compliance check |
| `src/pages/Lavoratori.tsx` | Fix link a `/app/lavoratori/:id` |
| `src/App.tsx` | Aggiungere rotta lavoratori/:id |

## Vincoli

- **No Supabase** — tutto mock/localStorage, strutturato per futura migrazione
- **QR reali** — qrcode.react già in uso, scanner html5-qrcode già funzionante
- **Mobile-first** — bottoni grandi, alto contrasto, haptic feedback già implementato in CheckIn
- **Anti-fraud**: rate limiting client-side (10 tentativi/minuto), mock location detection già presente in useGeolocation

