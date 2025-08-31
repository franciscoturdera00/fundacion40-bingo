import { useState, useEffect, useRef } from "react"; // ← add useRef
import { locations as allLocations } from "./locations";
import MapZoom from "./MapZoom";
import "./App.css";

function App() {
  // Cache for preloaded images
  const imgCacheRef = useRef(new Map());

  useEffect(() => {
    allLocations.forEach((prov) => {
      const src = `imagenes/escuelas/${prov.img || "FotoGenerica.jpg"}`;
      const img = new Image();
      img.src = src;

      // Try to decode right away so it's ready to paint instantly later
      if (img.decode) {
        img.decode().catch(() => {}); // ignore decode errors; we'll handle on use
      }
      imgCacheRef.current.set(src, img);
    });
  }, []);

  const ANIMATION_TIME = 0;
  const BUTTON_TIMEOUT = 3000;
  const [remaining, setRemaining] = useState([...allLocations]);
  const [selected, setSelected] = useState(null);
  const [drawn, setDrawn] = useState([]);
  const [lastDrawn, setLastDrawn] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showCard, setShowCard] = useState(false);

  // Helper: ensure an image is decoded before showing
  const ensureDecoded = async (src) => {
    let img = imgCacheRef.current.get(src);
    if (!img) {
      img = new Image();
      img.src = src;
      imgCacheRef.current.set(src, img);
    }

    // Try HTMLImageElement.decode() when available (best, no layout jank)
    if (img.decode) {
      try {
        await img.decode();
        return src;
      } catch {
        // If image missing or decode fails, fall back
      }
    } else if (!img.complete) {
      // Older browsers: wait for onload/onerror
      await new Promise((res) => {
        img.onload = img.onerror = () => res();
      });
      if (img.naturalWidth > 0) return src; // loaded fine
    }

    // Fallback to generic photo if original failed
    const fallback = "imagenes/FotoGenerica.jpg";
    let fb = imgCacheRef.current.get(fallback);
    if (!fb) {
      fb = new Image();
      fb.src = fallback;
      imgCacheRef.current.set(fallback, fb);
    }
    if (fb.decode) {
      try {
        await fb.decode();
      } catch {}
    } else if (!fb.complete) {
      await new Promise((res) => {
        fb.onload = fb.onerror = () => res();
      });
    }
    return fallback;
  };

  const drawRandom = async () => {
    if (isButtonDisabled || remaining.length === 0) return;

    const index = Math.floor(Math.random() * remaining.length);
    const selectedLocation = remaining[index];

    const newRemaining = [...remaining];
    newRemaining.splice(index, 1);
    setRemaining(newRemaining);

    setSelected(selectedLocation);
    setLastDrawn(selectedLocation.name);
    setDrawn((d) => [...d, selectedLocation.name]);

    setIsButtonDisabled(true);
    setShowCard(false);

    // Wait for the image to be decoded before showing the card
    const src = `imagenes/escuelas/${
      selectedLocation.img || "FotoGenerica.jpg"
    }`;
    const readySrc = await ensureDecoded(src);

    // Small delay hook if you ever re-enable animation
    await new Promise((r) => setTimeout(r, ANIMATION_TIME));

    // Now show the card; the image is already decoded, so it paints instantly
    setShowCard(true);

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
    setShowCard(false);
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
            <button onClick={resetGame} style={{ marginTop: "0.5rem" }}>
              RESET
            </button>
          </div>
        </div>

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
                  textAlign: "center",
                }}
              >
                📍{selected.name}
              </h2>
            </div>

            <img
              // Keep your src; it will be instant because we decoded it
              src={`imagenes/escuelas/${selected.img}`}
              loading="eager"
              onError={(e) => {
                e.target.onerror = null;
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
