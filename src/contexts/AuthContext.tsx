import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { permissionMatrix, type SuperAdminRole } from "@/data/mock-security";

export type UserRole = "superadmin" | "admin" | "manager" | "utente";

interface AuthUser {
  id: string;
  email: string;
  nome: string;
  cognome: string;
}

interface ImpersonationState {
  isImpersonating: boolean;
  tenantId: string | null;
  tenantName: string | null;
  impersonatedRole: UserRole | null;
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  effectiveRole: UserRole | null;
  superadminRole: SuperAdminRole | null;
  tenantId: string | null;
  tenantName: string | null;
  impersonation: ImpersonationState;
  login: (user: AuthUser, role: UserRole, tenantId: string | null, tenantName: string | null, saRole?: SuperAdminRole) => void;
  logout: () => void;
  startImpersonation: (tenantId: string, tenantName: string, role: UserRole) => void;
  stopImpersonation: () => void;
  activeTenantId: string | null;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [superadminRole, setSuperadminRole] = useState<SuperAdminRole | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [tenantName, setTenantName] = useState<string | null>(null);
  const [impersonation, setImpersonation] = useState<ImpersonationState>({
    isImpersonating: false,
    tenantId: null,
    tenantName: null,
    impersonatedRole: null,
  });

  const login = useCallback((user: AuthUser, role: UserRole, tid: string | null, tname: string | null, saRole?: SuperAdminRole) => {
    setUser(user);
    setRole(role);
    setTenantId(tid);
    setTenantName(tname);
    setSuperadminRole(saRole ?? null);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setRole(null);
    setSuperadminRole(null);
    setTenantId(null);
    setTenantName(null);
    setImpersonation({ isImpersonating: false, tenantId: null, tenantName: null, impersonatedRole: null });
  }, []);

  const startImpersonation = useCallback((tid: string, tname: string) => {
    setImpersonation({ isImpersonating: true, tenantId: tid, tenantName: tname });
  }, []);

  const stopImpersonation = useCallback(() => {
    setImpersonation({ isImpersonating: false, tenantId: null, tenantName: null });
  }, []);

  const hasPermission = useCallback((permission: string): boolean => {
    if (!superadminRole) return role === "superadmin";
    return permissionMatrix[superadminRole]?.includes(permission) ?? false;
  }, [superadminRole, role]);

  const activeTenantId = impersonation.isImpersonating ? impersonation.tenantId : tenantId;

  return (
    <AuthContext.Provider value={{
      user, role, superadminRole, tenantId, tenantName, impersonation,
      login, logout, startImpersonation, stopImpersonation,
      activeTenantId, hasPermission,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
