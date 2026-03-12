// Mock data for Safety Module — D.Lgs 81/2008

export type SafetyPlanStatus = 'draft' | 'approved' | 'suspended';
export type AccidentSeverity = 'minor' | 'serious' | 'fatal' | 'near_miss';
export type AccidentType = 'caduta_da_altezza' | 'investimento_mezzo' | 'schiacciamento' | 'folgorazione' | 'taglio' | 'ustione' | 'altro';
export type InspectionType = 'periodica' | 'straordinaria' | 'accessoria';
export type ChecklistItemStatus = 'ok' | 'ko' | 'na';
export type NotificationAuthority = 'inail' | 'asl' | 'prefettura';
export type NotificationStatus = 'da_inviare' | 'inviata' | 'scaduta';
export type CoordinatorRole = 'csp' | 'cse';

export interface RiskAssessment {
  risk_type: string;
  probability: 1 | 2 | 3 | 4;
  severity: 1 | 2 | 3 | 4;
  mitigation_measures: string;
}

export interface EmergencyProcedures {
  assembly_point: string;
  escape_routes: string[];
  emergency_contacts: { name: string; role: string; phone: string }[];
}

export interface DPIRequirement {
  type: string;
  required_quantity: number;
  provided_date: string;
}

export interface TrainingRequirement {
  topic: string;
  hours: number;
  worker_ids: string[];
  completion_date: string | null;
}

export interface SafetyPlanContent {
  valutazione_rischi: RiskAssessment[];
  procedure_emergenza: EmergencyProcedures;
  dispositivi_protezione: DPIRequirement[];
  formazione_obbligatoria: TrainingRequirement[];
}

export interface SafetyPlan {
  id: string;
  site_id: string;
  version_number: number;
  coordinator_csp_id: string;
  coordinator_cse_id: string;
  status: SafetyPlanStatus;
  approval_date: string | null;
  expiry_date: string;
  created_at: string;
  content: SafetyPlanContent;
}

export interface CorrectiveAction {
  action: string;
  responsible_id: string;
  deadline: string;
  completed_date: string | null;
  verified_by: string | null;
}

export interface Accident {
  id: string;
  site_id: string;
  injured_worker_id: string;
  accident_date: string;
  accident_time: string;
  location_precise: string;
  severity: AccidentSeverity;
  accident_type: AccidentType;
  activity_at_time: string;
  machines_involved: string[];
  dpi_status: 'indossati_correttamente' | 'indossati_parzialmente' | 'non_indossati';
  description_detailed: string;
  immediate_causes: string;
  root_cause_analysis: string[];
  witnesses_worker_ids: string[];
  photos_urls: string[];
  days_absence: number;
  permanent_disability_percentage: number | null;
  corrective_actions: CorrectiveAction[];
  inail_notification_number: string | null;
  notification_date: string | null;
  asl_notification_protocol: string | null;
  created_at: string;
  created_by: string;
  is_rectified: boolean;
  rectification_reason: string | null;
}

export interface ChecklistItem {
  id: string;
  category: string;
  description: string;
  status: ChecklistItemStatus;
  note: string;
  photo_url: string | null;
}

export interface SafetyInspection {
  id: string;
  site_id: string;
  inspector_user_id: string;
  inspection_date: string;
  type: InspectionType;
  checklist_items: ChecklistItem[];
  overall_score: number;
  signed_by_foreman: boolean;
  signed_by_coordinator: boolean;
  next_inspection_date: string;
  notes: string;
}

export interface PendingNotification {
  id: string;
  accident_id: string;
  authority_type: NotificationAuthority;
  deadline_date: string;
  sent_date: string | null;
  protocol_number: string | null;
  status: NotificationStatus;
}

export interface Coordinator {
  id: string;
  user_id: string;
  name: string;
  role: CoordinatorRole;
  registration_number: string;
  specializations: string[];
  available: boolean;
  max_concurrent_sites: number;
  current_sites_count: number;
  phone: string;
  email: string;
}

