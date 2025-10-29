import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./WasteSortingGame.css";

const wasteItems = [
  { id: 1, name: "Apple Core", type: "compost", emoji: "🍎", fact: "Food waste creates methane gas in landfills!" },
  { id: 2, name: "Plastic Bottle", type: "recycle", emoji: "🧴", fact: "Plastic can take 450 years to decompose!" },
  { id: 3, name: "Pizza Box", type: "trash", emoji: "🍕", fact: "Greasy cardboard can't be recycled!" },
  { id: 4, name: "Glass Jar", type: "recycle", emoji: "🥫", fact: "Glass is 100% recyclable forever!" },
  { id: 5, name: "Banana Peel", type: "compost", emoji: "🍌", fact: "Fruit peels make great compost!" },
  { id: 6, name: "Chip Bag", type: "trash", emoji: "🥖", fact: "Multi-layer packaging is hard to recycle!" },
  { id: 7, name: "Newspaper", type: "recycle", emoji: "📰", fact: "Paper can be recycled 5-7 times!" },
  { id: 8, name: "Coffee Grounds", type: "compost", emoji: "☕", fact: "Coffee grounds are rich in nitrogen!" },
  { id: 9, name: "Battery", type: "trash", emoji: "🔋", fact: "Batteries contain toxic chemicals!" },
  { id: 10, name: "Cardboard", type: "recycle", emoji: "📦", fact: "Cardboard recycling saves trees!" },
  { id: 11, name: "Egg Shells", type: "compost", emoji: "🥚", fact: "Eggshells add calcium to compost!" },
  { id: 12, name: "Styrofoam", type: "trash", emoji: "🧊", fact: "Styrofoam never fully decomposes!" },
  { id: 13, name: "Aluminum Can", type: "recycle", emoji: "🥫", fact: "Aluminum can be recycled infinitely!" },
  { id: 14, name: "Tea Leaves", type: "compost", emoji: "🍃", fact: "Tea leaves enrich soil quality!" },
  { id: 15, name: "Plastic Wrap", type: "trash", emoji: "🧻", fact: "Plastic film clogs recycling machines!" }
];

