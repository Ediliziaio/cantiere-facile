export type SuperAdminRole = "superadmin" | "superadmin_readonly" | "support_agent" | "finance_admin";

export interface SuperAdminUser {
  id: string;
  email: string;
  full_name: string;
  role: SuperAdminRole;
  is_active: boolean;
  totp_enabled: boolean;
  last_login_at: string | null;
  failed_login_attempts: number;
  locked_until: string | null;
  created_at: string;
  phone: string;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  actor_id: string;
  actor_name: string;
  action: string;
  resource_type: string;
  resource_id: string;
  tenant_id: string | null;
  tenant_name: string | null;
  changes: { old_val?: string; new_val?: string } | null;
  ip_address: string;
  user_agent: string;
  session_id: string;
  severity: "info" | "warning" | "critical";
  hash_chain: string;
}

export interface SecurityAlert {
  id: string;
  type: "impossible_travel" | "mass_export" | "off_hours" | "unauthorized_access";
  severity: "warning" | "critical";
  description: string;
  actor_id: string;
  actor_name: string;
  timestamp: string;
  resolved: boolean;
  resolved_at: string | null;
}

export const permissionMatrix: Record<SuperAdminRole, string[]> = {
  superadmin: [
    "tenants.view", "tenants.create", "tenants.edit", "tenants.delete", "tenants.suspend",
    "billing.view", "billing.manage", "billing.refund",
    "tickets.view", "tickets.manage", "tickets.assign",
    "analytics.view", "analytics.export",
    "audit.view", "audit.export",
    "settings.view", "settings.edit",
    "superadmin_users.view", "superadmin_users.manage",
    "impersonation.start",
    "kb.view", "kb.edit",
    "alerts.view", "alerts.manage",
  ],
  superadmin_readonly: [
    "tenants.view",
    "billing.view",
    "tickets.view",
    "analytics.view",
    "audit.view", "audit.export",
    "settings.view",
    "superadmin_users.view",
    "kb.view",
    "alerts.view",
  ],
  support_agent: [
    "tenants.view",
    "tickets.view", "tickets.manage", "tickets.assign",
    "impersonation.start",
    "kb.view", "kb.edit",
    "alerts.view",
  ],
  finance_admin: [
    "tenants.view",
    "billing.view", "billing.manage", "billing.refund",
    "analytics.view",
    "audit.view",
    "alerts.view",
  ],
};

export const roleLabels: Record<SuperAdminRole, string> = {
  superadmin: "Super Admin",
  superadmin_readonly: "Readonly (Auditor)",
  support_agent: "Support Agent",
  finance_admin: "Finance Admin",
};

export const mockSuperAdminUsers: SuperAdminUser[] = [
  {
    id: "sa1",
    email: "admin@cantiereincloud.it",
    full_name: "Marco Ferretti",
    role: "superadmin",
    is_active: true,
    totp_enabled: true,
    last_login_at: "2026-03-12T08:30:00",
    failed_login_attempts: 0,
    locked_until: null,
    created_at: "2025-01-01T00:00:00",
    phone: "+39 335 1234567",
  },
  {
    id: "sa2",
    email: "auditor@cantiereincloud.it",
    full_name: "Laura Conti",
    role: "superadmin_readonly",
    is_active: true,
    totp_enabled: true,
    last_login_at: "2026-03-11T14:20:00",
    failed_login_attempts: 0,
    locked_until: null,
    created_at: "2025-03-15T00:00:00",
    phone: "+39 338 7654321",
  },
  {
    id: "sa3",
    email: "supporto@cantiereincloud.it",
    full_name: "Giuseppe Moretti",
    role: "support_agent",
    is_active: true,
    totp_enabled: true,
    last_login_at: "2026-03-12T09:00:00",
    failed_login_attempts: 1,
    locked_until: null,
    created_at: "2025-06-01T00:00:00",
    phone: "+39 340 1112233",
  },
  {
    id: "sa4",
    email: "finance@cantiereincloud.it",
    full_name: "Alessia Russo",
    role: "finance_admin",
    is_active: false,
    totp_enabled: false,
    last_login_at: "2026-02-28T11:00:00",
    failed_login_attempts: 0,
    locked_until: null,
    created_at: "2025-08-10T00:00:00",
    phone: "+39 342 4455667",
  },
];

