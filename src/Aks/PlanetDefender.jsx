import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function PlanetDefender({ onGameComplete }) {
  const [gameStarted, setGameStarted] = useState(false);
  const nav = useNavigate();

  const handleMockComplete = () => {
    // mock XP toast/alert; replace with real XP update later
    alert("🎉 Eco Victory! (+35 XP)");
    if (onGameComplete) onGameComplete();
    else nav("/games"); // go back to games hub if no callback provided
  };

  return (
    <div className="game-container">
      {/* scoped styles so this page works without extra CSS files */}
      <style>{`
        .game-container {
          min-height: 100vh;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #f8fff9 0%, #e8f5e9 100%);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 24px;
        }
        .planet-defender-intro {
          width: min(720px, 96vw);
          background: #fff;
          border: 1px solid #e3f2ea;
          border-radius: 20px;
          box-shadow: 0 8px 28px rgba(0,0,0,0.08);
          padding: 24px 22px;
          text-align: center;
        }
        .planet-defender-intro h2 {
          margin: 0 0 6px;
          color: #225b37;
          font-size: 2rem;
        }
        .planet-defender-intro p { color: #4b6a5a; margin: 0.25rem 0 1rem; }
        .game-start { display: grid; gap: 12px; }
        .game-features {
          display: grid; gap: 6px;
          background: #f5fff8; border: 1px solid #dff3e6;
          border-radius: 12px; padding: 12px;
          color: #305a45; font-weight: 600;
        }
        .start-btn, .celebrate-btn, .back-btn {
          border: none; cursor: pointer; font-weight: 700;
          padding: 12px 16px; border-radius: 12px;
        }
        .start-btn {
          background: linear-gradient(90deg,#1db954 60%,#67d419 100%);
          color: #fff;
        }
        .celebrate-btn {
          background: linear-gradient(90deg, #67d419 0%, #1db954 100%);
          color: #fff; margin-top: 10px;
        }
        .back-btn {
          background: #e8f5e9; color: #225b37; margin-top: 8px;
          border: 1px solid #cfe7d8;
        }
        .game-demo { display: grid; gap: 8px; }
        .planet-visual {
          font-size: 4rem; filter: drop-shadow(0 6px 18px rgba(0,0,0,.15));
          margin: 8px auto 4px;
        }
      `}</style>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="planet-defender-intro">
        <h2>🛡️ Planet Defender</h2>
        <p>Protect our planet from pollution invaders!</p>

        {!gameStarted ? (
          <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="game-start">
            <div className="game-features">
              <p>⭐ Defend against pollution</p>
              <p>⭐ Earn 35 XP per level</p>
              <p>⭐ Save the environment</p>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }} onClick={() => setGameStarted(true)} className="start-btn">
              🚀 Launch Game
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => nav("/games")} className="back-btn">
              ← Back to Games
            </motion.button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="game-demo">
            <div className="planet-visual">🌍</div>
            <p>Game loading... Coming soon!</p>
            <p>In the meantime, celebrate your eco-spirit!</p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }} onClick={handleMockComplete} className="celebrate-btn">
              🎉 Celebrate Eco Victory!
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => nav("/games")} className="back-btn">
              ← Back to Games
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
