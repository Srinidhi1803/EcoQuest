// src/EcoQuestLanding.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Squares from "./Squares";
import { useAuth } from "./AuthContext";

// ✅ styles unchanged
const styles = {
  page: {
    position: "relative",
    width: "100%",
    minHeight: "100dvh",
    overflowX: "hidden",
    background: "linear-gradient(135deg, #2e7d32, #1b5e20)",
    cursor: "default",
    fontFamily:
      "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'",
    color: "#e8ffee",
  },
  gradient: {
    position: "fixed",
    inset: 0,
    background:
      "radial-gradient(800px 480px at 65% 18%, rgba(29,185,84,0.10), transparent 60%), radial-gradient(600px 360px at 20% 80%, rgba(16,185,129,0.10), transparent 60%)",
    pointerEvents: "none",
    zIndex: 1,
  },
  gridOverlay: {
    position: "fixed",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
    backgroundSize: "36px 36px, 36px 36px",
    pointerEvents: "none",
    zIndex: 1,
  },
  hero: { position: "relative", height: "100dvh", cursor: "pointer", zIndex: 3 },
  center: {
    position: "relative",
    height: "100%",
    display: "grid",
    placeItems: "center",
    textAlign: "center",
    padding: 24,
  },
  logoWrap: { display: "grid", gap: 12, placeItems: "center", pointerEvents: "none" },
  logo: {
    display: "grid",
    placeItems: "center",
    width: 96,
    height: 96,
    borderRadius: 20,
    background: "linear-gradient(180deg, #0b5f3a, #052e1b)",
    boxShadow: "0 8px 40px rgba(22, 163, 74, 0.35), inset 0 0 0 1px #0f3d2a",
  },
  title: {
    fontFamily: "Bitcount Grid Double",
    margin: 7,
    fontSize: "175px",
    fontWeight: 300,
    color: "#e4eee5ff",
    textShadow: "15px 10px 10px rgba(0,0,0,0.35)",
    transform: "translateY(-9px)",
  },
  typingCursor: { display: "inline-block", marginLeft: "1px", position: "relative", top: "0em" },
  subtitle: {
    margin: 0,
    maxWidth: 760,
    lineHeight: 1.35,
    fontSize: "clamp(14px, 2.3vw, 20px)",
    color: "#d7e7daff",
    opacity: 0.95,
  },
  entryHint: {
    position: "absolute",
    bottom: "12vh",
    left: "50%",
    transform: "translateX(-50%)",
    color: "#b9f6c5",
    fontSize: 18,
    fontWeight: 400,
    opacity: 0.85,
    cursor: "pointer",
    textAlign: "center",
    zIndex: 4,
    pointerEvents: "auto",
  },
  cornerTL: { position: "absolute", top: 12, left: 12, zIndex: 4, pointerEvents: "none" },
  badge: {
    background: "#0ea75a",
    color: "#052e1b",
    fontWeight: 800,
    fontSize: 12,
    padding: "6px 10px",
    borderRadius: 999,
    boxShadow: "0 4px 14px rgba(14,167,90,0.4)",
  },
  leafLayer: { position: "fixed", inset: 0, zIndex: 2, pointerEvents: "none", overflow: "hidden" },
  sections: {
    fontFamily: "Advent Pro",
    position: "relative",
    zIndex: 3,
    padding: "8vh 24px 10vh",
    maxWidth: 1300,
    margin: "0 auto",
  },
  section: {
    background: "linear-gradient(180deg, rgba(18,61,38,0.60), rgba(9,40,25,0.55))",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: "28px 32px 32px",
    marginBottom: "32px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.06)",
    backdropFilter: "blur(6px) saturate(115%)",
  },
  kicker: {
    fontFamily: "Advent Pro",
    fontSize: "22px",
    fontWeight: 800,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: "#a2f3b0",
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: "Advent Pro",
    margin: "6px 0 10px",
    fontSize: "clamp(28px, 4.6vw, 52px)",
    fontWeight: 800,
    letterSpacing: 0.4,
    color: "#eafbea",
  },
  sectionBody: {
    fontFamily: "Advent Pro",
    fontSize: "20px",
    margin: "8px 0",
    color: "#e8ffee",
    opacity: 0.95,
    lineHeight: 1.6,
  },
  list: { margin: "10px 0 4px 18px" },
  listItem: { margin: "6px 0", color: "#d7ffe0" },
  statbar: { marginTop: 14, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 },
  stat: {
    background: "rgba(0,0,0,0.25)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 14,
    padding: "12px 14px",
    textAlign: "center",
  },
  statValue: { fontSize: 18, fontWeight: 800, color: "#d8ffdc" },
  statLabel: { fontSize: 14, color: "#b9f6c5", opacity: 0.9 },
  bottomCta: {
    marginTop: 8,
    display: "inline-block",
    background: "rgba(29,185,84,0.18)",
    border: "1px solid rgba(29,185,84,0.45)",
    borderRadius: 999,
    padding: "12px 18px",
    fontWeight: 700,
    color: "#d8ffdc",
    cursor: "pointer",
  },
  exitFade: {
    position: "fixed",
    inset: 0,
    background: "linear-gradient(180deg, rgba(5,46,27,0.3), rgba(5,46,27,1))",
    zIndex: 5,
  },
};

