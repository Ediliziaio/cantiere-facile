import type { ReactNode } from "react";
import { useAuth, type UserRole } from "@/contexts/AuthContext";
import { AccessDenied } from "./AccessDenied";

const roleHierarchy: Record<string, number> = {
  superadmin: 3,
  admin: 2,
  manager: 1,
  utente: 0,
};

interface ProtectedRouteProps {
  minRole: "admin" | "manager";
  children: ReactNode;
}

export function ProtectedRoute({ minRole, children }: ProtectedRouteProps) {
  const { effectiveRole } = useAuth();
  const currentLevel = roleHierarchy[effectiveRole ?? "admin"] ?? 2;
  const requiredLevel = roleHierarchy[minRole] ?? 2;

  if (currentLevel < requiredLevel) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}
