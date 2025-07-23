import { useState } from "react";
import { locations as allLocations } from "./locations";
import MapZoom from "./MapZoom";
import "./App.css";

function App() {
  const [remaining, setRemaining] = useState([...allLocations]);
  const [selected, setSelected] = useState(null);
  const [drawn, setDrawn] = useState([]);
  const [lastDrawn, setLastDrawn] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showCard, setShowCard] = useState(false);

  const drawRandom = () => {
    if (isButtonDisabled || remaining.length === 0) return;

    const index = Math.floor(Math.random() * remaining.length);
    const selectedLocation = remaining[index];

    const newRemaining = [...remaining];
    newRemaining.splice(index, 1);
    setRemaining(newRemaining);

    setSelected(selectedLocation);
    setLastDrawn(selectedLocation.name);
    setDrawn([...drawn, selectedLocation.name]);

    setIsButtonDisabled(true);
    setShowAnimation(true);
    setShowCard(false);

    setTimeout(() => {
      setShowAnimation(false);
      setShowCard(true);
    }, 4000);

    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 6000);
  };

  return (
    <div className="app-scaled">
      <div id="root">
        <div className="header">
          <div className="title-block">
            <h1 className="main-title">Fundación Ruta 40 - Bingo!</h1>
            <button
              onClick={drawRandom}
              disabled={isButtonDisabled}
              style={{
                marginTop: "0.5rem",
                opacity: isButtonDisabled ? 0.5 : 1,
                cursor: isButtonDisabled ? "not-allowed" : "pointer",
                transition: "opacity 0.3s",
              }}
            >
              🎲
            </button>
          </div>
        </div>

        <div className="main-layout">
          <MapZoom selected={selected} />

          <div className="bingo-grid-container">
            <div className="grid">
              {[...allLocations]
                .sort((a, b) => a.bingo_value - b.bingo_value)
                .map((loc) => {
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
          </div>
        </div>

        {showAnimation && selected && (
          <div
            className="bingo-animation"
            style={{
              position: "fixed",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(42, 57, 74, 0.95)",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                fontSize: "6rem",
                // fontWeight: "bold",
                color: "#fff",
                padding: "3rem 4rem",
                borderRadius: "2rem",
                textShadow: "0 3px 8px rgba(0,0,0,0.6)",
                animation: "pop 0.8s ease-in-out infinite alternate",
                boxShadow: "0 8px 32px rgba(0,0,0,0.8)",
              }}
            >
              {selected.bingo_value}
              remaining[rand]
            </div>
          </div>
        )}

        {showCard && selected && (
          <div
            className="location-card-overlay"
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#2a394a",
              color: "#f0f0f0",
              borderRadius: "18px",
              padding: "2.3rem",
              maxWidth: "736px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6)",
              textAlign: "center",
              zIndex: 1000,
            }}
          >
            <h2 style={{ margin: 0 }}>📍 {selected.name}</h2>
            <img
              // src={`imagenes/${selected.img}`}
              src="imagenes/FotoGenerica.jpg"
              alt={selected.name}
              className="location-img"
            />
            <p
              style={{ marginTop: "0.75rem", fontSize: "1rem", color: "#ccc" }}
            >
              {selected.texto}
            </p>
          </div>
        )}

        <img
          src="/imagenes/Logo_FR40_white.png"
          alt="Fundación Ruta 40"
          className="logo-fr40-fixed"
        />
      </div>
    </div>
  );
}

export default App;
