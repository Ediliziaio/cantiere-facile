import { mockTimbrature, type Timbratura } from "./mock-badges";
import { mockScadenze, mockCantieri, mockLavoratori } from "./mock-data";

export interface CalendarPresenza {
  lavoratore_id: string;
  lavoratore_nome: string;
  cantiere_id: string;
  cantiere_nome: string;
  entrata: string | null;
  uscita: string | null;
  esito: "autorizzato" | "warning" | "bloccato";
  motivo?: string | null;
}

export interface CalendarScadenza {
  id: string;
  categoria: string;
  cantiere: string;
  stato: string;
  nome_file: string;
}

export interface CalendarDayData {
  presenze: CalendarPresenza[];
  scadenze: CalendarScadenza[];
  cantieriAttivi: { id: string; nome: string; presentiCount: number }[];
  worstStatus: "ok" | "warning" | "danger";
}

function formatDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function buildCalendarData(filterCantiereId?: string): Map<string, CalendarDayData> {
  const map = new Map<string, CalendarDayData>();

  const getOrCreate = (key: string): CalendarDayData => {
    if (!map.has(key)) {
      map.set(key, { presenze: [], scadenze: [], cantieriAttivi: [], worstStatus: "ok" });
    }
    return map.get(key)!;
  };

  // Group timbrature by day + lavoratore
  const timbByDayWorker = new Map<string, Timbratura[]>();
  for (const t of mockTimbrature) {
    if (filterCantiereId && t.cantiere_id !== filterCantiereId) continue;
    const dateKey = t.timestamp.substring(0, 10);
    const key = `${dateKey}|${t.lavoratore_id}|${t.cantiere_id}`;
    if (!timbByDayWorker.has(key)) timbByDayWorker.set(key, []);
    timbByDayWorker.get(key)!.push(t);
  }

  for (const [key, timbs] of timbByDayWorker) {
    const [dateKey, lavId, cantId] = key.split("|");
    const day = getOrCreate(dateKey);
    const lav = mockLavoratori.find((l) => l.id === lavId);
    const cant = mockCantieri.find((c) => c.id === cantId);
    const entrata = timbs.find((t) => t.tipo === "entrata");
    const uscita = timbs.find((t) => t.tipo === "uscita");
    const worstEsito = timbs.some((t) => t.esito === "bloccato")
      ? "bloccato"
      : timbs.some((t) => t.esito === "warning")
        ? "warning"
        : "autorizzato";

    day.presenze.push({
      lavoratore_id: lavId,
      lavoratore_nome: lav ? `${lav.nome} ${lav.cognome}` : lavId,
      cantiere_id: cantId,
      cantiere_nome: cant?.nome || cantId,
      entrata: entrata?.timestamp || null,
      uscita: uscita?.timestamp || null,
      esito: worstEsito as "autorizzato" | "warning" | "bloccato",
      motivo: timbs.find((t) => t.motivo_blocco)?.motivo_blocco,
    });

    if (worstEsito === "bloccato") day.worstStatus = "danger";
    else if (worstEsito === "warning" && day.worstStatus !== "danger") day.worstStatus = "warning";
  }

  // Scadenze
  for (const s of mockScadenze) {
    if (filterCantiereId && !mockCantieri.find((c) => c.nome === s.cantiere && c.id === filterCantiereId)) {
      if (filterCantiereId) continue;
    }
    const dateKey = s.data_scadenza;
    const day = getOrCreate(dateKey);
    day.scadenze.push({
      id: s.id,
      categoria: s.categoria,
      cantiere: s.cantiere,
      stato: s.stato,
      nome_file: s.nome_file,
    });
    if (s.stato === "scaduto") day.worstStatus = "danger";
    else if (s.stato === "in_scadenza" && day.worstStatus !== "danger") day.worstStatus = "warning";
  }

  // Build cantieriAttivi per day
  for (const [dateKey, day] of map) {
    const cantMap = new Map<string, { nome: string; count: number }>();
    for (const p of day.presenze) {
      const existing = cantMap.get(p.cantiere_id);
      if (existing) existing.count++;
      else cantMap.set(p.cantiere_id, { nome: p.cantiere_nome, count: 1 });
    }
    day.cantieriAttivi = Array.from(cantMap.entries()).map(([id, v]) => ({
      id,
      nome: v.nome,
      presentiCount: v.count,
    }));
  }

  return map;
}