export const mockBackupCodes = [
  "A3F7-K9M2", "B8D1-P4Q6", "C5H3-R7T9", "D2J6-S1V4", "E9L8-U3W7",
  "F4N1-X6Y2", "G7P5-Z8A3", "H1R9-B4C6", "I6S2-D7E5", "J3T4-F8G1",
];

export const mockSecurityAuditLogs: SecurityAuditLog[] = [
  {
    id: "sal1", timestamp: "2026-03-12T08:30:00", actor_id: "sa1", actor_name: "Marco Ferretti",
    action: "login_success", resource_type: "session", resource_id: "sess_a1b2c3",
    tenant_id: null, tenant_name: null, changes: null,
    ip_address: "93.42.115.12", user_agent: "Chrome/122 Windows", session_id: "sess_a1b2c3",
    severity: "info", hash_chain: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  },
  {
    id: "sal2", timestamp: "2026-03-12T08:25:00", actor_id: "sa3", actor_name: "Giuseppe Moretti",
    action: "login_failed", resource_type: "session", resource_id: "n/a",
    tenant_id: null, tenant_name: null, changes: { old_val: "attempts: 0", new_val: "attempts: 1" },
    ip_address: "185.22.33.44", user_agent: "Firefox/121 MacOS", session_id: "n/a",
    severity: "warning", hash_chain: "a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a",
  },
  {
    id: "sal3", timestamp: "2026-03-11T16:00:00", actor_id: "sa1", actor_name: "Marco Ferretti",
    action: "impersonation_start", resource_type: "tenant", resource_id: "t1",
    tenant_id: "t1", tenant_name: "Rossi Costruzioni S.r.l.", changes: null,
    ip_address: "93.42.115.12", user_agent: "Chrome/122 Windows", session_id: "sess_x4y5z6",
    severity: "warning", hash_chain: "d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35",
  },
  {
    id: "sal4", timestamp: "2026-03-11T16:15:00", actor_id: "sa1", actor_name: "Marco Ferretti",
    action: "impersonation_end", resource_type: "tenant", resource_id: "t1",
    tenant_id: "t1", tenant_name: "Rossi Costruzioni S.r.l.", changes: null,
    ip_address: "93.42.115.12", user_agent: "Chrome/122 Windows", session_id: "sess_x4y5z6",
    severity: "info", hash_chain: "4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce",
  },
  {
    id: "sal5", timestamp: "2026-03-11T10:00:00", actor_id: "sa1", actor_name: "Marco Ferretti",
    action: "tenant_suspended", resource_type: "tenant", resource_id: "t4",
    tenant_id: "t4", tenant_name: "Costruzioni Verdi S.r.l.", changes: { old_val: "attivo", new_val: "sospeso" },
    ip_address: "93.42.115.12", user_agent: "Chrome/122 Windows", session_id: "sess_a1b2c3",
    severity: "critical", hash_chain: "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b",
  },
  {
    id: "sal6", timestamp: "2026-03-10T14:30:00", actor_id: "sa1", actor_name: "Marco Ferretti",
    action: "export_data", resource_type: "tenant", resource_id: "t2",
    tenant_id: "t2", tenant_name: "Edilizia Moderna S.p.A.", changes: { old_val: "n/a", new_val: "full_export_json" },
    ip_address: "93.42.115.12", user_agent: "Chrome/122 Windows", session_id: "sess_a1b2c3",
    severity: "warning", hash_chain: "d4a1f3c4e5b6a7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e1",
  },
  {
    id: "sal7", timestamp: "2026-03-10T09:00:00", actor_id: "sa2", actor_name: "Laura Conti",
    action: "login_success", resource_type: "session", resource_id: "sess_d7e8f9",
    tenant_id: null, tenant_name: null, changes: null,
    ip_address: "79.18.44.100", user_agent: "Safari/17 MacOS", session_id: "sess_d7e8f9",
    severity: "info", hash_chain: "ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d",
  },
  {
    id: "sal8", timestamp: "2026-03-09T11:00:00", actor_id: "sa1", actor_name: "Marco Ferretti",
    action: "role_changed", resource_type: "superadmin_user", resource_id: "sa4",
    tenant_id: null, tenant_name: null, changes: { old_val: "support_agent", new_val: "finance_admin" },
    ip_address: "93.42.115.12", user_agent: "Chrome/122 Windows", session_id: "sess_a1b2c3",
    severity: "critical", hash_chain: "7902699be42c8a8e46fbbb4501726517e86b22c56a189f7625a6da49081b2451",
  },
  {
    id: "sal9", timestamp: "2026-03-08T22:45:00", actor_id: "sa3", actor_name: "Giuseppe Moretti",
    action: "ticket_resolved", resource_type: "ticket", resource_id: "tk-003",
    tenant_id: "t1", tenant_name: "Rossi Costruzioni S.r.l.", changes: { old_val: "open", new_val: "resolved" },
    ip_address: "185.22.33.44", user_agent: "Firefox/121 MacOS", session_id: "sess_g1h2i3",
    severity: "info", hash_chain: "2c624232cdd221771294dfbb310aca000a0df6ac8b166e8b32c4d8000f7199e8",
  },
  {
    id: "sal10", timestamp: "2026-03-07T03:15:00", actor_id: "sa3", actor_name: "Giuseppe Moretti",
    action: "login_success", resource_type: "session", resource_id: "sess_off1",
    tenant_id: null, tenant_name: null, changes: null,
    ip_address: "185.22.33.44", user_agent: "Firefox/121 MacOS", session_id: "sess_off1",
    severity: "warning", hash_chain: "19581e27de7ced00ff1ce50b2047e7a567c76b1cbaebabe5ef03f7c3017bb5b7",
  },
  {
    id: "sal11", timestamp: "2026-03-06T15:00:00", actor_id: "sa1", actor_name: "Marco Ferretti",
    action: "superadmin_created", resource_type: "superadmin_user", resource_id: "sa4",
    tenant_id: null, tenant_name: null, changes: { old_val: "n/a", new_val: "finance_admin created" },
    ip_address: "93.42.115.12", user_agent: "Chrome/122 Windows", session_id: "sess_a1b2c3",
    severity: "critical", hash_chain: "4fc82b26aecb47d2868c4efbe3581732a3e7cbcc6c2efb32062c08170a05eeb8",
  },
  {
    id: "sal12", timestamp: "2026-03-05T10:30:00", actor_id: "sa1", actor_name: "Marco Ferretti",
    action: "tenant_created", resource_type: "tenant", resource_id: "t3",
    tenant_id: "t3", tenant_name: "Fratelli Bianchi Edilizia", changes: { old_val: "n/a", new_val: "trial account" },
    ip_address: "93.42.115.12", user_agent: "Chrome/122 Windows", session_id: "sess_a1b2c3",
    severity: "info", hash_chain: "8a3542f3a4b3e8c4d5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8",
  },
];

