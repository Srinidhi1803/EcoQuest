import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";     // ⬅️ added
import { useAuth } from "./AuthContext";            // ⬅️ added
import "./LeaderBoard.css";

/* ───────────────── Mock Data (unchanged structure) ───────────────── */
const MOCK_STUDENTS = [
  { id: 1, name: "Srinidhi",  className: "10-A", school: "Kennedy",        xp: 3120, avatarColor: "#16a34a" },
  { id: 2, name: "Mitesh",    className: "10-A", school: "Kennedy",        xp: 2890, avatarColor: "#2563eb" },
  { id: 3, name: "Aakanksha", className: "9-B",  school: "Kennedy",        xp: 1980, avatarColor: "#f59e0b" },
  { id: 4, name: "Lalith",    className: "9-B",  school: "Little Angels",  xp: 2440, avatarColor: "#ef4444" },
  { id: 5, name: "Spandhan",  className: "10-A", school: "Little Angels",  xp: 3310, avatarColor: "#a855f7" },
  { id: 6, name: "Rupak",     className: "8-C",  school: "Little Angels",  xp: 1730, avatarColor: "#0ea5e9" },
  { id: 7, name: "Zoya I.",   className: "10-A", school: "Silver Oaks",    xp: 2650, avatarColor: "#14b8a6" },
  { id: 8, name: "Kabir T.",  className: "9-B",  school: "Silver Oaks",    xp: 2205, avatarColor: "#f97316" },
  { id: 9, name: "Meera P.",  className: "9-B",  school: "Kennedy",        xp: 1980, avatarColor: "#10b981" },
];

/* ───────────────── Helpers ───────────────── */
const rankByXP = (items) =>
  [...items].sort((a, b) => b.xp - a.xp).map((s, i) => ({ ...s, rank: i + 1 }));

function ProgressBar({ xp }) {
  const pct = Math.min(100, Math.round((xp % 1000) / 10)); // progress within current 1k
  return (
    <div className="progress">
      <div className="progress__fill" style={{ width: pct + "%" }} />
    </div>
  );
}

/* eco avatar icons (SVG) */
const EcoIcons = [
  // butterfly
  ({ color="#ffffff" }) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
      <path d="M8 7c-2 0-4 2-4 4 0 2 2 3 4 3 1 0 2-.5 3-1.2V8C10 7.4 9 7 8 7Z" fill={color}/>
      <path d="M16 7c2 0 4 2 4 4 0 2-2 3-4 3-1 0-2-.5-3-1.2V8c0-.6 1-1 3-1Z" fill={color}/>
      <circle cx="12" cy="9.5" r="1.2" fill={color}/>
      <path d="M11.7 10.8c-.5 1.6-1.3 3.5-2.7 5.2m3.3-5.2c.5 1.6 1.3 3.5 2.7 5.2" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  // leaf
  ({ color="#ffffff" }) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
      <path d="M20 4c-6 1-11 4-14 9-1 2-2 5 1 6 2 1 5-1 6-3 4-3 6-7 7-12Z" fill={color}/>
      <path d="M7 16c3-3 6-5 10-6" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
  // bird
  ({ color="#ffffff" }) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
      <path d="M3 13c4-2 6-6 9-6 2 0 3 1 6 1-1 2-2 4-4 5-3 2-6 3-11 2 0 0 1-1 0-2Z" fill={color}/>
      <circle cx="16.5" cy="9" r="1.1" fill="#0a0a0a"/>
    </svg>
  ),
  // sprout
  ({ color="#ffffff" }) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
      <path d="M12 20v-6" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M12 14c2-4 6-5 9-4-1 3-4 5-9 4Z" fill={color}/>
      <path d="M12 14c-2-4-6-5-9-4 1 3 4 5 9 4Z" fill={color}/>
    </svg>
  ),
  // water drop
  ({ color="#ffffff" }) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
      <path d="M12 3c3 4 6 7 6 11a6 6 0 1 1-12 0c0-4 3-7 6-11Z" fill={color}/>
      <path d="M9 16c.5 1 1.5 2 3 2" stroke="#0a0a0a" strokeOpacity=".15" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
];

function EcoAvatar({ color, index = 0 }) {
  const Icon = EcoIcons[index % EcoIcons.length];
  return (
    <div className="avatar" style={{ background: color }}>
      <Icon color="#ffffff" />
    </div>
  );
}

/* medals & badges */
function Medal({ rank }) {
  if (rank === 1) return <span className="medal gold" title="Rank 1">🥇</span>;
  if (rank === 2) return <span className="medal silver" title="Rank 2">🥈</span>;
  if (rank === 3) return <span className="medal bronze" title="Rank 3">🥉</span>;
  return <span className="medal rankchip">#{rank}</span>;
}

function XPBadge({ xp }) {
  return (
    <div className="xpBadge" title={`${xp.toLocaleString()} XP`}>
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
        <path fill="currentColor" d="M11.99 2l2.39 4.84 5.34.78-3.86 3.76.91 5.31-4.78-2.51-4.78 2.51.91-5.31L4.26 7.62l5.34-.78L11.99 2z"/>
      </svg>
      <span>{xp.toLocaleString()} XP</span>
    </div>
  );
}

/* row/podium */
const rowVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  show:   { opacity: 1, y: 0, scale: 1, transition: { duration: 0.28, ease: "easeOut" } },
};

