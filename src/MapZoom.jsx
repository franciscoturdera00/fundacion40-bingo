import { useEffect, useState } from "react";
import "./MapZoom.css";
import { provinces } from "./provinces";

export default function MapZoom({ selected }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [lastSelected, setLastSelected] = useState(null);

  useEffect(() => {
    if (selected && selected !== lastSelected) {
      setZoomLevel(1); // Zoom out first

      const zoomInTimeout = setTimeout(() => {
        setLastSelected(selected);
        setZoomLevel(provinces[selected.province]?.zoom || 1);

        const zoomOutTimeout = setTimeout(() => {
          setZoomLevel(1);
        }, 5000); // zoom out 5s after zooming in

        return () => clearTimeout(zoomOutTimeout);
      }, 500); // zoom in after 2s

      return () => clearTimeout(zoomInTimeout);
    }
  }, [selected, lastSelected]);

  const showCard = selected && selected === lastSelected;

  if (!selected) return null;

  const province = provinces[selected.province];
  if (!province) return null;

  const { center } = province;

  const style = {
    transformOrigin: `${center.x}% ${center.y}%`,
    transform: `scale(${zoomLevel})`,
    transition: "transform 2s ease-in-out",
  };

  return (
    <div className="map-grid">
      <div className="map-wrapper">
        <div className="map-inner" style={style}>
          <img
            src="/mapa_argentina.png"
            className="map-img"
            alt="Argentina map"
          />
          {
            <div
              className="map-marker"
              style={{ left: `${center.x}%`, top: `${center.y}%` }}
            >
              <div className="marker-head" />
              <div className="marker-body" />
            </div>
          }
        </div>
      </div>
      {showCard && (
        <div
          className="location-card-overlay fade-in"
          style={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <h2>{selected.name}</h2>
          <img
            src={selected.img}
            alt={selected.name}
            className="location-img"
          />
          <p>{selected.province}</p>
        </div>
      )}
    </div>
  );
}
