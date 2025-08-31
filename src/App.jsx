import { useState, useEffect } from "react";
import { locations as allLocations } from "./locations";
import MapZoom from "./MapZoom";
import "./App.css";

function App() {
  useEffect(() => {
    allLocations.forEach((prov) => {
      const img = new Image();
      img.src = `imagenes/escuelas/${prov.img}`;
      console.log(`imagenes/escuelas/${prov.img}`);
    });
  }, []);

  const ANIMATION_TIME = 0; // Animation code commented out below
  const BUTTON_TIMEOUT = 3000;
  const [remaining, setRemaining] = useState([...allLocations]);
  const [selected, setSelected] = useState(null);
  const [drawn, setDrawn] = useState([]);
  const [lastDrawn, setLastDrawn] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  // const [showAnimation, setShowAnimation] = useState(false);
  const [showCard, setShowCard] = useState(false);
  // const [oscillatingValue, setOscillatingValue] = useState(null);

  // // This is for if we want an oscilating value when the bingo number is being picked
  // useEffect(() => {
  //   let interval;
  //   if (showAnimation && remaining.length > 0) {
  //     interval = setInterval(() => {
  //       const index = Math.floor(Math.random() * remaining.length);
  //       setOscillatingValue(
  //         Math.floor(Math.random() * allLocations.length) + 1
  //       );
  //     }, 100);
  //   } else {
  //     clearInterval(interval);
  //   }
  //   return () => clearInterval(interval);
  // }, [showAnimation, remaining]);

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
    // setShowAnimation(true);
    setShowCard(false);

    setTimeout(() => {
      // setShowAnimation(false);
      setShowCard(true);
    }, ANIMATION_TIME);

    setTimeout(() => {
      setIsButtonDisabled(false);
    }, BUTTON_TIMEOUT);
  };

  const resetGame = () => {
    setRemaining([...allLocations]);
    setSelected(null);
    setDrawn([]);
    setLastDrawn(null);
    setIsButtonDisabled(false);
    // setShowAnimation(false);
    setShowCard(false);
    // setOscillatingValue(null);
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
          <MapZoom selected={selected} delay={ANIMATION_TIME} />

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
            <button
              onClick={resetGame}
              style={{
                marginTop: "0.5rem",
              }}
            >
              RESET
            </button>
          </div>
        </div>

        {/* {showAnimation && (
          <div
            className="bingo-animation"
            style={{
              position: "fixed",
              inset: 0,
              display: "flex",
              // transform: "translate(0, -5%)",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(42, 57, 74, 0.95)",
              zIndex: 10000,
            }}
          >
            <div
              style={{
                fontSize: "10rem",
                fontWeight: "bold",
                color: "#fff",
                padding: "3rem 4rem",
                borderRadius: "3rem",
                textShadow: "0 4px 10px rgba(0,0,0,0.6)",
                animation: "pop 0.8s ease-in-out infinite alternate",
                boxShadow: "0 10px 36px rgba(0,0,0,0.9)",
              }}
            >
              {oscillatingValue || "?"}
            </div>
          </div>
        )} */}

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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.5rem",
                marginBottom: "1.5rem",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  fontSize: "5rem",
                  fontWeight: "900",
                  color: "#fff",
                  background:
                    "linear-gradient(135deg, #4caf50 0%, #81c784 100%)",
                  padding: "1rem 2rem",
                  borderRadius: "1rem",
                  boxShadow: "0 0 20px rgba(0, 0, 0, 0.5)",
                  letterSpacing: "2px",
                  textShadow: "0 2px 4px rgba(0,0,0,0.6)",
                  whiteSpace: "nowrap",
                }}
              >
                {selected.bingo_value}
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "2.5rem",
                  color: "#f0f0f0",
                  fontWeight: "700",
                  textShadow: "0 2px 4px rgba(0,0,0,0.4)",
                  lineHeight: "1.3",
                  textAlign: "center", // CENTRADO
                }}
              >
                📍{selected.name}
              </h2>
            </div>

            <img
              src={`imagenes/escuelas/${selected.img}`}
              onError={(e) => {
                e.target.onerror = null; // evita loop
                e.target.src = "imagenes/FotoGenerica.jpg";
              }}
              alt={selected.name}
              className="location-img"
              style={{
                width: "100%",
                maxHeight: "280px",
                objectFit: "cover",
                borderRadius: "1rem",
                marginBottom: "1.5rem",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
              }}
            />

            <p
              style={{
                fontSize: "2rem",
                lineHeight: "1.6",
                color: "#ddd",
                margin: 0,
                textAlign: "left",
                textWrap: "pretty",
              }}
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
