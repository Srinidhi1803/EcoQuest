import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * EcoQuest — Learn Page (Framer Motion edition)
 * ---------------------------------------------
 * - Green "gamey but professional" look
 * - Expand/collapse modules with animated chevron
 * - Staggered list items, hover lift, tiny sparkles
 * - Emoji accents for each module & rows
 * - Knowledge Check row with animated 0–5 stars at right
 * - No Tailwind; all styles are inline CSS below
 */

export default function LearnPage() {
  const modules = useMemo(
    () => [
      {
        id: "m1",
        emoji: "🌍",
        title: "Module 1 — Climate Foundations",
        xp: 120,
        est: "25 min",
        knowledgeCheckScore: 3,
        items: [
          "Climate vs Weather (quick view)",
          "Greenhouse Effect (simple model)",
          "Human fingerprints on warming",
          "Local climate risks & examples",
        ],
      },
      {
        id: "m2",
        emoji: "♻️",
        title: "Module 2 — Waste & Recycling",
        xp: 140,
        est: "30 min",
        knowledgeCheckScore: 5,
        items: [
          "Types of waste (wet/dry/e-waste)",
          "Segregation at source: how & why",
          "Composting basics you can try",
          "Recycling symbols & myths",
        ],
      },
      {
        id: "m3",
        emoji: "💧",
        title: "Module 3 — Water Conservation",
        xp: 110,
        est: "22 min",
        knowledgeCheckScore: 2,
        items: [
          "Urban water cycle 101",
          "Household leaks & audits",
          "Greywater & rainwater harvesting",
          "Water footprint of foods",
        ],
      },
      {
        id: "m4",
        emoji: "⚡",
        title: "Module 4 — Energy & Renewables",
        xp: 160,
        est: "35 min",
        knowledgeCheckScore: 4,
        items: [
          "Electricity: units & bills",
          "Saving energy at home & campus",
          "Solar basics (PV vs thermal)",
          "Battery safety & e-waste",
        ],
      },
      {
        id: "m5",
        emoji: "🦋",
        title: "Module 5 — Biodiversity & Local Action",
        xp: 130,
        est: "28 min",
        knowledgeCheckScore: 1,
        items: [
          "Urban biodiversity & pollinators",
          "Native plants vs invasives",
          "Tree-planting the right way",
          "Citizen science & eco-clubs",
        ],
      },
    ],
    []
  );

  const [openIds, setOpenIds] = useState(() => new Set());
  const allOpen = openIds.size === modules.length;

  const toggleAll = () => {
    if (allOpen) setOpenIds(new Set());
    else setOpenIds(new Set(modules.map((m) => m.id)));
  };

  const toggleOne = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="learn-page">
      <StyleTag />

      {/* Header */}
      <motion.header
        className="lp-header"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
      >
        <div>
          <h1 className="lp-title">Learn <span className="title-emoji">🎒</span></h1>
          <p className="lp-sub">Interactive modules. Earn XP. Level up the planet.</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          className="lp-expand"
          onClick={toggleAll}
          aria-expanded={allOpen}
        >
          {allOpen ? "Collapse All" : "Expand All"}
        </motion.button>
      </motion.header>

      {/* Modules */}
      <motion.div className="lp-modules" initial="hidden" animate="show" variants={{
        hidden: { transition: { staggerChildren: 0.06, staggerDirection: -1 } },
        show: { transition: { staggerChildren: 0.06 } },
      }}>
        
        {modules.map((mod) => {
          const isOpen = openIds.has(mod.id);
          return (
            <motion.section key={mod.id} className="lp-module" variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 }}} whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 130, damping: 16 }}>
              
              <motion.button
                className="lp-module-head"
                onClick={() => toggleOne(mod.id)}
                aria-expanded={isOpen}
                aria-controls={`${mod.id}-panel`}
                whileTap={{ scale: 0.995 }}
              >
                <motion.span
                  className="chev"
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 18 }}
                >
                  ▸
                </motion.span>

                <span className="lp-emoji">{mod.emoji}</span>
                <span className="lp-module-title">{mod.title}</span>

                <div className="chips">
                  <span className="chip xp">+{mod.xp} XP</span>
                  <span className="chip time">⏱ {mod.est}</span>
                </div>
              </motion.button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div id={`${mod.id}-panel`} className="lp-panel" role="region" aria-label={`${mod.title} content`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ type: "tween", duration: 0.26 }}>
                    <motion.ul className="lp-list" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } }}}>
                      {mod.items.map((text, idx) => (
                        <motion.li key={idx} className="lp-row" variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 }}} whileHover={{ backgroundColor: "rgba(241,252,244,1)" }}>
                          <span className="row-emoji">📘</span>
                          <span className="lp-row-text">{text}</span>
                          <Sparkle />
                        </motion.li>
                      ))}


                      {/* Knowledge Check */}
                      <motion.li
                        className="lp-row lp-knowledge"
                        variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                        whileHover={{ backgroundColor: "rgba(233,252,239,1)" }}
                        role="button"
                        tabIndex={0}
                        onClick={() => navigate("/quizzes", { state: { fromModule: mod.id } })}
                        onKeyDown={(e) => { if (e.key === "Enter") navigate("/quizzes", { state: { fromModule: mod.id } }); }}
                        aria-label={`Open knowledge check for ${mod.title}`}
                      >
                        <span className="row-emoji">📝</span>
                        <span className="lp-row-text">Knowledge Check</span>
                        <Stars score={mod.knowledgeCheckScore} outOf={5} />
                      </motion.li>
                    </motion.ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          );
        })}
      </motion.div>
    </div>
  );
}