// ─── MOCK COORDINATORS ───
export const mockCoordinators: Coordinator[] = [
  {
    id: 'coord1', user_id: 'u10', name: 'Ing. Anna Ferretti',
    role: 'csp', registration_number: 'CSP-MI-2024-0142',
    specializations: ['lavori_in_quota', 'demolizioni', 'scavi'],
    available: true, max_concurrent_sites: 5, current_sites_count: 2,
    phone: '+39 333 1112233', email: 'ferretti@sicurezzaedile.it',
  },
  {
    id: 'coord2', user_id: 'u11', name: 'Ing. Paolo Martini',
    role: 'cse', registration_number: 'CSE-MI-2023-0089',
    specializations: ['impianti_elettrici', 'lavori_confinati'],
    available: true, max_concurrent_sites: 4, current_sites_count: 3,
    phone: '+39 333 4445566', email: 'martini@safecantiere.it',
  },
];

// ─── MOCK SAFETY PLANS ───
export const mockSafetyPlans: SafetyPlan[] = [
  {
    id: 'sp1', site_id: 'c1', version_number: 2,
    coordinator_csp_id: 'coord1', coordinator_cse_id: 'coord2',
    status: 'approved', approval_date: '2025-09-15', expiry_date: '2026-09-15',
    created_at: '2025-09-01',
    content: {
      valutazione_rischi: [
        { risk_type: 'Caduta dall\'alto', probability: 3, severity: 4, mitigation_measures: 'Parapetti h.100cm, imbracature, reti di sicurezza' },
        { risk_type: 'Schiacciamento da mezzi', probability: 2, severity: 4, mitigation_measures: 'Zone delimitate, segnaletica, operatori formati' },
        { risk_type: 'Folgorazione', probability: 2, severity: 3, mitigation_measures: 'Quadri IP44, cavi protetti, interruttori differenziali' },
        { risk_type: 'Rumore', probability: 3, severity: 2, mitigation_measures: 'DPI otoprotettori, turnazione lavorazioni rumorose' },
      ],
      procedure_emergenza: {
        assembly_point: 'Piazzale parcheggio fronte ingresso cantiere',
        escape_routes: ['Uscita principale Via Roma', 'Uscita secondaria lato cortile'],
        emergency_contacts: [
          { name: 'Marco Rossi', role: 'Capocantiere', phone: '+39 02 1234567' },
          { name: 'AREU 118', role: 'Emergenza sanitaria', phone: '118' },
          { name: 'VV.FF.', role: 'Vigili del Fuoco', phone: '115' },
        ],
      },
      dispositivi_protezione: [
        { type: 'Elmetto protettivo', required_quantity: 25, provided_date: '2025-09-01' },
        { type: 'Scarpe antinfortunistiche S3', required_quantity: 25, provided_date: '2025-09-01' },
        { type: 'Imbracatura anticaduta', required_quantity: 10, provided_date: '2025-09-01' },
        { type: 'Guanti antitaglio', required_quantity: 30, provided_date: '2025-09-01' },
        { type: 'Otoprotettori', required_quantity: 20, provided_date: '2025-09-05' },
      ],
      formazione_obbligatoria: [
        { topic: 'Corso base sicurezza 81/08', hours: 16, worker_ids: ['l1','l2','l3','l4','l5'], completion_date: '2025-09-10' },
        { topic: 'Lavori in quota', hours: 8, worker_ids: ['l1','l3','l5'], completion_date: '2025-09-12' },
        { topic: 'Primo soccorso', hours: 12, worker_ids: ['l1','l4'], completion_date: '2025-06-15' },
      ],
    },
  },
  {
    id: 'sp2', site_id: 'c2', version_number: 1,
    coordinator_csp_id: 'coord1', coordinator_cse_id: 'coord2',
    status: 'draft', approval_date: null, expiry_date: '2027-01-15',
    created_at: '2026-01-10',
    content: {
      valutazione_rischi: [
        { risk_type: 'Caduta dall\'alto', probability: 2, severity: 4, mitigation_measures: 'Ponteggio certificato, parapetti' },
        { risk_type: 'Polveri e fibre', probability: 3, severity: 3, mitigation_measures: 'Mascherine FFP2, aspirazione localizzata' },
      ],
      procedure_emergenza: {
        assembly_point: 'Parcheggio Via Dante',
        escape_routes: ['Ingresso principale Via Dante 5'],
        emergency_contacts: [
          { name: 'Luca Verdi', role: 'Preposto', phone: '+39 035 9876543' },
          { name: 'AREU 118', role: 'Emergenza sanitaria', phone: '118' },
        ],
      },
      dispositivi_protezione: [
        { type: 'Elmetto protettivo', required_quantity: 15, provided_date: '2026-01-15' },
        { type: 'Mascherine FFP2', required_quantity: 200, provided_date: '2026-01-15' },
      ],
      formazione_obbligatoria: [
        { topic: 'Corso base sicurezza 81/08', hours: 16, worker_ids: ['l3','l5','l6'], completion_date: null },
      ],
    },
  },
];

