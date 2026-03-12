import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockCantieri, mockDocumenti } from "@/data/mock-data";
import { mockSafetyPlans, mockInspections } from "@/data/mock-safety";
import { useNavigate } from "react-router-dom";

function StatusDot({ status }: { status: 'green' | 'yellow' | 'red' }) {
  const colors = {
    green: 'bg-emerald-500',
    yellow: 'bg-amber-500',
    red: 'bg-red-500',
  };
  return <div className={`h-3 w-3 rounded-full ${colors[status]} mx-auto`} />;
}

export function SiteComplianceMatrix() {
  const navigate = useNavigate();

  const siteData = mockCantieri.map(cantiere => {
    const plan = mockSafetyPlans.find(p => p.site_id === cantiere.id);
    const posStatus: 'green' | 'yellow' | 'red' = !plan ? 'red' : plan.status === 'approved' ? 'green' : 'yellow';

    const docs = mockDocumenti.filter(d => d.cantiere_id === cantiere.id);
    const docsOk = docs.filter(d => d.stato === 'valido').length;
    const docsPct = docs.length > 0 ? Math.round((docsOk / docs.length) * 100) : 0;
    const docsStatus: 'green' | 'yellow' | 'red' = docsPct >= 90 ? 'green' : docsPct >= 70 ? 'yellow' : 'red';

    const lastInspection = mockInspections
      .filter(i => i.site_id === cantiere.id)
      .sort((a, b) => b.inspection_date.localeCompare(a.inspection_date))[0];
    const inspectionStatus: 'green' | 'yellow' | 'red' = !lastInspection ? 'red' :
      lastInspection.overall_score >= 85 ? 'green' : lastInspection.overall_score >= 70 ? 'yellow' : 'red';

    const durcDocs = docs.filter(d => d.categoria === 'DURC');
    const durcOk = durcDocs.every(d => d.stato === 'valido');
    const durcStatus: 'green' | 'yellow' | 'red' = durcDocs.length === 0 ? 'red' : durcOk ? 'green' : 'yellow';

    return {
      ...cantiere,
      posStatus,
      docsPct,
      docsStatus,
      inspectionScore: lastInspection?.overall_score ?? 0,
      inspectionStatus,
      durcStatus,
    };
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Matrice Compliance Cantieri</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cantiere</TableHead>
              <TableHead className="text-center">POS</TableHead>
              <TableHead className="text-center">Documenti</TableHead>
              <TableHead className="text-center">Ispezione</TableHead>
              <TableHead className="text-center">DURC</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {siteData.map(site => (
              <TableRow
                key={site.id}
                className="cursor-pointer"
                onClick={() => navigate(`/app/cantieri/${site.id}`)}
              >
                <TableCell className="font-medium">{site.nome}</TableCell>
                <TableCell><StatusDot status={site.posStatus} /></TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center gap-0.5">
                    <StatusDot status={site.docsStatus} />
                    <span className="text-[10px] text-muted-foreground">{site.docsPct}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center gap-0.5">
                    <StatusDot status={site.inspectionStatus} />
                    <span className="text-[10px] text-muted-foreground">{site.inspectionScore}/100</span>
                  </div>
                </TableCell>
                <TableCell><StatusDot status={site.durcStatus} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
