import { mockLavoratori, mockCantieri, mockTenant } from "./mock-data";

export type BadgeStato = "attivo" | "sospeso" | "revocato";
export type TimbraturaTipo = "entrata" | "uscita";
export type TimbrataMetodo = "qr_scan" | "rfid" | "manuale";
export type TimbrataEsito = "autorizzato" | "bloccato" | "warning";
export type EsitoFinale = "verde" | "giallo" | "rosso";
export type StatoCheck = "ok" | "warning" | "bloccato" | "non_dichiarata";

export interface Badge {
  id: string;
  tenant_id: string;
  lavoratore_id: string;
  cantiere_id: string;
  codice_univoco: string;
  qr_payload: string;
  stato: BadgeStato;
  data_emissione: string;
  data_scadenza: string;
  note: string | null;
  created_at: string;
}

export interface Timbratura {
  id: string;
  tenant_id: string;
  badge_id: string;
  lavoratore_id: string;
  cantiere_id: string;
  tipo: TimbraturaTipo;
  timestamp: string;
  latitudine: number | null;
  longitudine: number | null;
  metodo: TimbrataMetodo;
  preposto_id: string | null;
  esito: TimbrataEsito;
  motivo_blocco: string | null;
  created_at: string;
}

export interface VerificaAccesso {
  id: string;
  tenant_id: string;
  badge_id: string;
  lavoratore_id: string;
  cantiere_id: string;
  timestamp: string;
  stato_documenti: StatoCheck;
  stato_formazione: StatoCheck;
  stato_idoneita_sanitaria: StatoCheck;
  esito_finale: EsitoFinale;
  dettaglio: Record<string, unknown>;
}

// Generate badge codes
const genCode = (i: number) => `CIC-2026-${String(i).padStart(6, "0")}`;

export const mockBadges: Badge[] = [
  {
    id: "b1", tenant_id: "t1", lavoratore_id: "l1", cantiere_id: "c1",
    codice_univoco: genCode(1),
    qr_payload: JSON.stringify({ code: genCode(1), worker: "l1", site: "c1" }),
    stato: "attivo", data_emissione: "2026-01-15", data_scadenza: "2027-01-15",
    note: null, created_at: "2026-01-15T08:00:00",
  },
  {
    id: "b2", tenant_id: "t1", lavoratore_id: "l2", cantiere_id: "c1",
    codice_univoco: genCode(2),
    qr_payload: JSON.stringify({ code: genCode(2), worker: "l2", site: "c1" }),
    stato: "attivo", data_emissione: "2026-01-15", data_scadenza: "2027-01-15",
    note: null, created_at: "2026-01-15T08:00:00",
  },
  {
    id: "b3", tenant_id: "t1", lavoratore_id: "l3", cantiere_id: "c1",
    codice_univoco: genCode(3),
    qr_payload: JSON.stringify({ code: genCode(3), worker: "l3", site: "c1" }),
    stato: "sospeso", data_emissione: "2026-01-15", data_scadenza: "2027-01-15",
    note: "Documento sicurezza scaduto", created_at: "2026-01-15T08:00:00",
  },
  {
    id: "b4", tenant_id: "t1", lavoratore_id: "l4", cantiere_id: "c2",
    codice_univoco: genCode(4),
    qr_payload: JSON.stringify({ code: genCode(4), worker: "l4", site: "c2" }),
    stato: "attivo", data_emissione: "2026-02-01", data_scadenza: "2027-02-01",
    note: null, created_at: "2026-02-01T08:00:00",
  },
  {
    id: "b5", tenant_id: "t1", lavoratore_id: "l5", cantiere_id: "c1",
    codice_univoco: genCode(5),
    qr_payload: JSON.stringify({ code: genCode(5), worker: "l5", site: "c1" }),
    stato: "attivo", data_emissione: "2026-01-20", data_scadenza: "2027-01-20",
    note: null, created_at: "2026-01-20T08:00:00",
  },
];