// ─── MOCK ACCIDENTS ───
export const mockAccidents: Accident[] = [
  {
    id: 'acc1', site_id: 'c1', injured_worker_id: 'l3',
    accident_date: '2026-02-10', accident_time: '10:35',
    location_precise: 'Piano 3, zona ponteggio nord-est',
    severity: 'serious', accident_type: 'caduta_da_altezza',
    activity_at_time: 'Posa travetti solaio terzo piano',
    machines_involved: ['Gru a torre GT-01'],
    dpi_status: 'indossati_parzialmente',
    description_detailed: 'L\'operaio stava posizionando travetti sul solaio del terzo piano quando ha perso l\'equilibrio scivolando su una superficie bagnata. La caduta è stata arrestata dalla rete di sicurezza sottostante ma ha riportato frattura al polso destro.',
    immediate_causes: 'Superficie bagnata per pioggia notturna, assenza di calzature antiscivolo adeguate',
    root_cause_analysis: [
      'Perché è caduto? → Superficie bagnata',
      'Perché la superficie era bagnata? → Pioggia notturna non verificata prima dell\'inizio lavori',
      'Perché non è stata verificata? → Mancanza procedura controllo pre-turno condizioni meteo',
      'Perché manca la procedura? → Non prevista nel POS attuale',
      'Azione root: Aggiornare POS con procedura controllo meteo pre-turno obbligatoria',
    ],
    witnesses_worker_ids: ['l1', 'l4'],
    photos_urls: [],
    days_absence: 28,
    permanent_disability_percentage: null,
    corrective_actions: [
      { action: 'Aggiornamento POS con procedura controllo condizioni meteo', responsible_id: 'coord1', deadline: '2026-02-20', completed_date: '2026-02-18', verified_by: 'coord2' },
      { action: 'Distribuzione calzature antiscivolo categoria S3 a tutti gli operai', responsible_id: 'l1', deadline: '2026-02-15', completed_date: '2026-02-14', verified_by: 'l1' },
      { action: 'Formazione specifica rischio scivolamento', responsible_id: 'coord2', deadline: '2026-03-01', completed_date: null, verified_by: null },
    ],
    inail_notification_number: 'INAIL-2026-MI-004521',
    notification_date: '2026-02-11',
    asl_notification_protocol: 'ASL-MI-2026-0892',
    created_at: '2026-02-10T11:20:00Z', created_by: 'u1',
    is_rectified: false, rectification_reason: null,
  },
  {
    id: 'acc2', site_id: 'c1', injured_worker_id: 'l5',
    accident_date: '2026-03-05', accident_time: '14:10',
    location_precise: 'Area stoccaggio materiali, piano terra',
    severity: 'near_miss', accident_type: 'schiacciamento',
    activity_at_time: 'Scarico materiale da autocarro',
    machines_involved: ['Autocarro Iveco Daily'],
    dpi_status: 'indossati_correttamente',
    description_detailed: 'Durante lo scarico di bancali dal camion, un bancale si è inclinato scivolando verso l\'operaio. L\'operaio è riuscito a spostarsi evitando lo schiacciamento. Nessun contatto fisico.',
    immediate_causes: 'Bancale non correttamente fissato con cinghie, area di scarico in pendenza',
    root_cause_analysis: [
      'Perché il bancale è scivolato? → Non fissato adeguatamente',
      'Perché non era fissato? → Procedura di carico non rispettata dal fornitore',
      'Azione: Verifica obbligatoria fissaggio prima dello scarico',
    ],
    witnesses_worker_ids: ['l4'],
    photos_urls: [],
    days_absence: 0,
    permanent_disability_percentage: null,
    corrective_actions: [
      { action: 'Livellamento area scarico merci', responsible_id: 'l1', deadline: '2026-03-15', completed_date: '2026-03-12', verified_by: 'coord2' },
    ],
    inail_notification_number: null,
    notification_date: null,
    asl_notification_protocol: null,
    created_at: '2026-03-05T15:00:00Z', created_by: 'u1',
    is_rectified: false, rectification_reason: null,
  },
  {
    id: 'acc3', site_id: 'c2', injured_worker_id: 'l6',
    accident_date: '2026-01-28', accident_time: '09:15',
    location_precise: 'Locale caldaia, piano interrato',
    severity: 'minor', accident_type: 'taglio',
    activity_at_time: 'Rimozione tubazioni vecchio impianto',
    machines_involved: [],
    dpi_status: 'indossati_correttamente',
    description_detailed: 'Taglio superficiale alla mano sinistra durante la rimozione di una tubazione arrugginita. Medicazione con kit primo soccorso in cantiere.',
    immediate_causes: 'Bordo tagliente tubazione non protetto',
    root_cause_analysis: ['Causa diretta: bordo tagliente esposto'],
    witnesses_worker_ids: [],
    photos_urls: [],
    days_absence: 0,
    permanent_disability_percentage: null,
    corrective_actions: [],
    inail_notification_number: null,
    notification_date: null,
    asl_notification_protocol: null,
    created_at: '2026-01-28T10:00:00Z', created_by: 'u1',
    is_rectified: false, rectification_reason: null,
  },
];

