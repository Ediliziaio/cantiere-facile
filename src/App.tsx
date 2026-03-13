import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { UpdatePrompt } from "@/components/pwa/UpdatePrompt";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { Skeleton } from "@/components/ui/skeleton";

import { AppLayout } from "@/components/layout/AppLayout";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { SettingsLayout } from "@/components/layout/SettingsLayout";

// Lazy loaded pages
const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Cantieri = lazy(() => import("./pages/Cantieri"));
const CantiereDetail = lazy(() => import("./pages/CantiereDetail"));
const NuovoCantiere = lazy(() => import("./pages/NuovoCantiere"));
const Documenti = lazy(() => import("./pages/Documenti"));
const Scadenze = lazy(() => import("./pages/Scadenze"));
const Subappaltatori = lazy(() => import("./pages/Subappaltatori"));
const Lavoratori = lazy(() => import("./pages/Lavoratori"));
const LavoratoreDetail = lazy(() => import("./pages/LavoratoreDetail"));
const Mezzi = lazy(() => import("./pages/Mezzi"));
const MezzoDetail = lazy(() => import("./pages/MezzoDetail"));
const NuovoMezzo = lazy(() => import("./pages/NuovoMezzo"));
const Accessi = lazy(() => import("./pages/Accessi"));
const Comunicazioni = lazy(() => import("./pages/Comunicazioni"));
const BadgeList = lazy(() => import("./pages/BadgeList"));
const BadgeNuovo = lazy(() => import("./pages/BadgeNuovo"));
const BadgeDetail = lazy(() => import("./pages/BadgeDetail"));
const Timbrature = lazy(() => import("./pages/Timbrature"));
const Scan = lazy(() => import("./pages/Scan"));
const CheckIn = lazy(() => import("./pages/CheckIn"));
const VerificaBadge = lazy(() => import("./pages/VerificaBadge"));
const PortaleSubappaltatore = lazy(() => import("./pages/PortaleSubappaltatore"));
const FirmaDashboard = lazy(() => import("./pages/firma/FirmaDashboard"));
const FirmaNuovo = lazy(() => import("./pages/firma/FirmaNuovo"));
const FirmaDetail = lazy(() => import("./pages/firma/FirmaDetail"));
const FirmaConfigura = lazy(() => import("./pages/firma/FirmaConfigura"));
const FirmaFirmatari = lazy(() => import("./pages/firma/FirmaFirmatari"));
const FirmaAnteprima = lazy(() => import("./pages/firma/FirmaAnteprima"));
const FirmaPublica = lazy(() => import("./pages/firma/FirmaPublica"));
const FirmaCompletata = lazy(() => import("./pages/firma/FirmaCompletata"));
const FirmaRifiuta = lazy(() => import("./pages/firma/FirmaRifiuta"));
const VerificaDocumento = lazy(() => import("./pages/firma/VerificaDocumento"));
const FirmaTemplates = lazy(() => import("./pages/firma/FirmaTemplates"));
const CertificatoFirma = lazy(() => import("./pages/firma/CertificatoFirma"));
const SuperAdminLogin = lazy(() => import("./pages/superadmin/SuperAdminLogin"));
const SuperAdminDashboard = lazy(() => import("./pages/superadmin/SuperAdminDashboard"));
const SuperAdminAziende = lazy(() => import("./pages/superadmin/SuperAdminAziende"));
const SuperAdminAziendaDetail = lazy(() => import("./pages/superadmin/SuperAdminAziendaDetail"));
const SuperAdminNuovaAzienda = lazy(() => import("./pages/superadmin/SuperAdminNuovaAzienda"));
const SuperAdminAuditLog = lazy(() => import("./pages/superadmin/SuperAdminAuditLog"));
const SuperAdminImpostazioni = lazy(() => import("./pages/superadmin/SuperAdminImpostazioni"));
const NotFound = lazy(() => import("./pages/NotFound"));
const FunzionalitaDocumenti = lazy(() => import("./pages/funzionalita/Documenti"));
const FunzionalitaTesserini = lazy(() => import("./pages/funzionalita/Tesserini"));
const FunzionalitaAccessi = lazy(() => import("./pages/funzionalita/Accessi"));
const FunzionalitaFirma = lazy(() => import("./pages/funzionalita/Firma"));
const FunzionalitaComunicazioni = lazy(() => import("./pages/funzionalita/Comunicazioni"));
const FunzionalitaVeicoli = lazy(() => import("./pages/funzionalita/Veicoli"));
const ChiSiamo = lazy(() => import("./pages/ChiSiamo"));
const Tariffe = lazy(() => import("./pages/Tariffe"));
const FunzionalitaOverview = lazy(() => import("./pages/FunzionalitaOverview"));
const Sicurezza = lazy(() => import("./pages/Sicurezza"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Billing = lazy(() => import("./pages/Billing"));
const SuperAdminBilling = lazy(() => import("./pages/superadmin/SuperAdminBilling"));
const SuperAdminAnalytics = lazy(() => import("./pages/superadmin/SuperAdminAnalytics"));
const SuperAdminSupporto = lazy(() => import("./pages/superadmin/SuperAdminSupporto"));
const Supporto = lazy(() => import("./pages/Supporto"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));

// Settings sub-pages
const ImpostazioniProfilo = lazy(() => import("./pages/impostazioni/ImpostazioniProfilo"));
const ImpostazioniUtenti = lazy(() => import("./pages/impostazioni/ImpostazioniUtenti"));
const ImpostazioniLog = lazy(() => import("./pages/impostazioni/ImpostazioniLog"));
const ImpostazioniNotifiche = lazy(() => import("./pages/impostazioni/ImpostazioniNotifiche"));
const ImpostazioniPreferenze = lazy(() => import("./pages/impostazioni/ImpostazioniPreferenze"));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <UpdatePrompt />
        <InstallPrompt />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verifica/:codice" element={<VerificaBadge />} />
              <Route path="/scan" element={<Scan />} />
              <Route path="/portale/:token" element={<PortaleSubappaltatore />} />
              <Route path="/firma/:token" element={<FirmaPublica />} />
              <Route path="/firma/:token/completa" element={<FirmaCompletata />} />
              <Route path="/firma/:token/rifiuta" element={<FirmaRifiuta />} />
              <Route path="/verifica/:hash" element={<VerificaDocumento />} />
              <Route path="/verifica" element={<VerificaDocumento />} />
              <Route path="/chi-siamo" element={<ChiSiamo />} />
              <Route path="/tariffe" element={<Tariffe />} />
              <Route path="/funzionalita" element={<FunzionalitaOverview />} />
              <Route path="/funzionalita/documenti" element={<FunzionalitaDocumenti />} />
              <Route path="/funzionalita/tesserini" element={<FunzionalitaTesserini />} />
              <Route path="/funzionalita/accessi" element={<FunzionalitaAccessi />} />
              <Route path="/funzionalita/firma" element={<FunzionalitaFirma />} />
              <Route path="/funzionalita/comunicazioni" element={<FunzionalitaComunicazioni />} />
              <Route path="/funzionalita/veicoli" element={<FunzionalitaVeicoli />} />
              <Route path="/help-center" element={<HelpCenter />} />

              {/* SuperAdmin routes */}
              <Route path="/superadmin/login" element={<SuperAdminLogin />} />
              <Route path="/superadmin" element={<SuperAdminLayout />}>
                <Route path="dashboard" element={<SuperAdminDashboard />} />
                <Route path="aziende" element={<SuperAdminAziende />} />
                <Route path="aziende/nuova" element={<SuperAdminNuovaAzienda />} />
                <Route path="aziende/:id" element={<SuperAdminAziendaDetail />} />
                <Route path="audit-log" element={<SuperAdminAuditLog />} />
                <Route path="impostazioni" element={<SuperAdminImpostazioni />} />
                <Route path="billing" element={<SuperAdminBilling />} />
                <Route path="analytics" element={<SuperAdminAnalytics />} />
                <Route path="supporto" element={<SuperAdminSupporto />} />
              </Route>

              {/* Settings routes with dedicated sidebar */}
              <Route path="/app/impostazioni" element={<SettingsLayout />}>
                <Route index element={<Navigate to="profilo" replace />} />
                <Route path="profilo" element={<ImpostazioniProfilo />} />
                <Route path="utenti" element={<ImpostazioniUtenti />} />
                <Route path="log" element={<ImpostazioniLog />} />
                <Route path="notifiche" element={<ImpostazioniNotifiche />} />
                <Route path="preferenze" element={<ImpostazioniPreferenze />} />
              </Route>

              {/* Tenant app routes with sidebar layout */}
              <Route path="/app" element={<AppLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="cantieri" element={<Cantieri />} />
                <Route path="cantieri/nuovo" element={<NuovoCantiere />} />
                <Route path="cantieri/:id" element={<CantiereDetail />} />
                <Route path="documenti" element={<Documenti />} />
                <Route path="scadenze" element={<Scadenze />} />
                <Route path="subappaltatori" element={<Subappaltatori />} />
                <Route path="lavoratori" element={<Lavoratori />} />
                <Route path="lavoratori/:id" element={<LavoratoreDetail />} />
                <Route path="mezzi" element={<Mezzi />} />
                <Route path="mezzi/nuovo" element={<NuovoMezzo />} />
                <Route path="mezzi/:id" element={<MezzoDetail />} />
                <Route path="accessi" element={<Accessi />} />
                <Route path="badge" element={<BadgeList />} />
                <Route path="badge/nuovo" element={<BadgeNuovo />} />
                <Route path="badge/:id" element={<BadgeDetail />} />
                <Route path="timbrature" element={<Timbrature />} />
                <Route path="comunicazioni" element={<Comunicazioni />} />
                <Route path="checkin" element={<CheckIn />} />
                <Route path="firma" element={<FirmaDashboard />} />
                <Route path="firma/nuovo" element={<FirmaNuovo />} />
                <Route path="firma/templates" element={<FirmaTemplates />} />
                <Route path="firma/:id" element={<FirmaDetail />} />
                <Route path="firma/:id/configura" element={<FirmaConfigura />} />
                <Route path="firma/:id/firmatari" element={<FirmaFirmatari />} />
                <Route path="firma/:id/anteprima" element={<FirmaAnteprima />} />
                <Route path="firma/:id/certificato" element={<CertificatoFirma />} />
                <Route path="sicurezza" element={<Sicurezza />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="billing" element={<Billing />} />
                <Route path="supporto" element={<Supporto />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
