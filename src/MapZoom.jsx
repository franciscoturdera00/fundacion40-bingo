import { useEffect, useState } from "react";
import "./MapZoom.css";
import { provinces } from "./provinces";

export default function MapZoom({ selected, isPopupFadingOut }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [lastSelected, setLastSelected] = useState(null);

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
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [selected]);

  const showCard = selected && (selected === lastSelected || isPopupFadingOut);

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

      {selected && (
        <div
          className="location-card-overlay"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#2a394a",
            color: "#f0f0f0",
            borderRadius: "18px",
            padding: "2.3rem",
            maxWidth: "736px", // antes: 640px
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6)",
          }}
        >
          <div
            style={{
              fontSize: "5rem",
              fontWeight: "900",
              color: "#fff",
              background: "linear-gradient(135deg, #4caf50 0%, #81c784 100%)",
              padding: "1rem 2rem",
              borderRadius: "1rem",
              boxShadow: "0 0 20px rgba(0, 0, 0, 0.5)",
              marginBottom: "1rem",
              letterSpacing: "2px",
              textShadow: "0 2px 4px rgba(0,0,0,0.6)",
            }}
          >
            {selected.bingo_value}
          </div>

          <h2 style={{ margin: 0 }}>📍 {selected.name}</h2>
          <img
            // src={`imagenes/${selected.img}`}
            src="imagenes/FotoGenerica.jpg"
            alt={selected.name}
            className="location-img"
          />
          <p style={{ marginTop: "0.75rem", fontSize: "1rem", color: "#ccc" }}>
            {selected.texto}
          </p>
        </div>
      )}
    </div>
  );
}
