import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in React Leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const SCAN_URL = `${import.meta.env.BASE_URL}bluetooth-devices.json`;
const DEFAULT_POSITION = [51.505, -0.09];

// Offset a lat/lng by a distance in meters along a compass bearing in degrees.
function offset([lat, lng], meters, bearing) {
    const rad = (bearing * Math.PI) / 180;
    return [
        lat + (meters * Math.cos(rad)) / 111320,
        lng + (meters * Math.sin(rad)) / (111320 * Math.cos((lat * Math.PI) / 180)),
    ];
}

function Recenter({ position, zoom }) {
    const map = useMap();
    useEffect(() => {
        map.setView(position, zoom);
    }, [map, position[0], position[1], zoom]);
    return null;
}

export default function SatelliteMap() {
    const [scan, setScan] = useState(null);

    // Written by scripts/scan-bluetooth.ps1; re-read so a new scan shows up without a reload.
    useEffect(() => {
        let cancelled = false;
        const load = () =>
            fetch(SCAN_URL, { cache: 'no-store' })
                .then((r) => (r.ok ? r.json() : null))
                .then((data) => !cancelled && setScan(data))
                .catch(() => !cancelled && setScan(null));
        load();
        const timer = setInterval(load, 15000);
        return () => {
            cancelled = true;
            clearInterval(timer);
        };
    }, []);

    const located = Boolean(scan?.location);
    const position = located ? [scan.location.lat, scan.location.lng] : DEFAULT_POSITION;
    const nearby = scan?.nearby ?? [];
    const paired = scan?.paired ?? [];
    const label = (d) => d.name || (d.vendor ? `Unnamed ${d.vendor} device` : 'Unnamed device');

    return (
        <div className="w-full h-full relative" style={{ minHeight: '300px' }}>
            <div className="absolute top-2 right-2 z-[1000] bg-black/50 px-2 py-1 text-xs text-[#00f0ff] border border-[#00f0ff]">
                {scan ? `BT IN RANGE: ${nearby.length} | PAIRED: ${paired.length}` : 'BT SCAN: NO DATA'}
            </div>
            {scan && (
                <div className="absolute bottom-2 left-2 z-[1000] max-w-[60%] bg-black/70 px-2 py-1 text-[10px] leading-tight text-[#00f0ff] border border-[#00f0ff]/50">
                    <div>SCAN {new Date(scan.scannedAt).toLocaleTimeString()}</div>
                    <div className="text-white/70">
                        Ring = estimated distance from signal strength. Direction is unknown; dots are spread evenly.
                    </div>
                    {paired.length > 0 && <div>PAIRED (not located): {paired.map((d) => d.name).join(', ')}</div>}
                    {!located && <div className="text-[#ff003c]">No location for this computer; map not centered.</div>}
                </div>
            )}
            <MapContainer center={position} zoom={located ? 19 : 13} maxZoom={19} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <Recenter position={position} zoom={located ? 19 : 13} />
                <TileLayer
                    attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    maxZoom={19}
                />
                {located && (
                    <>
                        <Circle
                            center={position}
                            radius={scan.location.accuracyMeters}
                            pathOptions={{ color: '#ffffff', weight: 1, opacity: 0.4, fillOpacity: 0.03, dashArray: '4 6' }}
                        />
                        <Marker position={position}>
                            <Popup>
                                This computer ({scan.location.source} location, ±{scan.location.accuracyMeters} m)
                            </Popup>
                        </Marker>
                        {nearby.map((d, i) => (
                            <Circle
                                key={`ring-${d.address}`}
                                center={position}
                                radius={d.estimatedMeters}
                                pathOptions={{ color: '#00f0ff', weight: 1, opacity: 0.35, fill: false }}
                            />
                        ))}
                        {nearby.map((d, i) => (
                            <CircleMarker
                                key={d.address}
                                center={offset(position, d.estimatedMeters, (360 / nearby.length) * i)}
                                radius={6}
                                pathOptions={{ color: '#00f0ff', fillColor: '#00f0ff', fillOpacity: 0.8, weight: 1 }}
                            >
                                <Popup>
                                    {label(d)}
                                    <br />
                                    {d.address}
                                    <br />
                                    {d.rssi} dBm, about {d.estimatedMeters} m away
                                    <br />
                                    Direction unknown
                                </Popup>
                            </CircleMarker>
                        ))}
                    </>
                )}
            </MapContainer>
        </div>
    );
}
