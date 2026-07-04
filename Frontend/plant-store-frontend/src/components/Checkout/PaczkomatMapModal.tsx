import { useEffect, useRef, useState } from "react";
import { X, Loader2 } from "lucide-react";

interface PaczkomatPoint {
  name: string;
  lat: number;
  lon: number;
  address: string;
}

interface Props {
  onSelect: (point: PaczkomatPoint) => void;
  onClose: () => void;
}

async function fetchPaczkomaty(lat: number, lon: number): Promise<PaczkomatPoint[]> {
  const radius = 15000;
  const query = `[out:json][timeout:25];
(
  node["amenity"="parcel_locker"]["operator"="InPost"](around:${radius},${lat},${lon});
  node["amenity"="parcel_locker"]["brand"="InPost"](around:${radius},${lat},${lon});
);
out body;`;

  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
  });
  const data = await res.json();

  const seen = new Set<string>();
  return (data.elements as any[])
    .map((e: any) => ({
      name: e.tags?.ref || e.tags?.["operator:ref"] || e.tags?.name || `${e.id}`,
      lat: e.lat,
      lon: e.lon,
      address: [e.tags?.["addr:street"], e.tags?.["addr:housenumber"], e.tags?.["addr:city"]]
        .filter(Boolean)
        .join(" "),
    }))
    .filter((p) => {
      if (seen.has(p.name)) return false;
      seen.add(p.name);
      return true;
    });
}

export default function PaczkomatMapModal({ onSelect, onClose }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [status, setStatus] = useState<"locating" | "loading" | "ready" | "error">("locating");

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      // Fix domyślnych ikon Leaflet
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (!mapRef.current || cancelled) return;

      // Ustal pozycję startową
      let startLat = 52.2297;
      let startLon = 21.0122;

      try {
        const pos = await new Promise<GeolocationPosition>((res, rej) =>
          navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 })
        );
        startLat = pos.coords.latitude;
        startLon = pos.coords.longitude;
      } catch {
        // fallback: Warszawa
      }

      if (cancelled) return;
      setStatus("loading");

      const map = L.map(mapRef.current).setView([startLat, startLon], 13);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      // Ikona paczkomatu
      const icon = L.divIcon({
        className: "",
        html: `<div style="background:#e84032;border:2px solid white;border-radius:50%;width:14px;height:14px;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      async function loadPoints(lat: number, lon: number) {
        try {
          const points = await fetchPaczkomaty(lat, lon);
          if (cancelled) return;
          points.forEach((p) => {
            const marker = L.marker([p.lat, p.lon], { icon });
            marker.bindPopup(
              `<div style="min-width:140px">
                <b>${p.name}</b><br/>
                <span style="font-size:12px">${p.address || "—"}</span><br/>
                <button id="sel-${p.name}" style="margin-top:6px;background:#16a34a;color:white;border:none;padding:4px 10px;border-radius:6px;cursor:pointer;font-size:12px">Wybierz</button>
              </div>`
            );
            marker.on("popupopen", () => {
              setTimeout(() => {
                document.getElementById(`sel-${p.name}`)?.addEventListener("click", () => {
                  onSelect(p);
                  onClose();
                });
              }, 50);
            });
            marker.addTo(map);
          });
          setStatus("ready");
        } catch {
          if (!cancelled) setStatus("error");
        }
      }

      await loadPoints(startLat, startLon);

      // Załaduj nowe punkty po przesunięciu
      map.on("moveend", () => {
        const center = map.getCenter();
        loadPoints(center.lat, center.lng);
      });
    }

    init();

    return () => {
      cancelled = true;
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col" style={{ height: "80vh" }}>
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="font-semibold text-gray-800">Wybierz paczkomat</h2>
          <div className="flex items-center gap-3">
            {status === "loading" && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Loader2 className="w-3 h-3 animate-spin" /> Ładowanie punktów…
              </span>
            )}
            {status === "error" && (
              <span className="text-xs text-red-500">Błąd ładowania punktów</span>
            )}
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 px-4 py-2 border-b">
          Kliknij na czerwony punkt → <b>Wybierz</b>
        </p>
        <div ref={mapRef} className="flex-1 rounded-b-xl" />
      </div>
    </div>
  );
}
