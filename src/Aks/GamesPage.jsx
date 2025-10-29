// src/Aks/GamesPage.jsx
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import "./GamesPage.css";

export default function GamesPage() {
  const navigate = useNavigate();
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = React.useState(false);

  const games = [
    { id: "waste-sorting",   title: "♻️ Waste Sorter",    description: "Sort waste into recycle, compost, or trash!", color: "#4CAF50", xp: 20 },
    { id: "eco-memory",      title: "🎴 Eco Memory",      description: "Match environmental pairs!",                  color: "#2196F3", xp: 25 },
    { id: "pollution-cleanup", title: "🧹 Pollution Cleanup", description: "Clean up the polluted environment!",     color: "#FF9800", xp: 30 },
    { id: "planet-defender", title: "🛡️ Planet Defender", description: "Protect the planet from pollution!",         color: "#9C27B0", xp: 35 },
  ];

  const handleGameSelect = (gameId) => {
    // optional: setShowConfetti(true);
    navigate(`/games/${gameId}`);          // ⬅️ matches your App.jsx routes
  };

  const handleBackToHome = () => navigate("/home");

  return (
    <div className="games-page">
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={200}
          colors={["#4CAF50", "#2196F3", "#FF9800", "#9C27B0", "#67d419"]}
          recycle={false}
          onConfettiComplete={() => setShowConfetti(false)}
        />
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="games-header">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBackToHome}
          className="back-home-button"
        >
          ← Back to Home
        </motion.button>

        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="games-title"
        >
          🎮 FunTime Games
        </motion.h1>

        <motion.p
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="games-subtitle"
        >
          Play eco-games and earn XP points! 🌟
        </motion.p>
      </motion.div>

      <div className="games-website-layout">
        <div className="games-grid">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1 + 0.6, duration: 0.5 }}
              whileHover={{ scale: 1.05, rotate: [0, -2, 2, -2, 0] }}
              whileTap={{ scale: 0.95 }}
              className="game-card"
              style={{
                borderTop: `4px solid ${game.color}`,
                // 8-digit hex for subtle tint: #RRGGBBAA
                background: `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, ${game.color}15 100%)`,
              }}
            >
              <motion.div
                className="game-icon"
                animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                {game.title.split(" ")[0]}
              </motion.div>

              <h3>{game.title}</h3>
              <p>{game.description}</p>

              <motion.div
                className="xp-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.8 }}
              >
                +{game.xp} XP
              </motion.div>

              <button className="play-now-btn" onClick={() => handleGameSelect(game.id)}>
                Play Now →
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div className="games-footer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.6 }}>
        <p>🎯 Complete games to earn XP and level up your eco-profile!</p>
        <p>💡 Each game teaches important environmental lessons!</p>
      </motion.div>

      {/* decorative */}
      <div className="floating-emojis">
        <span className="floating-emoji">🌍</span>
        <span className="floating-emoji">🌱</span>
        <span className="floating-emoji">💧</span>
        <span className="floating-emoji">♻️</span>
        <span className="floating-emoji">🌞</span>
        <span className="floating-emoji">🌳</span>
      </div>
    </div>
  );
}
// End of src/Aks/GamesPage.jsx