import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";       // ⬅️ added
import "./EcoMemory.css";

const cardItems = [
  { id: 1, emoji: "🌍", name: "Earth" },
  { id: 2, emoji: "🌱", name: "Seed" },
  { id: 3, emoji: "💧", name: "Water" },
  { id: 4, emoji: "♻️", name: "Recycle" },
  { id: 5, emoji: "🌞", name: "Sun" },
  { id: 6, emoji: "🌳", name: "Tree" }
];

export default function EcoMemory({ onGameComplete }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const nav = useNavigate();                               // ⬅️ added

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (solved.length === cards.length && cards.length > 0) {
      setTimeout(() => {
        if (onGameComplete) onGameComplete();
        setGameOver(true);
      }, 600);
    }
  }, [solved, cards.length, onGameComplete]);

  const initializeGame = () => {
    const gameCards = [...cardItems, ...cardItems]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, uniqueId: index }));
    
    setCards(gameCards);
    setFlipped([]);
    setSolved([]);
    setMoves(0);
    setGameOver(false);
  };

  const handleCardClick = (uniqueId) => {
    if (flipped.length === 2 || flipped.includes(uniqueId) || solved.includes(uniqueId)) return;

    const newFlipped = [...flipped, uniqueId];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find(card => card.uniqueId === firstId);
      const secondCard = cards.find(card => card.uniqueId === secondId);

      if (firstCard.id === secondCard.id) {
        setSolved((prev) => [...prev, firstId, secondId]);
      }

      setTimeout(() => setFlipped([]), 600);
    }
  };

  const earnedXP = Math.max(10, 60 - moves * 2);

  if (gameOver) {
    return (
      <div className="game-container">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="game-over"
        >
          <h2>🎉 Memory Master!</h2>
          <p className="final-score">Completed in {moves} moves</p>
          <p>✨ Earned {earnedXP} XP!</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 10 }}>
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              onClick={initializeGame}
              className="play-again-btn"
            >
              🔄 Play Again
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => nav("/games")}         // ⬅️ back to hub
              className="back-games-btn"
            >
              ← Back to Games
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="header-left">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => nav("/games")}          // ⬅️ back to hub
            className="back-games-btn"
          >
            ← Back to Games
          </motion.button>
        </div>
        <div className="header-center">
          <h2>🎴 Eco Memory Match</h2>
        </div>
        <div className="header-right">
          <div className="game-stats">
            <span>Moves: {moves}</span>
            <span>Pairs: {solved.length / 2}/6</span>
            <button className="reset-btn" onClick={initializeGame}>Reset</button>
          </div>
        </div>
      </div>

      <div className="memory-grid">
        {cards.map((card) => (
          <motion.div
            key={card.uniqueId}
            className={`memory-card ${flipped.includes(card.uniqueId) || solved.includes(card.uniqueId) ? 'flipped' : ''}`}
            onClick={() => handleCardClick(card.uniqueId)}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
            layout
          >
            <div className="card-front">?</div>
            <div className="card-back">
              <span className="card-emoji">{card.emoji}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