export default function WasteSortingGame() {
  const [score, setScore] = useState(0);
  const [currentItem, setCurrentItem] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [itemsSorted, setItemsSorted] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [usedItems, setUsedItems] = useState(new Set());
  const [combo, setCombo] = useState(0);
  const [showFact, setShowFact] = useState(false);
  const navigate = useNavigate();

  const startGame = () => {
    setScore(0);
    setItemsSorted(0);
    setGameOver(false);
    setFeedback("");
    setUsedItems(new Set());
    setCombo(0);
    setShowFact(false);
    nextItem();
  };

  const getRandomItem = () => {
    const availableItems = wasteItems.filter(item => !usedItems.has(item.id));
    if (availableItems.length === 0) {
      setUsedItems(new Set());
      return wasteItems[Math.floor(Math.random() * wasteItems.length)];
    }
    const randomIndex = Math.floor(Math.random() * availableItems.length);
    const selectedItem = availableItems[randomIndex];
    setUsedItems(prev => {
      const n = new Set(prev);
      n.add(selectedItem.id);
      return n;
    });
    return selectedItem;
  };

  const nextItem = () => {
    if (itemsSorted >= 10) {
      setGameOver(true);
      return;
    }
    const randomItem = getRandomItem();
    setCurrentItem(randomItem);
    setShowFact(false);
  };

  const handleSort = (selectedType) => {
    if (!currentItem) return;
    const isCorrect = currentItem.type === selectedType;

    if (isCorrect) {
      const points = 10 + combo * 2; // base 10 + combo bonus
      setScore(prev => prev + points);          // ✅ functional update
      setCombo(prev => prev + 1);
      setFeedback(`✅ Correct! +${points} XP ${combo > 0 ? `(Combo ${combo}x!)` : ""}`);
    } else {
      setCombo(0);
      setFeedback("❌ Try again!");
    }

    setTimeout(() => {
      setFeedback("");
      setItemsSorted(prev => {
        const n = prev + 1;                     // ✅ functional update
        if (n >= 10) {
          setGameOver(true);
        } else {
          setShowFact(true);
          setTimeout(nextItem, 2000);           // show fact for 2s, then next
        }
        return n;
      });
    }, 1000);
  };

  const handleBackToGames = () => navigate("/games");

  if (gameOver) {
    return (
      <div className="game-container">
        <button onClick={handleBackToGames} className="back-button">
          ← Back to Games
        </button>

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="game-over"
        >
          <div className="trophy">🏆</div>
          <h2>🎉 Recycling Champion! 🎉</h2>
          <p className="final-score">You earned: <span>{score} XP</span></p>
          <p className="stats">✅ {itemsSorted} items sorted correctly!</p>
          {combo > 3 && <p className="combo-achievement">🔥 Max Combo: {combo}x!</p>}

          <motion.button
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="play-again-btn"
          >
            ♻️ Play Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (!currentItem) {
    return (
      <div className="game-container">
        <button onClick={handleBackToGames} className="back-button">
          ← Back to Games
        </button>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="game-start">
          <div className="game-icon">♻️</div>
          <h2>Waste Sorting Game</h2>
          <p className="game-description">Sort 10 items correctly to earn up to 100 XP!</p>

          <div className="instructions">
            <h3>🎯 How to Play:</h3>
            <div className="instruction-item">
              <span className="bin-demo compost-demo">🍃</span>
              <span>Compost - Food & organic waste</span>
            </div>
            <div className="instruction-item">
              <span className="bin-demo recycle-demo">♻️</span>
              <span>Recycle - Paper, plastic, glass</span>
            </div>
            <div className="instruction-item">
              <span className="bin-demo trash-demo">🗑️</span>
              <span>Trash - Non-recyclables</span>
            </div>
            <p className="combo-tip">🔥 Build combos for bonus points!</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.1, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="start-btn"
          >
            🚀 Start Sorting!
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <button onClick={handleBackToGames} className="back-button">
        ← Back to Games
      </button>

      <div className="game-header">
        <div className="score-display">
          <span className="score-icon">⭐</span>
          <span className="score-value">{score} XP</span>
        </div>
        <div className="progress-display">
          <span className="progress-icon">📦</span>
          <span className="progress-value">{itemsSorted}/10</span>
        </div>
        <div className="combo-display">
          <span className="combo-icon">🔥</span>
          <span className="combo-value">{combo}x</span>
        </div>
      </div>

      <motion.div
        initial={{ scale: 0, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        key={currentItem.id}
        className="current-item-card"
      >
        <span className="item-emoji">{currentItem.emoji}</span>
        <h3 className="item-name">{currentItem.name}</h3>
        <p className="item-type-hint">Which bin does this belong in?</p>
      </motion.div>

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className={`feedback ${feedback.includes("✅") ? "correct" : "incorrect"}`}
          >
            {feedback}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFact && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="fact-card"
          >
            <span className="fact-icon">💡</span>
            <p className="fact-text">{currentItem.fact}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bins-container">
        <motion.div
          whileHover={{ scale: 1.08, y: -5 }}
          whileTap={{ scale: 0.95 }}
          className="bin compost-bin"
          onClick={() => handleSort("compost")}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="bin-emoji">🍃</span>
          <h3 className="bin-title">Compost</h3>
          <p className="bin-description">Food waste, plants, organic materials</p>
          <div className="bin-examples">
            <span>🍎</span>
            <span>🍌</span>
            <span>☕</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.08, y: -5 }}
          whileTap={{ scale: 0.95 }}
          className="bin recycle-bin"
          onClick={() => handleSort("recycle")}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="bin-emoji">♻️</span>
          <h3 className="bin-title">Recycle</h3>
          <p className="bin-description">Paper, plastic, glass, metal</p>
          <div className="bin-examples">
            <span>🧴</span>
            <span>📰</span>
            <span>📦</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.08, y: -5 }}
          whileTap={{ scale: 0.95 }}
          className="bin trash-bin"
          onClick={() => handleSort("trash")}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="bin-emoji">🗑️</span>
          <h3 className="bin-title">Trash</h3>
          <p className="bin-description">Non-recyclables, contaminated items</p>
          <div className="bin-examples">
            <span>🍕</span>
            <span>🥖</span>
            <span>🔋</span>
          </div>
        </motion.div>
      </div>

      <div className="game-tips">
        <p>💡 Quick tip: {currentItem.fact}</p>
      </div>
    </div>
  );
}