function Row({ s, isMe }) {
  return (
    <motion.div className={`row ${isMe ? "me" : ""}`} variants={rowVariants}>
      <div className="row__left">
        <Medal rank={s.rank} />
      </div>

      <EcoAvatar color={s.avatarColor} index={s.id} />

      <div className="row__info">
        <div className="row__name">
          {s.name} {isMe && <span className="youchip">You</span>}
        </div>
        <div className="row__meta">Class {s.className} · {s.school}</div>
      </div>

      <div className="row__xp">
        <XPBadge xp={s.xp} />
        <ProgressBar xp={s.xp} />
      </div>
    </motion.div>
  );
}

function PodiumCard({ s, isMe }) {
  return (
    <motion.div
      className={`podium ${["","first","second","third"][s.rank] || ""} ${isMe ? "me" : ""}`}
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <div className="podium__medal"><Medal rank={s.rank} /></div>
      <EcoAvatar color={s.avatarColor} index={s.id} />
      <div className="podium__name">
        {s.name} {isMe && <span className="youchip">You</span>}
      </div>
      <div className="podium__meta">Class {s.className} · {s.school}</div>
      <XPBadge xp={s.xp} />
    </motion.div>
  );
}

/* ───────────────── Page ───────────────── */
export default function LeaderBoard() {
  const [mode, setMode] = useState("class");
  const navigate = useNavigate();           // ⬅️ added
  const { user } = useAuth();               // ⬅️ added

  // Merge the signed-in user into the dataset so they appear (with their XP).
  const baseData = useMemo(() => {
    if (!user) return MOCK_STUDENTS;
    const you = {
      id: "me",
      name: user.name || "You",
      className: user.className || "10-A",
      school: user.school || "Your School",
      xp: Number(user.xp || 0),
      avatarColor: "#0ea5e9",
    };
    // If a student with same name already exists, keep the higher XP for visibility.
    const exists = MOCK_STUDENTS.some(s => s.name === you.name);
    return exists
      ? MOCK_STUDENTS.map(s => (s.name === you.name ? { ...s, xp: Math.max(s.xp, you.xp) } : s))
      : [...MOCK_STUDENTS, you];
  }, [user]);

  const classes = useMemo(() => Array.from(new Set(baseData.map(s => s.className))), [baseData]);
  const schools = useMemo(() => Array.from(new Set(baseData.map(s => s.school))), [baseData]);

  const [selectedClass, setSelectedClass] = useState(classes[0] || "");
  const [selectedSchool, setSelectedSchool] = useState(schools[0] || "");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const src = baseData;
    const base = mode === "class"
      ? src.filter(s => s.className === selectedClass)
      : src.filter(s => s.school === selectedSchool);

    const byName = query.trim()
      ? base.filter(s => s.name.toLowerCase().includes(query.toLowerCase()))
      : base;

    return rankByXP(byName);
  }, [mode, selectedClass, selectedSchool, query, baseData]);

  const podium = filtered.slice(0, 3);
  const rest   = filtered.slice(3);

  const isMe = (s) => (user ? (s.id === "me" || s.name === (user.name || "You")) : false);

  return (
    <div className="eco-leaderboard full">
      <div className="eco-bg" aria-hidden />
      <div className="eco-leaves" aria-hidden>{Array.from({length:16}).map((_,i)=><span key={i} style={{'--i':i}}/>)}</div>

      <div className="wrap wide">
        <header className="header">
          <h1>Eco Leaderboard</h1>
          <p className="tagline">
            Friendly competition that reinforces real-world eco-actions:
            waste segregation, water saving, tree planting, and more.
          </p>

          {/* Quick nav actions (router-based, no reloads) */}
          <div className="quicknav">
            <button onClick={() => navigate("/home")}>Dashboard</button>
            <button onClick={() => navigate("/learn")}>Learn</button>
            <button onClick={() => navigate("/trivia")}>Play Trivia</button>
          </div>

          <div className="modes">
            <button className={mode==="class" ? "active" : ""} onClick={() => setMode("class")}>Class-wise</button>
            <button className={mode==="school" ? "active" : ""} onClick={() => setMode("school")}>School-wise</button>

            {mode === "class" ? (
              <select value={selectedClass} onChange={e=>setSelectedClass(e.target.value)}>
                {classes.map(c => <option key={c}>{c}</option>)}
              </select>
            ) : (
              <select value={selectedSchool} onChange={e=>setSelectedSchool(e.target.value)}>
                {schools.map(s => <option key={s}>{s}</option>)}
              </select>
            )}

            <div className="search">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden><circle cx="11" cy="11" r="7" stroke="currentColor" fill="none"/><path d="M21 21l-4.3-4.3" stroke="currentColor" fill="none"/></svg>
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by name…" />
            </div>
          </div>
        </header>

        {/* Podium */}
        <section className="podiumRow wide">
          <AnimatePresence initial={false}>
            {podium.map(p => <PodiumCard key={p.id} s={p} isMe={isMe(p)} />)}
          </AnimatePresence>
        </section>

        {/* List */}
        <motion.section
          className="list"
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.06 }}
        >
          {rest.length === 0 && filtered.length === 0 && (
            <div className="empty">No students found.</div>
          )}
          {rest.map(s => <Row key={s.id} s={s} isMe={isMe(s)} />)}
        </motion.section>

        <footer className="footnote">
          Built for experiential sustainability learning (NEP 2020 / SDGs): points, streaks, and badges encourage daily eco-habits.
        </footer>
      </div>
    </div>
  );
}
// End of src/LeaderBoard.jsx