import { useState } from "react";
import { locations as allLocations } from "./locations";
import MapZoom from "./MapZoom";
import "./App.css";

function App() {
  const [remaining, setRemaining] = useState([...allLocations]);
  const [selected, setSelected] = useState(null);
  const [drawn, setDrawn] = useState([]);
  const [lastDrawn, setLastDrawn] = useState(null);

  const drawRandom = () => {
    if (remaining.length === 0) {
      alert("🎉 All locations have been drawn!");
      return;
    }

    const index = Math.floor(Math.random() * remaining.length);
    const chosen = remaining[index];

    setSelected(chosen);
    setLastDrawn(chosen.name);
    setDrawn((prev) => [...prev, chosen.name]);
    setRemaining((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  return (
    <div id="root">
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <h1>Fundación Ruta 40 - Bingo!</h1>
        <button onClick={drawRandom}>🎲</button>
      </div>
      <div className="map-grid">
        <MapZoom selected={selected} />

        <div className="bingo-grid-container">
          <div className="grid">
            {allLocations.map((loc) => {
              const isDrawn = drawn.includes(loc.name);
              const isLatest = loc.name === lastDrawn;
              return (
                <div
                  key={loc.name}
                  className={`cell ${isDrawn ? "drawn" : ""} ${
                    isLatest ? "popping" : ""
                  }`}
                  title={loc.name}
                >
                  {loc.bingo_value}
                </div>
              );
            })}
          </div>

          <p style={{ marginTop: "2rem", color: "#888" }}>
            {remaining.length} locations remaining
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
