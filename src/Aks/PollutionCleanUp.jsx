import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./PollutionCleanup.css";

const pollutants = ["🗑️", "🚮", "🍂", "🥤", "📄", "🔋", "🧃", "🍫", "📱", "💡"];

export default function PollutionCleanup() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [polluterPositions, setPolluterPositions] = useState([]);
  const [combo, setCombo] = useState(0);
  const [showCombo, setShowCombo] = useState(false);
  const [cleanedCount, setCleanedCount] = useState(0); // ✅ true count
  const navigate = useNavigate();

  // countdown
  useEffect(() => {
    if (!gameActive || timeLeft <= 0) return;
    const t = setTimeout(() => {
      setTimeLeft((t) => t - 1); // ✅ functional
    }, 1000);
    return () => clearTimeout(t);
  }, [gameActive, timeLeft]);

  // spawner
  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(() => {
      setPolluterPositions((prev) => {
        if (prev.length >= 20) return prev;
        const newPolluter = {
          id: Date.now() + Math.random(),
          emoji: pollutants[Math.floor(Math.random() * pollutants.length)],
          x: Math.random() * 75 + 5,
          y: Math.random() * 70 + 5,
          size: Math.random() * 20 + 30,
        };
        return [...prev, newPolluter];
      });
    }, 600);
    return () => clearInterval(interval);
  }, [gameActive]);

  // stop when time runs out
  useEffect(() => {
    if (timeLeft === 0) setGameActive(false);
  }, [timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setPolluterPositions([]);
    setCombo(0);
    setCleanedCount(0);
    setShowCombo(false);
    setGameActive(true);
  };

  const cleanPollution = (id) => {
    // remove
    setPolluterPositions((prev) => prev.filter((p) => p.id !== id));
    // add score with combo bonus
    setScore((s) => {
      // use previous combo for points, then increment combo
      let nextScore;
      setCombo((c) => {
        const points = 5 + c * 2; // base 5 + combo bonus
        nextScore = s + points;
        return c + 1;
      });
      setShowCombo(true);
      setTimeout(() => setShowCombo(false), 1000);
      setCleanedCount((n) => n + 1); // ✅ accurate cleaned items
      return nextScore;
    });
  };

  const handleBackToGames = () => navigate("/games");

  if (!gameActive && timeLeft === 0) {
    return (
      <div className="pollution-game-container">
        <button onClick={handleBackToGames} className="back-button">
          ← Back to Games
        </button>

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="game-over-screen"
        >
          <div className="victory-badge">🏆</div>
          <h2>✨ Cleanup Master! ✨</h2>
          <p className="final-score">
            You earned: <span>{score} XP</span>
          </p>
          <p className="cleaned-stats">🧹 Cleaned {cleanedCount} pieces of pollution!</p>
          {combo > 5 && <p className="combo-bonus">🔥 {combo}x Combo Bonus!</p>}

          <motion.button
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="play-again-btn"
          >
            🧽 Play Again!
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pollution-game-container">
      <button onClick={handleBackToGames} className="back-button">
        ← Back to Games
      </button>

      <div className="game-header">
        <motion.h2 initial={{ y: -50 }} animate={{ y: 0 }} className="game-title">
          🧹 Pollution Cleanup
        </motion.h2>
        <p>Click on trash to clean our planet! 🌍</p>
      </div>

      {!gameActive ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="game-start-screen">
          <div className="instructions">
            <h3>🎯 How to Play:</h3>
            <ul>
              <li>⏰ 30 second time limit</li>
              <li>⭐ 5 XP per trash item + combo bonus!</li>
              <li>🔥 Build combos for extra points</li>
              <li>🚀 Click fast and accurately!</li>
            </ul>
          </div>

          <motion.button
            whileHover={{ scale: 1.1, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="start-game-btn"
          >
            🚀 Start Cleaning!
          </motion.button>
        </motion.div>
      ) : (
        <>
          <div className="game-stats-bar">
            <div className="stat-item">
              <span className="stat-icon">⏰</span>
              <span className="stat-value">{timeLeft}s</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">⭐</span>
              <span className="stat-value">{score} XP</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🧹</span>
              <span className="stat-value">{cleanedCount} cleaned</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🔥</span>
              <span className="stat-value">{combo}x Combo</span>
            </div>
          </div>

          <div className="pollution-play-area">
            <AnimatePresence>
              {polluterPositions.map((polluter) => (
                <motion.div
                  key={polluter.id}
                  className="polluter-item"
                  style={{
                    left: `${polluter.x}%`,
                    top: `${polluter.y}%`,
                    fontSize: `${polluter.size}px`,
                  }}
                  onClick={() => cleanPollution(polluter.id)}
                  whileHover={{
                    scale: 1.5,
                    rotate: [0, -10, 10, -10, 0],
                    transition: { duration: 0.3 },
                  }}
                  whileTap={{ scale: 0.8 }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{
                    scale: 2,
                    opacity: 0,
                    transition: { duration: 0.2 },
                  }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  {polluter.emoji}
                </motion.div>
              ))}
            </AnimatePresence>

            {showCombo && (
              <motion.div
                initial={{ scale: 0, y: 0 }}
                animate={{ scale: 1, y: -20 }}
                exit={{ opacity: 0 }}
                className="combo-text"
              >
                🔥 Combo {combo}x!
              </motion.div>
            )}
          </div>

          <div className="game-tips">
            <p>💡 Tip: Quick consecutive clicks build combos for bonus points!</p>
          </div>
        </>
      )}
    </div>
  );
}