export default function EcoQuestLanding() {
  const [exiting, setExiting] = useState(false);
  const [skip, setSkip] = useState(false); // hide UI while we redirect if already seen
  const nav = useNavigate();
  const { user } = useAuth();

  // ⬇️ If landing was seen, skip straight to /home or /login
  useEffect(() => {
    try {
      const seen = localStorage.getItem("eco_seen_landing") === "1";
      if (seen) {
        setSkip(true);
        nav(user ? "/home" : "/login", { replace: true });
      }
    } catch {
      // ignore storage errors and just show the page
    }
  }, [nav, user]);

  // canvas ref + forward mousemove
  const squaresCanvasRef = useRef(null);
  useEffect(() => {
    const el = document.querySelector(".eco-squares");
    if (el) squaresCanvasRef.current = el;
  }, []);
  const forwardMouseMove = (e) => {
    const el = squaresCanvasRef.current;
    if (!el) return;
    el.dispatchEvent(
      new MouseEvent("mousemove", { clientX: e.clientX, clientY: e.clientY, bubbles: true })
    );
  };

  // keyframes for leaves
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById("ecoquest-kf")) return;
    const tag = document.createElement("style");
    tag.id = "ecoquest-kf";
    tag.innerHTML = `
      @keyframes eco-fall {
        0% { transform: translateY(-12vh) rotate(0deg); opacity: 0; }
        10% { opacity: .9; }
        50% { transform: translateY(50vh) rotate(90deg); }
        100% { transform: translateY(110vh) rotate(180deg); opacity: 0; }
      }
    `;
    document.head.appendChild(tag);
  }, []);

  const markSeenAndGo = (path) => {
    try { localStorage.setItem("eco_seen_landing", "1"); } catch {}
    nav(path);
  };

  // ✅ CHANGE: send to /home if logged in, else /login (not /learn)
  const handleEnter = () => {
    if (exiting) return;
    setExiting(true);
    try { localStorage.setItem("eco_seen_landing", "1"); } catch {}
    setTimeout(() => {
      nav(user ? "/home" : "/login", { replace: true });
    }, 650);
  };

  const ctaGrid = {
    display: "grid",
    gap: 12,
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    marginTop: 16,
  };
  const ctaBtn = {
    borderRadius: 12,
    padding: "12px 14px",
    border: "1px solid rgba(255,255,255,0.18)",
    background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
    color: "#e8ffee",
    fontWeight: 800,
    letterSpacing: 0.3,
    cursor: "pointer",
  };

  // Prevent brief flash while redirecting if already seen
  if (skip) return null;

  return (
    <div style={styles.page}>
      {/* Background */}
      <Squares
        speed={0.35}
        squareSize={36}
        direction="diagonal"
        borderColor="rgba(255,255,255,0.15)"
        hoverFillColor="#66bb6a"
        className="eco-squares"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={styles.gradient}
      />

      <LeafField />

      {/* HERO */}
      <div style={styles.hero} onClick={handleEnter} onMouseMove={forwardMouseMove}>
        <motion.main
          initial={{ opacity: 0, y: 18, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={styles.center}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            style={styles.logoWrap}
          >
            <AnimatedTitle text="EcoQuest" />
            <p style={styles.subtitle}>Learn • Play • Protect</p>
            <p style={styles.subtitle}>A playful path to environmental awareness</p>
          </motion.div>

          <motion.div
            animate={{ opacity: [0.45, 1, 0.45] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
            style={styles.entryHint}
            onClick={(e) => {
              e.stopPropagation();
              handleEnter();
            }}
          >
            Tap anywhere to begin
          </motion.div>
        </motion.main>

        <div style={styles.cornerTL}>
          <Badge label="Beta" />
        </div>
      </div>

      {/* ----- UPDATED LANDING SECTIONS ----- */}
      <div style={styles.sections}>
        <Section
          kicker="Our Mission"
          title="Empowering eco-learning through play"
          body={[
            "EcoQuest turns environmental literacy into an engaging, hands-on journey.",
            "Students learn core eco concepts in minutes and apply them through real-world challenges at home, school, and in the community.",
          ]}
        />

        <Section
          kicker="What you’ll learn"
          title="Real-world topics, made interactive"
          body={[
            "Short, visual lessons simplify complex ideas and connect them to everyday life.",
          ]}
          bullets={[
            "Waste & segregation • 3Rs (Reduce, Reuse, Recycle)",
            "Water conservation • Rainwater harvesting • Leak checks",
            "Energy & renewables • Efficient appliances • Power habits",
            "Biodiversity & trees • Native species • Urban greens",
            "Climate action • Carbon footprint • Sustainable transport",
            "Responsible consumption • Plastic-free choices • Eco-events",
          ]}
        />

        <Section
          kicker="How it works"
          title="Learn. Play. Protect. Repeat."
          body={[
            "Bite-sized modules with quizzes, scenarios, and mini-games keep attention high.",
            "Daily eco-challenges nudge real actions — from sorting waste to saving water.",
            "Clubs and classes collaborate on missions and compare progress on boards.",
          ]}
        />

        <Section
          kicker="Rewards & competitions"
          title="Earn eco-points. Unlock badges. Lead your school."
          body={[
            "Every correct answer, streak, or completed action rewards XP and eco-points.",
            "Collect themed badges like “Water Saver”, “Plastic-Free Champ”, and “Tree Guardian”.",
            "School and inter-college leaderboards spark friendly, purpose-driven competition.",
          ]}
        />

        <Section
          kicker="Impact & alignment"
          title="Small steps, measurable change"
          body={[
            "Track real outcomes: litres of water saved, waste diverted, trees planted, and CO₂ avoided.",
            "Designed to support NEP 2020’s experiential learning and India’s SDGs focus.",
          ]}
          statbar={[
            { label: "Avg. session", value: "5–7 min" },
            { label: "Mode", value: "Lessons • Quizzes • Challenges" },
            { label: "Learners", value: "Schools & Colleges" },
          ]}
        />

        {/* 🔗 Real navigation CTAs (router-based, no page reloads) */}
        <section style={styles.section}>
          <div
            style={{
              fontSize: 14,
              textTransform: "uppercase",
              letterSpacing: 1,
              color: "#a2f3b0",
              marginBottom: 8,
            }}
          >
            Jump in
          </div>
          <h2 style={styles.sectionTitle}>Start exploring EcoQuest</h2>
          <div style={ctaGrid}>
            <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} style={ctaBtn} onClick={() => markSeenAndGo("/signup")}>
              Create Account (Sign Up)
            </motion.button>
            <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} style={ctaBtn} onClick={() => markSeenAndGo("/login")}>
              Log In
            </motion.button>
            <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} style={ctaBtn} onClick={() => markSeenAndGo("/learn")}>
              Explore Learn Modules
            </motion.button>
            <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} style={ctaBtn} onClick={() => markSeenAndGo("/trivia")}>
              Play Trivia
            </motion.button>
            <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} style={ctaBtn} onClick={() => markSeenAndGo("/games")}>
              Try Eco Games
            </motion.button>
            <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} style={ctaBtn} onClick={() => markSeenAndGo("/assistant")}>
              Chat with Eco (Assistant)
            </motion.button>
            <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} style={ctaBtn} onClick={() => markSeenAndGo("/leaderboard")}>
              View Leaderboard
            </motion.button>
            <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} style={ctaBtn} onClick={() => markSeenAndGo("/home")}>
              Go to Dashboard
            </motion.button>
          </div>
        </section>

        {/* Primary CTA (→ Home) */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={styles.bottomCta}
          onClick={() => markSeenAndGo("/home")}
        >
          Start your first eco-quest →
        </motion.div>
      </div>

      <AnimatePresence>
        {exiting && (
          <motion.div
            key="exit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={styles.exitFade}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ----- Helpers (unchanged) ----- */
function AnimatedTitle({ text }) {
  const [displayedText, setDisplayedText] = useState("");
  const typingSpeed = 250;
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(id);
      }
    }, typingSpeed);
    return () => clearInterval(id);
  }, [text]);
  return (
    <motion.h1 style={styles.title} aria-label={text}>
      <span>{displayedText}</span>
      <motion.span
        style={styles.typingCursor}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
      >
        _
      </motion.span>
    </motion.h1>
  );
}

