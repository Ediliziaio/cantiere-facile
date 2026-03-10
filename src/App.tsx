import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AppLayout } from "@/components/layout/AppLayout";
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
import Accessi from "./pages/Accessi";
import Comunicazioni from "./pages/Comunicazioni";
import Impostazioni from "./pages/Impostazioni";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* App routes with sidebar layout */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cantieri" element={<Cantieri />} />
            <Route path="/cantieri/nuovo" element={<NuovoCantiere />} />
            <Route path="/cantieri/:id" element={<CantiereDetail />} />
            <Route path="/documenti" element={<Documenti />} />
            <Route path="/scadenze" element={<Scadenze />} />
            <Route path="/subappaltatori" element={<Subappaltatori />} />
            <Route path="/lavoratori" element={<Lavoratori />} />
            <Route path="/mezzi" element={<Mezzi />} />
            <Route path="/accessi" element={<Accessi />} />
            <Route path="/comunicazioni" element={<Comunicazioni />} />
            <Route path="/impostazioni" element={<Impostazioni />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
