import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";      // ⬅️ added
import { useAuth } from "../AuthContext";            // ⬅️ added
import "./ProfilePage.css";

function ProfilePage() {
  const { user } = useAuth();                        // ⬅️ read from global auth
  const navigate = useNavigate();                    // ⬅️ for router navigation

  // Safe fallbacks if any field isn't set yet
  const username = user?.name || "EcoExplorer";
  const email = user?.email || "—";
  const avatar = user?.avatar ?? "🪴";               // may be emoji or image URL
  const xp = Number(user?.xp ?? 0);

  const [streak, setStreak] = useState(5);
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const achievements = [
    { icon: "🌱", title: "First Steps", desc: "Complete your first quest", unlocked: true },
    { icon: "💧", title: "Water Saver", desc: "Save 100L of water", unlocked: true },
    { icon: "🌍", title: "Global Guardian", desc: "Complete 10 challenges", unlocked: false },
    { icon: "♻️", title: "Recycling Master", desc: "Recycle 50 items", unlocked: false },
  ];

  // Default leaderboard if none is provided elsewhere
  const baseLeaderboard = [
    { name: "Aarav", avatar: "🦁", xp: 120, level: 5 },
    { name: "Meera", avatar: "🦋", xp: 110, level: 4 },
    { name: "Rohan", avatar: "🐬", xp: 95, level: 4 },
    { name: "Anika", avatar: "🌿", xp: 80, level: 3 },
    { name: "Dev", avatar: "🐢", xp: 70, level: 3 },
  ];

  // Merge the signed-in user into the sample board
  const leaderboard = useMemo(() => {
    const you = { name: username, avatar, xp, level: 1 };
    const exists = baseLeaderboard.some(p => p.name === you.name);
    return exists
      ? baseLeaderboard.map(p => (p.name === you.name ? { ...p, avatar: you.avatar, xp: Math.max(p.xp, you.xp) } : p))
      : [{ ...you }, ...baseLeaderboard];
  }, [username, avatar, xp]);

  // Helper: render emoji avatar OR image URL gracefully
  const isImageLike = typeof avatar === "string" && /^(https?:|data:|\/|\.{1,2}\/)/.test(avatar);
  // (Any URL/data-uri/path will render as <img>; otherwise we show an emoji badge)

  return (
    <div className="profile-container">
      {/* Header */}
      <motion.div
        className="profile-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {isImageLike ? (
          <img src={avatar} alt="avatar" className="profile-avatar" />
        ) : (
          <div className="profile-avatar-emoji" aria-label="avatar">{avatar}</div>  // ⬅️ emoji support
        )}

        <h1>{username}</h1>
        <p>{email}</p>

        <motion.div whileHover={{ scale: 1.1 }} className="xp-card">
          ⭐ {xp} XP
        </motion.div>

        <p className="profile-time">⏰ {time}</p>

        {/* quick nav actions */}
        <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="profile-navbtn" onClick={() => navigate("/home")}>Dashboard</button>
          <button className="profile-navbtn" onClick={() => navigate("/learn")}>Learn</button>
          <button className="profile-navbtn" onClick={() => navigate("/trivia")}>Trivia</button>
          <button className="profile-navbtn" onClick={() => navigate("/leaderboard")}>Leaderboard</button>
        </div>
      </motion.div>

      {/* Streak */}
      <motion.div
        className="streak-box"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        🔥 {streak} Day Streak!
      </motion.div>

      {/* Achievements */}
      <h2>🏆 Achievements</h2>
      <div className="achievements">
        {achievements.map((a, i) => (
          <motion.div
            key={i}
            className={`achievement ${a.unlocked ? "unlocked" : "locked"}`}
            whileHover={{ scale: 1.06 }}
          >
            <span className="icon">{a.icon}</span>
            <p><b>{a.title}</b></p>
            <p>{a.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Leaderboard */}
      <h2>📊 Leaderboard</h2>
      <div className="leaderboard">
        {leaderboard.map((player, i) => (
          <motion.div
            key={i}
            className={`leaderboard-item ${player.name === username ? "me" : ""}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            {i + 1}. {player.avatar} {player.name} — {player.xp} XP
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default ProfilePage;
// End of src/Aks/ProfilePage.jsx