function EcoLogo() { return null; }
function Badge({ label }) { return <div style={styles.badge}>{label}</div>; }

function LeafField({ count = 14 }) {
  const leaves = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 10 + Math.random() * 14,
        delay: Math.random() * 5,
        duration: 10 + Math.random() * 9,
        rotate: -20 + Math.random() * 40,
      })),
    [count]
  );
  return <div style={styles.leafLayer} aria-hidden>{leaves.map((l) => <Leaf key={l.id} {...l} />)}</div>;
}

function Leaf({ left, size, delay, duration, rotate }) {
  const style = {
    position: "absolute",
    left: left + "%", top: -40, width: size, height: size,
    animation: `eco-fall ${duration}s linear ${delay}s infinite`,
    transform: `rotate(${rotate}deg)`, opacity: 0.75, willChange: "transform, opacity",
  };
  return (
    <div style={style}>
      <svg viewBox="0 0 24 24" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8 6 4 8 3 13c-1 6 5 9 9 5 4-4 7-8 9-14-6 2-10 1-9-2Z" fill="#2f4c39" stroke="#0f5132" strokeWidth="1" />
      </svg>
    </div>
  );
}

function Section({ kicker, title, body = [], bullets, statbar }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={styles.section}
    >
      {kicker && <div style={styles.kicker}>{kicker}</div>}
      <h2 style={styles.sectionTitle}>{title}</h2>
      {body.map((p, i) => <p key={i} style={styles.sectionBody}>{p}</p>)}
      {bullets && bullets.length > 0 && (
        <ul style={styles.list}>
          {bullets.map((b, i) => <li key={i} style={styles.listItem}>{b}</li>)}
        </ul>
      )}
      {statbar && (
        <div style={styles.statbar}>
          {statbar.map((s, i) => (
            <div key={i} style={styles.stat}>
              <div style={styles.statValue}>{s.value}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </motion.section>
  );
}
// End of src/EcoQuestLanding.jsx