// Generate 14 days of timbrature
function generateTimbrature(): Timbratura[] {
  const result: Timbratura[] = [];
  const workers = [
    { lid: "l1", bid: "b1", cid: "c1" },
    { lid: "l2", bid: "b2", cid: "c1" },
    { lid: "l4", bid: "b4", cid: "c2" },
    { lid: "l5", bid: "b5", cid: "c1" },
  ];
  let id = 1;

  for (let day = 0; day < 14; day++) {
    const date = new Date(2026, 1, 24 + day); // Feb 24 - Mar 9
    if (date.getDay() === 0) continue; // skip Sunday

    for (const w of workers) {
      // skip some days randomly for variety
      if (day % 5 === 3 && w.lid === "l5") continue;

      const entryHour = 7 + Math.floor(Math.random() * 2);
      const entryMin = Math.floor(Math.random() * 30);
      const exitHour = 16 + Math.floor(Math.random() * 2);
      const exitMin = Math.floor(Math.random() * 30);

      let esito: TimbrataEsito = "autorizzato";
      let motivo: string | null = null;
      // Add some warnings and one block
      if (day === 5 && w.lid === "l2") {
        esito = "warning";
        motivo = "Idoneità sanitaria in scadenza";
      }
      if (day === 10 && w.lid === "l4") {
        esito = "bloccato";
        motivo = "Attestato sicurezza scaduto";
      }

      const ts = (h: number, m: number) =>
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;

      result.push({
        id: `tim${id++}`, tenant_id: "t1", badge_id: w.bid,
        lavoratore_id: w.lid, cantiere_id: w.cid, tipo: "entrata",
        timestamp: ts(entryHour, entryMin),
        latitudine: 45.4642 + Math.random() * 0.001,
        longitudine: 9.19 + Math.random() * 0.001,
        metodo: Math.random() > 0.3 ? "qr_scan" : "manuale",
        preposto_id: "l1", esito, motivo_blocco: motivo,
        created_at: ts(entryHour, entryMin),
      });

      if (esito !== "bloccato") {
        result.push({
          id: `tim${id++}`, tenant_id: "t1", badge_id: w.bid,
          lavoratore_id: w.lid, cantiere_id: w.cid, tipo: "uscita",
          timestamp: ts(exitHour, exitMin),
          latitudine: 45.4642 + Math.random() * 0.001,
          longitudine: 9.19 + Math.random() * 0.001,
          metodo: Math.random() > 0.3 ? "qr_scan" : "manuale",
          preposto_id: "l1", esito: "autorizzato", motivo_blocco: null,
          created_at: ts(exitHour, exitMin),
        });
      }
    }
  }
  return result;
}

export const mockTimbrature = generateTimbrature();

export const mockVerificheAccesso: VerificaAccesso[] = [
  {
    id: "va1", tenant_id: "t1", badge_id: "b1", lavoratore_id: "l1", cantiere_id: "c1",
    timestamp: "2026-03-10T07:30:00",
    stato_documenti: "ok", stato_formazione: "ok", stato_idoneita_sanitaria: "ok",
    esito_finale: "verde", dettaglio: {},
  },
  {
    id: "va2", tenant_id: "t1", badge_id: "b2", lavoratore_id: "l2", cantiere_id: "c1",
    timestamp: "2026-03-10T07:45:00",
    stato_documenti: "ok", stato_formazione: "ok", stato_idoneita_sanitaria: "warning",
    esito_finale: "giallo", dettaglio: { nota: "Idoneità sanitaria in scadenza tra 10 giorni" },
  },
  {
    id: "va3", tenant_id: "t1", badge_id: "b4", lavoratore_id: "l4", cantiere_id: "c2",
    timestamp: "2026-03-06T08:15:00",
    stato_documenti: "bloccato", stato_formazione: "ok", stato_idoneita_sanitaria: "ok",
    esito_finale: "rosso", dettaglio: { nota: "Attestato sicurezza scaduto" },
  },
];

// Helper to get lavoratore info for a badge
export function getBadgeLavoratore(badge: Badge) {
  return mockLavoratori.find((l) => l.id === badge.lavoratore_id);
}

export function getBadgeCantiere(badge: Badge) {
  return mockCantieri.find((c) => c.id === badge.cantiere_id);
}

// Get timbrature for a specific badge
export function getTimbratureForBadge(badgeId: string) {
  return mockTimbrature.filter((t) => t.badge_id === badgeId);
}

// Count workers currently on-site (have entrata today without uscita)
export function getPresentiOra(cantiereId?: string) {
  const today = "2026-03-10";
  const todayTimbrature = mockTimbrature.filter(
    (t) => t.timestamp.startsWith(today) && (!cantiereId || t.cantiere_id === cantiereId)
  );

  const workerStatus = new Map<string, string>();
  for (const t of todayTimbrature.sort((a, b) => a.timestamp.localeCompare(b.timestamp))) {
    workerStatus.set(t.lavoratore_id, t.tipo);
  }

  let count = 0;
  workerStatus.forEach((tipo) => {
    if (tipo === "entrata") count++;
  });
  return count;
}
