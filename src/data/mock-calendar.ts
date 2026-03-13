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

export interface CalendarAppuntamento {
  id: string;
  titolo: string;
  descrizione: string;
  data: string; // YYYY-MM-DD
  ora_inizio: string;
  ora_fine: string;
  cantiere_id?: string;
  cantiere_nome?: string;
  indirizzo?: string;
  assegnato_a: { id: string; nome: string }[];
  colore: "blue" | "purple" | "teal" | "rose";
}

export interface CalendarDayData {
  presenze: CalendarPresenza[];
  scadenze: CalendarScadenza[];
  appuntamenti: CalendarAppuntamento[];
  cantieriAttivi: { id: string; nome: string; presentiCount: number }[];
  worstStatus: "ok" | "warning" | "danger";
}

export const mockAppuntamenti: CalendarAppuntamento[] = [
  {
    id: "app-1",
    titolo: "Sopralluogo tecnico",
    descrizione: "Verifica avanzamento fondamenta",
    data: "2026-03-10",
    ora_inizio: "09:00",
    ora_fine: "11:00",
    cantiere_id: "c1",
    cantiere_nome: "Residenziale Via Roma 12",
    indirizzo: "Via Roma 12, Milano",
    assegnato_a: [
      { id: "l1", nome: "Marco Rossi" },
      { id: "l2", nome: "Giuseppe Bianchi" },
    ],
    colore: "blue",
  },
  {
    id: "app-2",
    titolo: "Riunione sicurezza",
    descrizione: "Briefing settimanale sulla sicurezza cantiere",
    data: "2026-03-12",
    ora_inizio: "14:00",
    ora_fine: "15:30",
    cantiere_id: "c2",
    cantiere_nome: "Ristrutturazione Palazzina",
    indirizzo: "Via Dante 5, Bergamo",
    assegnato_a: [
      { id: "l3", nome: "Antonio Verdi" },
      { id: "l1", nome: "Marco Rossi" },
    ],
    colore: "purple",
  },
  {
    id: "app-3",
    titolo: "Consegna materiali",
    descrizione: "Arrivo cemento e acciaio per gettata",
    data: "2026-03-15",
    ora_inizio: "07:30",
    ora_fine: "09:00",
    cantiere_id: "c1",
    cantiere_nome: "Residenziale Via Roma 12",
    indirizzo: "Via Roma 12, Milano",
    assegnato_a: [{ id: "l4", nome: "Luigi Neri" }],
    colore: "teal",
  },
  {
    id: "app-4",
    titolo: "Incontro con committente",
    descrizione: "Presentazione stato avanzamento lavori",
    data: "2026-03-18",
    ora_inizio: "10:00",
    ora_fine: "12:00",
    indirizzo: "Via Montenapoleone 8, Milano",
    assegnato_a: [
      { id: "l1", nome: "Marco Rossi" },
      { id: "l5", nome: "Francesco Esposito" },
    ],
    colore: "rose",
  },
  {
    id: "app-5",
    titolo: "Ispezione ASL",
    descrizione: "Controllo documentazione e sicurezza",
    data: "2026-03-20",
    ora_inizio: "09:00",
    ora_fine: "13:00",
    cantiere_id: "c2",
    cantiere_nome: "Ristrutturazione Palazzina",
    indirizzo: "Via Dante 5, Bergamo",
    assegnato_a: [
      { id: "l3", nome: "Antonio Verdi" },
      { id: "l2", nome: "Giuseppe Bianchi" },
    ],
    colore: "blue",
  },
  {
    id: "app-6",
    titolo: "Formazione nuovi operai",
    descrizione: "Corso sicurezza base per nuovi ingressi",
    data: "2026-03-10",
    ora_inizio: "14:00",
    ora_fine: "17:00",
    cantiere_id: "c1",
    cantiere_nome: "Residenziale Via Roma 12",
    indirizzo: "Via Roma 12, Milano",
    assegnato_a: [{ id: "l4", nome: "Luigi Neri" }, { id: "l6", nome: "Paolo Ricci" }],
    colore: "purple",
  },
];

function formatDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function buildCalendarData(
  filterCantiereId?: string,
  extraAppuntamenti: CalendarAppuntamento[] = []
): Map<string, CalendarDayData> {
  const map = new Map<string, CalendarDayData>();

  const getOrCreate = (key: string): CalendarDayData => {
    if (!map.has(key)) {
      map.set(key, { presenze: [], scadenze: [], appuntamenti: [], cantieriAttivi: [], worstStatus: "ok" });
    }
    return map.get(key)!;
  };

  // Group timbrature by day + lavoratore
  const timbByDayWorker = new Map<string, Timbratura[]>();
  for (const t of mockTimbrature) {
    if (filterCantiereId && t.cantiere_id !== filterCantiereId) continue;
    // Skip pause entries for calendar presence calculation
    if (t.tipo === "pausa_inizio" || t.tipo === "pausa_fine") continue;
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

  // Appuntamenti (mock + extra)
  const allAppuntamenti = [...mockAppuntamenti, ...extraAppuntamenti];
  for (const app of allAppuntamenti) {
    if (filterCantiereId && app.cantiere_id && app.cantiere_id !== filterCantiereId) continue;
    if (filterCantiereId && !app.cantiere_id) continue; // skip generic appointments when filtering by site
    const day = getOrCreate(app.data);
    day.appuntamenti.push(app);
  }

  // Build cantieriAttivi per day
  for (const [, day] of map) {
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