/* ---------- Stars (animated) ---------- */
function Stars({ score = 0, outOf = 5 }) {
  return (
    <div className="stars" aria-label={`${score} of ${outOf} correct`}>
      {Array.from({ length: outOf }).map((_, i) => (
        <motion.span
          key={i}
          className={`star ${i < score ? "filled" : ""}`}
          initial={{ scale: 0, rotate: -20, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.05 * i }}
        >
          ★
        </motion.span>
      ))}
    </div>
  );
}

/* ---------- Tiny sparkle at end of each normal row ---------- */
function Sparkle() {
  return (
    <motion.span
      className="spark"
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 14 }}
    >
      ✨
    </motion.span>
  );
}

/* ---------- Styles (pure CSS) ---------- */
function StyleTag() {
  return (
    <style>{`
      :root{
        --bg: #f6fbf6;
        --panel: #ffffff;
        --ink: #082419;
        --muted: #4f6b5d;
        --brand: #16a34a;
        --brand-ink: #0e7a38;
        --line: #e5efe6;
        --row: #080f0aff;
        --row-2: #e9feef;
        --star-filled: #22c55e;
        --star-empty: #cfe8d5;
        --radius: 16px;
        --shadow: 0 10px 28px rgba(0,0,0,.07);
      }
      *{ box-sizing:border-box; }
      body{ background: var(--bg); margin:0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; color: var(--ink); }
      .learn-page{ max-width: 1080px; margin: 28px auto 80px; padding: 0 20px; }

      /* Header */
      .lp-header{
        display:flex; align-items:flex-end; justify-content:space-between; gap:16px; margin-bottom: 18px;
        background: linear-gradient(135deg, #e9fbe9, #070606ff 60%);
        border: 1px solid var(--line); border-radius: 20px; padding: 20px 22px; box-shadow: var(--shadow);
      }
      .lp-title{ margin:0; font-size: 28px; color: #190303ff; letter-spacing:-.3px; font-weight: 900; display:flex; align-items:center; gap:8px;}
      .title-emoji{ font-size: 28px; }
      .lp-sub{ margin:6px 0 0; color: var(--muted); font-size:.98rem; }
      .lp-expand{
        background: var(--brand);
        color: #190303ff; border: 0; border-radius: 999px; padding: 12px 18px; font-weight: 700;
        box-shadow: var(--shadow); cursor: pointer;
      }

      /* Modules grid */
      .lp-modules{ display:grid; gap: 14px; margin-top: 16px; }

      .lp-module{
        background: var(--panel);
        border: 1px solid var(--line);
        border-radius: var(--radius);
        box-shadow: var(--shadow);
        overflow: hidden;
      }

      .lp-module-head{
        width:100%; text-align:left; background:linear-gradient(0deg,#ffffff, #060d06ff);
        display:grid; grid-template-columns: 18px 36px 1fr auto; align-items:center; gap: 12px;
        border:0; padding: 16px 18px; cursor:pointer; font-weight:800; color: var(--ink);
      }
      .chev{ color: var(--brand-ink); font-weight: 900; }

      .lp-emoji{ font-size: 24px; filter: drop-shadow(0 2px 6px rgba(0,0,0,.06)); }
      .lp-module-title{ font-size: 1.06rem; letter-spacing: 0; }

      .chips{ display:flex; gap:8px; }
      .chip{
        font-size: .84rem; font-weight: 700; padding: 6px 10px; border-radius: 999px; border:1px solid var(--line);
        background:#f6fff7; color: var(--brand-ink);
      }
      .chip.time{ background:#f1fbf4; }

      .lp-panel{ border-top:1px solid var(--line); overflow:hidden; }
      .lp-list{ list-style:none; margin:0; padding: 4px 0; }
      .lp-row{
        display:grid; grid-template-columns: 28px 1fr auto; align-items:center; gap: 12px;
        padding: 12px 18px; border-top:1px solid var(--line); background:#fff; position:relative;
      }
      .lp-row:first-child{ border-top: 0; }
      .row-emoji{ font-size: 18px; opacity: .9; }
      .lp-row-text{ font-weight: 650; }

      .spark{ margin-left: 10px; opacity: .8; }

      .lp-knowledge{
        border-top: 2px dashed #daf1df;
        background: var(--row-2);
      }
      .lp-knowledge .lp-row-text{ color: var(--brand-ink); }

      /* Stars */
      .stars{ display:inline-flex; gap: 6px; margin-left: 14px; }
      .star{ color: var(--star-empty); font-size: 18px; text-shadow: 0 0 0 rgba(0,0,0,0); }
      .star.filled{ color: var(--star-filled); text-shadow: 0 4px 10px rgba(34,197,94,.28); }

      @media (max-width: 600px){
        .lp-header{ flex-direction: column; align-items: stretch; }
        .lp-expand{ width: 100%; }
        .lp-module-head{ grid-template-columns: 18px 30px 1fr; row-gap: 10px; }
        .chips{ grid-column: 1 / -1; }
      }
    `}</style>
  );
}
