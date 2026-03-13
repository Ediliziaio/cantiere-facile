import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KPICards } from "@/components/analytics/KPICards";
import { TrendCharts } from "@/components/analytics/TrendCharts";
import { SiteComplianceMatrix } from "@/components/analytics/SiteComplianceMatrix";
import { CostiAnalysis } from "@/components/analytics/CostiAnalysis";
import { GeoAnalytics } from "@/components/analytics/GeoAnalytics";
import { ReportExporter } from "@/components/analytics/ReportExporter";
import { BarChart3 } from "lucide-react";
import { mockCantieri } from "@/data/mock-data";

export default function Analytics() {
  const [days, setDays] = useState(30);
  const [filterCantiere, setFilterCantiere] = useState("tutti");

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Analytics</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={filterCantiere} onValueChange={setFilterCantiere}>
            <SelectTrigger className="w-52"><SelectValue placeholder="Cantiere" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="tutti">Tutti i cantieri</SelectItem>
              {mockCantieri.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={String(days)} onValueChange={v => setDays(Number(v))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Ultimi 7 giorni</SelectItem>
              <SelectItem value="30">Ultimi 30 giorni</SelectItem>
              <SelectItem value="90">Ultimi 90 giorni</SelectItem>
              <SelectItem value="365">Ultimo anno</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <KPICards days={days} />

      <Tabs defaultValue="overview">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="economica">Economica</TabsTrigger>
          <TabsTrigger value="sicurezza">Sicurezza</TabsTrigger>
          <TabsTrigger value="mappa">Mappa</TabsTrigger>
          <TabsTrigger value="report">Report</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <TrendCharts days={days} />
        </TabsContent>

        <TabsContent value="economica">
          <CostiAnalysis />
        </TabsContent>

        <TabsContent value="sicurezza" className="space-y-4">
          <TrendCharts days={days} />
          <SiteComplianceMatrix />
        </TabsContent>

        <TabsContent value="mappa">
          <GeoAnalytics />
        </TabsContent>

        <TabsContent value="report">
          <ReportExporter />
        </TabsContent>
      </Tabs>
    </div>
  );
}
