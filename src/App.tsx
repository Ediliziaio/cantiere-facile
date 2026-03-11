import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";

import { AppLayout } from "@/components/layout/AppLayout";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Cantieri from "./pages/Cantieri";
import CantiereDetail from "./pages/CantiereDetail";
import NuovoCantiere from "./pages/NuovoCantiere";
import Documenti from "./pages/Documenti";
import Scadenze from "./pages/Scadenze";
import Subappaltatori from "./pages/Subappaltatori";
import Lavoratori from "./pages/Lavoratori";
import Mezzi from "./pages/Mezzi";
import MezzoDetail from "./pages/MezzoDetail";
import NuovoMezzo from "./pages/NuovoMezzo";
import Accessi from "./pages/Accessi";
import Comunicazioni from "./pages/Comunicazioni";
import Impostazioni from "./pages/Impostazioni";
import BadgeList from "./pages/BadgeList";
import BadgeNuovo from "./pages/BadgeNuovo";
import BadgeDetail from "./pages/BadgeDetail";
import Timbrature from "./pages/Timbrature";
import Scan from "./pages/Scan";
import VerificaBadge from "./pages/VerificaBadge";
import PortaleSubappaltatore from "./pages/PortaleSubappaltatore";
import FirmaDashboard from "./pages/firma/FirmaDashboard";
import FirmaNuovo from "./pages/firma/FirmaNuovo";
import FirmaDetail from "./pages/firma/FirmaDetail";
import FirmaConfigura from "./pages/firma/FirmaConfigura";
import FirmaFirmatari from "./pages/firma/FirmaFirmatari";
import FirmaAnteprima from "./pages/firma/FirmaAnteprima";
import FirmaPublica from "./pages/firma/FirmaPublica";
import FirmaCompletata from "./pages/firma/FirmaCompletata";
import FirmaRifiuta from "./pages/firma/FirmaRifiuta";
import VerificaDocumento from "./pages/firma/VerificaDocumento";
import FirmaTemplates from "./pages/firma/FirmaTemplates";
import CertificatoFirma from "./pages/firma/CertificatoFirma";
import SuperAdminLogin from "./pages/superadmin/SuperAdminLogin";
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import SuperAdminAziende from "./pages/superadmin/SuperAdminAziende";
import SuperAdminAziendaDetail from "./pages/superadmin/SuperAdminAziendaDetail";
import SuperAdminImpostazioni from "./pages/superadmin/SuperAdminImpostazioni";
import NotFound from "./pages/NotFound";
import FunzionalitaDocumenti from "./pages/funzionalita/Documenti";
import FunzionalitaTesserini from "./pages/funzionalita/Tesserini";
import FunzionalitaAccessi from "./pages/funzionalita/Accessi";
import FunzionalitaFirma from "./pages/funzionalita/Firma";
import FunzionalitaComunicazioni from "./pages/funzionalita/Comunicazioni";
import FunzionalitaVeicoli from "./pages/funzionalita/Veicoli";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
            <Route path="/funzionalita/documenti" element={<FunzionalitaDocumenti />} />
            <Route path="/funzionalita/tesserini" element={<FunzionalitaTesserini />} />
            <Route path="/funzionalita/accessi" element={<FunzionalitaAccessi />} />
            <Route path="/funzionalita/firma" element={<FunzionalitaFirma />} />
            <Route path="/funzionalita/comunicazioni" element={<FunzionalitaComunicazioni />} />
            <Route path="/funzionalita/veicoli" element={<FunzionalitaVeicoli />} />

            {/* SuperAdmin routes */}
            <Route path="/superadmin/login" element={<SuperAdminLogin />} />
            <Route path="/superadmin" element={<SuperAdminLayout />}>
              <Route path="dashboard" element={<SuperAdminDashboard />} />
              <Route path="aziende" element={<SuperAdminAziende />} />
              <Route path="aziende/:id" element={<SuperAdminAziendaDetail />} />
              <Route path="impostazioni" element={<SuperAdminImpostazioni />} />
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
              <Route path="mezzi" element={<Mezzi />} />
              <Route path="mezzi/nuovo" element={<NuovoMezzo />} />
              <Route path="mezzi/:id" element={<MezzoDetail />} />
              <Route path="accessi" element={<Accessi />} />
              <Route path="badge" element={<BadgeList />} />
              <Route path="badge/nuovo" element={<BadgeNuovo />} />
              <Route path="badge/:id" element={<BadgeDetail />} />
              <Route path="timbrature" element={<Timbrature />} />
              <Route path="comunicazioni" element={<Comunicazioni />} />
              <Route path="firma" element={<FirmaDashboard />} />
              <Route path="firma/nuovo" element={<FirmaNuovo />} />
              <Route path="firma/templates" element={<FirmaTemplates />} />
              <Route path="firma/:id" element={<FirmaDetail />} />
              <Route path="firma/:id/configura" element={<FirmaConfigura />} />
              <Route path="firma/:id/firmatari" element={<FirmaFirmatari />} />
              <Route path="firma/:id/anteprima" element={<FirmaAnteprima />} />
              <Route path="firma/:id/certificato" element={<CertificatoFirma />} />
              <Route path="impostazioni" element={<Impostazioni />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
