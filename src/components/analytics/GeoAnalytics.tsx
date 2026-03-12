import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { mockCantieri, mockDocumenti } from "@/data/mock-data";
import { mockSafetyPlans } from "@/data/mock-safety";
import { getSnapshotsByRange } from "@/data/mock-analytics";
import "leaflet/dist/leaflet.css";

export function GeoAnalytics() {
  const todaySnapshots = getSnapshotsByRange(1);

  const siteMarkers = mockCantieri.map(site => {
    const plan = mockSafetyPlans.find(p => p.site_id === site.id);
    const docs = mockDocumenti.filter(d => d.cantiere_id === site.id);
    const docsOk = docs.filter(d => d.stato === 'valido').length;
    const docsPct = docs.length > 0 ? Math.round((docsOk / docs.length) * 100) : 0;
    const posOk = plan?.status === 'approved';

    const compliance: 'green' | 'yellow' | 'red' = posOk && docsPct >= 90 ? 'green' : posOk || docsPct >= 70 ? 'yellow' : 'red';

    const snapshot = todaySnapshots.find(s => s.site_id === site.id);

    return {
      ...site,
      compliance,
      workers: snapshot?.workers_count ?? 0,
      dailyCost: snapshot ? snapshot.costs_labor + snapshot.costs_materials : 0,
      docsPct,
    };
  });

  const colorMap = { green: '#22c55e', yellow: '#eab308', red: '#ef4444' };
  const center: [number, number] = [45.58, 9.43];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Mappa Cantieri — Stato Compliance</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[500px] rounded-b-lg overflow-hidden">
          <MapContainer center={center} zoom={9} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {siteMarkers.map(site => (
              <CircleMarker
                key={site.id}
                center={[site.latitudine, site.longitudine]}
                radius={18}
                pathOptions={{ color: colorMap[site.compliance], fillColor: colorMap[site.compliance], fillOpacity: 0.6, weight: 2 }}
              >
                <Popup>
                  <div className="text-sm space-y-1">
                    <p className="font-semibold">{site.nome}</p>
                    <p>{site.comune} — {site.indirizzo}</p>
                    <hr />
                    <p>👷 Operai oggi: <strong>{site.workers}</strong></p>
                    <p>📄 Documenti: <strong>{site.docsPct}%</strong></p>
                    <p>💰 Costo giornaliero: <strong>€{site.dailyCost.toLocaleString('it-IT')}</strong></p>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
}
