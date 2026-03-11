import { useMemo } from "react";
import { MapContainer, TileLayer, Circle, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { mockCantieri, mockLavoratori } from "@/data/mock-data";
import type { Timbratura } from "@/data/mock-badges";

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const greenIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const orangeIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Haversine
function distanza(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

interface Props {
  timbrature: Timbratura[];
  filtroCantiere: string;
}

export default function MappaAccessi({ timbrature, filtroCantiere }: Props) {
  const cantieri = filtroCantiere === "tutti" ? mockCantieri : mockCantieri.filter((c) => c.id === filtroCantiere);

  const center = useMemo<[number, number]>(() => {
    if (cantieri.length === 1) return [cantieri[0].latitudine, cantieri[0].longitudine];
    const avgLat = cantieri.reduce((s, c) => s + c.latitudine, 0) / cantieri.length;
    const avgLon = cantieri.reduce((s, c) => s + c.longitudine, 0) / cantieri.length;
    return [avgLat, avgLon];
  }, [cantieri]);

  const zoom = cantieri.length === 1 ? 15 : 10;

  // Only timbrature with GPS
  const markers = useMemo(() => {
    return timbrature
      .filter((t) => t.latitudine != null && t.longitudine != null)
      .map((t) => {
        const cantiere = mockCantieri.find((c) => c.id === t.cantiere_id);
        const dist = cantiere ? distanza(t.latitudine!, t.longitudine!, cantiere.latitudine, cantiere.longitudine) : null;
        const fuori = dist != null && cantiere ? dist > cantiere.raggio_geofence : false;
        const lav = mockLavoratori.find((l) => l.id === t.lavoratore_id);
        return { ...t, dist, fuori, lav, cantiere };
      });
  }, [timbrature]);

  return (
    <div className="border border-border rounded-lg overflow-hidden" style={{ height: 350 }}>
      <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Geofence circles */}
        {cantieri.map((c) => (
          <Circle
            key={c.id}
            center={[c.latitudine, c.longitudine]}
            radius={c.raggio_geofence}
            pathOptions={{ color: "hsl(var(--primary))", fillColor: "hsl(var(--primary))", fillOpacity: 0.1, weight: 2 }}
          />
        ))}

        {/* Site center markers */}
        {cantieri.map((c) => (
          <Marker key={`site-${c.id}`} position={[c.latitudine, c.longitudine]} icon={redIcon}>
            <Popup>
              <strong>{c.nome}</strong><br />
              {c.indirizzo}, {c.comune}<br />
              Raggio geofence: {c.raggio_geofence}m
            </Popup>
          </Marker>
        ))}

        {/* Timbratura markers */}
        {markers.map((m) => (
          <Marker
            key={m.id}
            position={[m.latitudine!, m.longitudine!]}
            icon={m.fuori ? orangeIcon : greenIcon}
          >
            <Popup>
              <strong>{m.lav ? `${m.lav.nome} ${m.lav.cognome}` : "—"}</strong><br />
              {m.tipo === "entrata" ? "↗ Entrata" : "↙ Uscita"} ·{" "}
              {new Date(m.timestamp).toLocaleString("it-IT", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}<br />
              {m.dist != null && (
                <>
                  Distanza: {m.dist < 1000 ? `${Math.round(m.dist)}m` : `${(m.dist / 1000).toFixed(1)}km`}
                  {m.fuori ? " ⚠️ Fuori zona" : " ✅ In zona"}
                </>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
