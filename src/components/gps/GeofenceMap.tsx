import { useMemo } from "react";
import { MapContainer, TileLayer, Circle, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { GeoPosition } from "@/hooks/useGeolocation";
import type { GeofenceStatus } from "@/hooks/useGeofencing";

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const siteIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const workerIcon = new L.DivIcon({
  className: "worker-position-marker",
  html: `<div style="width:16px;height:16px;background:hsl(217,91%,60%);border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

interface Props {
  siteLat: number;
  siteLng: number;
  siteRadius: number;
  siteName: string;
  position: GeoPosition | null;
  status: GeofenceStatus;
  distance: number | null;
}

export function GeofenceMap({
  siteLat,
  siteLng,
  siteRadius,
  siteName,
  position,
  status,
  distance,
}: Props) {
  const center = useMemo<[number, number]>(
    () => (position ? [position.lat, position.lng] : [siteLat, siteLng]),
    [position, siteLat, siteLng]
  );

  const isInside = status === "inside" || status === "entering";
  const fenceColor = isInside ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)";

  const distanceLine = useMemo(() => {
    if (!position) return null;
    return [
      [position.lat, position.lng] as [number, number],
      [siteLat, siteLng] as [number, number],
    ];
  }, [position, siteLat, siteLng]);

  return (
    <div className="border border-border rounded-xl overflow-hidden" style={{ height: 280 }}>
      <MapContainer
        center={center}
        zoom={16}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Geofence circle */}
        <Circle
          center={[siteLat, siteLng]}
          radius={siteRadius}
          pathOptions={{
            color: fenceColor,
            fillColor: fenceColor,
            fillOpacity: 0.12,
            weight: 2,
            dashArray: isInside ? undefined : "8 4",
          }}
        />

        {/* Site marker */}
        <Marker position={[siteLat, siteLng]} icon={siteIcon}>
          <Popup>
            <strong>{siteName}</strong>
            <br />
            Raggio: {siteRadius}m
          </Popup>
        </Marker>

        {/* Worker position */}
        {position && (
          <>
            <Marker position={[position.lat, position.lng]} icon={workerIcon}>
              <Popup>
                <strong>La tua posizione</strong>
                <br />
                Precisione: ±{Math.round(position.accuracy)}m
                {distance !== null && (
                  <>
                    <br />
                    Distanza: {distance}m
                  </>
                )}
              </Popup>
            </Marker>

            {/* Accuracy circle */}
            <Circle
              center={[position.lat, position.lng]}
              radius={position.accuracy}
              pathOptions={{
                color: "hsl(217, 91%, 60%)",
                fillColor: "hsl(217, 91%, 60%)",
                fillOpacity: 0.1,
                weight: 1,
              }}
            />
          </>
        )}

        {/* Distance line */}
        {distanceLine && (
          <Polyline
            positions={distanceLine}
            pathOptions={{
              color: "hsl(var(--muted-foreground))",
              weight: 1,
              dashArray: "4 4",
              opacity: 0.6,
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