export const mockSecurityAlerts: SecurityAlert[] = [
  {
    id: "alert1",
    type: "off_hours",
    severity: "warning",
    description: "Login da Giuseppe Moretti alle 03:15 — orario insolito (fuori fascia 09-18)",
    actor_id: "sa3",
    actor_name: "Giuseppe Moretti",
    timestamp: "2026-03-07T03:15:00",
    resolved: false,
    resolved_at: null,
  },
  {
    id: "alert2",
    type: "mass_export",
    severity: "critical",
    description: "Export massivo dati: 3 tenant esportati in 8 minuti da Marco Ferretti",
    actor_id: "sa1",
    actor_name: "Marco Ferretti",
    timestamp: "2026-03-10T14:30:00",
    resolved: true,
    resolved_at: "2026-03-10T15:00:00",
  },
  {
    id: "alert3",
    type: "impossible_travel",
    severity: "critical",
    description: "Tentativo login da IP cinese (118.24.xx.xx) 40 minuti dopo sessione italiana per sa1",
    actor_id: "sa1",
    actor_name: "Marco Ferretti",
    timestamp: "2026-03-11T09:10:00",
    resolved: false,
    resolved_at: null,
  },
];

export const mockActiveSessions = [
  { id: "sess_a1b2c3", user_id: "sa1", ip: "93.42.115.12", device: "Chrome/122 — Windows 11", started_at: "2026-03-12T08:30:00", last_activity: "2026-03-12T10:15:00" },
  { id: "sess_d7e8f9", user_id: "sa2", ip: "79.18.44.100", device: "Safari/17 — macOS Sonoma", started_at: "2026-03-10T09:00:00", last_activity: "2026-03-10T17:30:00" },
  { id: "sess_g1h2i3", user_id: "sa3", ip: "185.22.33.44", device: "Firefox/121 — macOS Ventura", started_at: "2026-03-12T09:00:00", last_activity: "2026-03-12T10:00:00" },
];
