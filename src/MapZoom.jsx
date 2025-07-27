import { useEffect, useState } from "react";
import "./MapZoom.css";
import { provinces } from "./provinces";

export default function MapZoom({ selected, delay }) {
  const EFFECT_TIME = 2500;
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (selected == null) return;

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

    setTimeout(() => {
      // Step 1: Zoom in
      setZoomLevel(province.zoom);
    }, delay);

    // Step 2: Zoom out
    const timeoutId = setTimeout(() => {
      setZoomLevel(1);
    }, delay + EFFECT_TIME);

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
            src="imagenes/mapa_arg_no_background.jpg"
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
