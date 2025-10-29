import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { useAuth } from "../AuthContext";     // ⬅️ use auth
import "./HomePage.css";

/* ---------------- Mock data (local-only) ---------------- */
const leaderboard = [
  { name: "Aarav", avatar: "🦁", xp: 120, level: 5 },
  { name: "Meera", avatar: "🦋", xp: 110, level: 4 },
  { name: "Rohan", avatar: "🐬", xp: 95, level: 4 },
  { name: "Anika", avatar: "🌿", xp: 80, level: 3 },
  { name: "Dev", avatar: "🐢", xp: 70, level: 3 },
];

const achievements = [
  { id: 1, icon: "🌱", title: "First Steps", description: "Complete your first quest", unlocked: true },
  { id: 2, icon: "💧", title: "Water Saver", description: "Save 100L of virtual water", unlocked: true },
  { id: 3, icon: "🌍", title: "Global Guardian", description: "Complete 10 challenges", unlocked: false },
  { id: 4, icon: "♻️", title: "Recycling Master", description: "Recycle 50 items", unlocked: false },
];

const dailyQuests = [
  { id: 1, title: "Carbon Footprint Quiz", xp: 15, completed: true },
  { id: 2, title: "Recycling Challenge", xp: 20, completed: false },
  { id: 3, title: "Eco Tip Sharing", xp: 10, completed: false },
];

/* ---------------- Small subcomponents ---------------- */
function Leaderboard() {
  return (
    <div className="leaderboard-card">
      <h3>🏆 Leaderboard</h3>
      <ul className="leaderboard-list">
        {leaderboard.map((entry, idx) => (
          <li key={idx} className="leaderboard-entry">
            <span className="leaderboard-rank">{idx + 1}.</span>
            <span className="leaderboard-avatar">{entry.avatar}</span>
            <span className="leaderboard-name">{entry.name}</span>
            <span className="leaderboard-xp">{entry.xp} XP</span>
            <span className="leaderboard-level">Lvl {entry.level}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AchievementsSection() {
  return (
    <div className="achievements-card">
      <h3>🏅 Achievements</h3>
      <ul className="achievements-list">
        {achievements.map((ach) => (
          <li key={ach.id} className={ach.unlocked ? "achievement-unlocked" : "achievement-locked"}>
            <span className="achievement-icon">{ach.icon}</span>
            <span className="achievement-title">{ach.title}</span>
            <span className="achievement-desc">{ach.description}</span>
            {ach.unlocked ? <span className="achievement-status">Unlocked</span> : <span className="achievement-status">Locked</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DailyQuests() {
  return (
    <div className="daily-quests-card">
      <h3>🗓️ Daily Quests</h3>
      <ul className="daily-quests-list">
        {dailyQuests.map((quest) => (
          <li key={quest.id} className={quest.completed ? "quest-completed" : "quest-active"}>
            <span className="quest-title">{quest.title}</span>
            <span className="quest-xp">+{quest.xp} XP</span>
            {quest.completed && <span className="quest-status">✔</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- Navigation Bar ---------------- */
function NavigationBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "Dashboard",  path: "/home",       icon: "📊" },
    { name: "Leaderboard",path: "/leaderboard", icon: "🏆" },
    { name: "FunTime",    path: "/games",      icon: "🎮" },
    { name: "Quizzes",    path: "/trivia",     icon: "📝" },   // ⬅️ fixed route
    { name: "ECOSSiST",   path: "/assistant",  icon: "🤖" },   // ⬅️ fixed route
    { name: "Learn",      path: "/learn",      icon: "📚" },
    { name: "Profile",    path: "/profile",    icon: "👤" },
  ];

  return (
    <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className="website-nav">
      <div className="nav-brand" onClick={() => navigate("/home")}>
        <span className="logo-icon">🌍</span>
        <h2>EcoQuest</h2>
      </div>

      <div className="nav-items">
        {navItems.map((item) => (
          <motion.button
            key={item.name}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.name}
          </motion.button>
        ))}
      </div>

      <div className="nav-user">
        <span className="user-avatar">🪴</span>
        <span className="user-xp">+10 XP</span>
      </div>
    </motion.nav>
  );
}

/* ---------------- Misc subcomponents ---------------- */
function ProgressBar({ progress, maxProgress, level }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="progress-container"
    >
      <div className="progress-header">
        <span className="level-badge">Level {level}</span>
        <span className="xp-count">
          {progress} / {maxProgress} XP
        </span>
      </div>
      <div className="progress-bar">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(progress / maxProgress) * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="progress-fill"
        />
      </div>
    </motion.div>
  );
}

function ProfileCard({ name, avatar, xp, badges, level }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
      whileHover={{ y: -5 }}
      className="profile-card"
    >
      <motion.div
        animate={{ rotate: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="profile-avatar"
      >
        {avatar}
      </motion.div>

      <h2>{name}</h2>

      <div className="level-badge-large">Level {level} Explorer</div>

      <div className="xp-display">
        <span>{xp}</span> XP
      </div>

      {badges && badges.length > 0 && (
        <div className="badges-container">
          {badges.map((badge, index) => (
            <motion.span key={index} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: index * 0.1 }} className="badge">
              {badge}
            </motion.span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function DashboardGrid({ user }) {
  return (
    <div className="dashboard-grid">
      <div className="dashboard-column">
        <ProfileCard name={user.name} avatar={user.avatar} xp={user.xp} badges={user.badges} level={user.level} />
        <ProgressBar progress={user.xp} maxProgress={100} level={user.level} />
      </div>

      <div className="dashboard-column">
        <Leaderboard />
        <DailyQuests />
      </div>

      <div className="dashboard-column">
        <AchievementsSection />
        <CommunityStats />
      </div>
    </div>
  );
}

function CommunityStats() {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="stats-card">
      <h3>🌍 Community Impact</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-number">1,247</div>
          <div className="stat-label">Trees Saved</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">5,892</div>
          <div className="stat-label">Quizzes Completed</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">892</div>
          <div className="stat-label">Active Users</div>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------- Main Page ---------------- */
export default function HomePage() {
  const { width, height } = useWindowSize();
  const location = useLocation();
  const { user: authUser } = useAuth();

  // values passed from SignUpPage via navigate(..., { state: {...} })
  const fromSignup = Boolean(location.state?.fromSignup);
  const signupName = location.state?.username;
  const signupAvatar = location.state?.avatar;

  const displayUser = {
    name: authUser?.name ?? signupName ?? "EcoExplorer",
    avatar: authUser?.avatar ?? signupAvatar ?? "🪴",
    xp: fromSignup ? 10 : authUser?.xp ?? 0,
    badges: fromSignup ? ["🌟"] : authUser?.badges ?? [],
    level: authUser?.level ?? 1,
  };

  const [showConfetti, setShowConfetti] = useState(fromSignup);

  useEffect(() => {
    if (fromSignup) {
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [fromSignup]);

  return (
    <div className="website-container">
      <AnimatePresence>
        {showConfetti && (
          <Confetti width={width} height={height} numberOfPieces={100} colors={["#67d419", "#0cfc44", "#3ca65a", "#32af7a"]} />
        )}
      </AnimatePresence>

      <NavigationBar />

      <main className="website-main">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }} className="welcome-banner">
          <h1>Welcome to EcoQuest, {displayUser.name}!</h1>
          <p>Start your journey to become an eco-hero today</p>
          {fromSignup && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="signup-bonus">
              🎉 +10 XP Signup Bonus!
            </motion.div>
          )}
        </motion.div>

        <DashboardGrid user={displayUser} />
      </main>
    </div>
  );
}