// ─── MOCK INSPECTIONS ───
const checklistCategories = [
  { cat: 'Impalcature', items: ['Stabilità ancoraggi', 'Parapetti integri h≥100cm', 'Piedini di base regolari', 'Tavole di camminamento fissate'] },
  { cat: 'Ponteggi', items: ['Tavellature complete', 'Passaggi sicuri', 'Montanti verticali integri', 'Targa di conformità visibile'] },
  { cat: 'Mezzi di sollevamento', items: ['Freni funzionanti', 'Segnalatore acustico', 'Libretto verifiche aggiornato', 'Operatore formato'] },
  { cat: 'Impianto elettrico', items: ['Quadri IP44 chiusi', 'Cavi non danneggiati', 'Interruttori differenziali', 'Messa a terra verificata'] },
  { cat: 'Movimento terra', items: ['Scavi con parapetti/batterie', 'Segnaletica delimitazione', 'Verifica sottoservizi'] },
  { cat: 'DPI', items: ['Elmetti distribuiti e indossati', 'Scarpe antinfortunistiche S3', 'Imbracature verificate', 'Guanti disponibili'] },
];

function generateChecklistItems(seed: number): ChecklistItem[] {
  const items: ChecklistItem[] = [];
  let idx = 0;
  for (const cat of checklistCategories) {
    for (const desc of cat.items) {
      const statuses: ChecklistItemStatus[] = ['ok', 'ok', 'ok', 'ko', 'na'];
      items.push({
        id: `cli-${seed}-${idx}`,
        category: cat.cat,
        description: desc,
        status: statuses[(idx + seed) % statuses.length],
        note: statuses[(idx + seed) % statuses.length] === 'ko' ? 'Da sistemare entro prossima ispezione' : '',
        photo_url: null,
      });
      idx++;
    }
  }
  return items;
}

