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
      <h1>Argentina Bingo</h1>
      <MapZoom selected={selected} />
      <button onClick={drawRandom}>🎲 Draw Location</button>

      {selected && (
        <div key={selected.name} className="card animated-card">
          <h2>{selected.name}</h2>
          <img
            src={selected.img}
            alt={selected.name}
            style={{
              maxWidth: "300px",
              maxHeight: "200px",
              marginTop: "1rem",
              border: "1px solid #ccc",
              background: "white",
            }}
          />
          <p>Latitude: {selected.lat}</p>
          <p>Longitude: {selected.lng}</p>
        </div>
      )}

      <h2 style={{ marginTop: "2rem" }}>Bingo Board</h2>
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
              {loc.name}
            </div>
          );
        })}
      </div>

      <p style={{ marginTop: "2rem", color: "#888" }}>
        {remaining.length} locations remaining
      </p>
    </div>
  );
}

export default App;
