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
  const [isPopupFadingOut, setIsPopupFadingOut] = useState(false);

  const drawRandom = () => {
    if (isButtonDisabled || remaining.length === 0) return;

    const index = Math.floor(Math.random() * remaining.length);
    const selectedLocation = remaining[index];

    setSelected(selectedLocation);
    setLastDrawn(selectedLocation.name);
    setDrawn([...drawn, selectedLocation.name]);

    setIsButtonDisabled(true);
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 8000); // 8 seconds
  };

  return (
    <div className="app-scaled">
      <div id="root">
        {/* Title and Button Centered */}
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
        {/* Main layout: Map on left, Grid on right */}
        <div className="main-layout">
          <MapZoom selected={selected} isPopupFadingOut={isPopupFadingOut} />

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

            <p style={{ marginTop: "2rem", color: "#888" }}></p>
          </div>
        </div>
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
