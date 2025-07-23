import { useEffect, useState } from "react";
import "./MapZoom.css";
import { provinces } from "./provinces";

export default function MapZoom({ selected, isPopupFadingOut }) {
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (!selected) return;

    const normalizedProvince = selected.province
      ?.trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "");
    const province = provinces[normalizedProvince];

    if (!province) {
      console.warn("Provincia no encontrada:", selected.province);
      setZoomLevel(1);
      return;
    }

    // Step 1: Zoom in
    setZoomLevel(province.zoom);

    // Step 2: Zoom out after 5s
    const timeoutId = setTimeout(() => {
      setZoomLevel(1);
    }, 4000);

    return () => clearTimeout(timeoutId);
  }, [selected]);

  const normalizedProvince = selected?.province
    ?.trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "");
  const province = provinces[normalizedProvince];

  // fallback si no hay provincia válida
  const fallback = {
    center: { x: 50, y: 50 },
    zoom: 1,
  };
  const center = province?.center || fallback.center;
  const zoom = province?.zoom || fallback.zoom;

  return (
    <div className="map-grid">
      <div className="map-wrapper">
        <div
          className="map-inner"
          style={
            province && center
              ? {
                  transformOrigin: `${center.x}% ${center.y}%`,
                  transform: `scale(${zoomLevel})`,
                  transition: "transform 2s ease-in-out",
                }
              : {}
          }
        >
          <img
            src="/mapa_argentina.png"
            className="map-img"
            alt="Argentina map"
          />
          {province && center && (
            <div
              className="map-marker"
              style={{ left: `${center.x}%`, top: `${center.y}%` }}
            >
              <div className="marker-head" />
              <div className="marker-body" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
