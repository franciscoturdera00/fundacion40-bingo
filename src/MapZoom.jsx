import { useEffect, useState } from "react";
import "./MapZoom.css";
import { provinces } from "./provinces";

export default function MapZoom({ selected }) {
  const [zooming, setZooming] = useState(false);

  useEffect(() => {
    if (selected) {
      setZooming(true);
      const timeout = setTimeout(() => setZooming(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [selected]);

  if (!selected) return null;

  const province = provinces[selected.province];
  if (!province) return null;

  const { center, zoom } = province;

  const style = {
    transformOrigin: `${center.x}% ${center.y}%`,
    transform: zooming ? `scale(${zoom})` : "scale(1)",
    transition: "transform 2s ease-in-out",
  };

  return (
    <div className="map-wrapper">
      <img
        src="/mapa_argentina.png"
        className="map-img"
        style={style}
        alt="Argentina map"
      />
      {/* {!zooming && (
        <div className="location-card">
          <h2>{selected.name}</h2>
          <img src={selected.img} alt={selected.name} />
          <p>{selected.province}</p>
        </div>
      )} */}
    </div>
  );
}