export const mockInspections: SafetyInspection[] = [
  {
    id: 'insp1', site_id: 'c1', inspector_user_id: 'coord2',
    inspection_date: '2026-03-01', type: 'periodica',
    checklist_items: generateChecklistItems(1),
    overall_score: 87, signed_by_foreman: true, signed_by_coordinator: true,
    next_inspection_date: '2026-04-01', notes: 'Cantiere in buono stato. Segnalate 3 non conformità minori.',
  },
  {
    id: 'insp2', site_id: 'c1', inspector_user_id: 'coord2',
    inspection_date: '2026-02-01', type: 'periodica',
    checklist_items: generateChecklistItems(2),
    overall_score: 78, signed_by_foreman: true, signed_by_coordinator: true,
    next_inspection_date: '2026-03-01', notes: 'Riscontrate 5 non conformità, di cui 2 da risolvere con urgenza.',
  },
  {
    id: 'insp3', site_id: 'c1', inspector_user_id: 'coord2',
    inspection_date: '2026-02-12', type: 'straordinaria',
    checklist_items: generateChecklistItems(3),
    overall_score: 92, signed_by_foreman: true, signed_by_coordinator: true,
    next_inspection_date: '2026-03-01', notes: 'Ispezione straordinaria post-infortunio acc1. Misure correttive verificate.',
  },
  {
    id: 'insp4', site_id: 'c2', inspector_user_id: 'coord1',
    inspection_date: '2026-02-15', type: 'periodica',
    checklist_items: generateChecklistItems(4),
    overall_score: 82, signed_by_foreman: true, signed_by_coordinator: false,
    next_inspection_date: '2026-03-15', notes: 'POS in stato bozza — da approvare prima della prossima ispezione.',
  },
];

// ─── MOCK PENDING NOTIFICATIONS ───
export const mockPendingNotifications: PendingNotification[] = [
  {
    id: 'notif1', accident_id: 'acc1', authority_type: 'inail',
    deadline_date: '2026-02-12T10:35:00Z', sent_date: '2026-02-11', protocol_number: 'INAIL-2026-MI-004521',
    status: 'inviata',
  },
  {
    id: 'notif2', accident_id: 'acc1', authority_type: 'asl',
    deadline_date: '2026-02-12T10:35:00Z', sent_date: '2026-02-11', protocol_number: 'ASL-MI-2026-0892',
    status: 'inviata',
  },
];

// ─── CHECKLIST TEMPLATE (for new inspections) ───
export const checklistTemplate = checklistCategories;

// ─── LABELS ───
export const severityLabels: Record<AccidentSeverity, string> = {
  minor: 'Lieve (primo soccorso)',
  serious: 'Grave (>3gg inabilità)',
  fatal: 'Mortale',
  near_miss: 'Quasi infortunio',
};

export const accidentTypeLabels: Record<AccidentType, string> = {
  caduta_da_altezza: 'Caduta dall\'alto',
  investimento_mezzo: 'Investimento da mezzo',
  schiacciamento: 'Schiacciamento',
  folgorazione: 'Folgorazione',
  taglio: 'Taglio/Lacerazione',
  ustione: 'Ustione',
  altro: 'Altro',
};

export const dpiStatusLabels: Record<string, string> = {
  indossati_correttamente: 'Indossati correttamente',
  indossati_parzialmente: 'Indossati parzialmente',
  non_indossati: 'Non indossati',
};
