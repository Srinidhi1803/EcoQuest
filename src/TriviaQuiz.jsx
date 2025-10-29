// src/TriviaQuiz.jsx
import React, { useMemo, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";      // ⬅️ added
import { useAuth } from "./AuthContext";             // ⬅️ added

export default function TriviaQuiz() {
  const [showPicker, setShowPicker] = useState(true);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [finished, setFinished] = useState(false);
  const [avatar, setAvatar] = useState(null);

  const navigate = useNavigate();                    // ⬅️ added
  const { user, login } = useAuth();                 // ⬅️ added (we reuse login to overwrite user with new XP)
  const awardedRef = useRef(false);                  // ⬅️ prevent double XP award

  const xpFor = (difficulty) =>
    difficulty === "easy" ? 2 : difficulty === "moderate" ? 4 : 5;

  const questions = useMemo(
    () => [
      { q: "Which gas do plants absorb during photosynthesis?", options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], a: 1 },
      { q: "What type of waste belongs in a compost bin?", options: ["Fruit peels", "Plastic wrap", "Glass shards"], a: 0 },
      { q: "The practice of using less water is called…", options: ["Hydro-mining", "Water conservation", "Desalination"], a: 1 },
      { q: "Which is a renewable energy source?", options: ["Coal", "Natural gas", "Solar"], a: 2 },
      { q: "Best way to cut e-waste at school?", options: ["Throw it with regular trash", "Repair or donate old devices", "Burn it"], a: 1 },
      { q: "Planting trees mainly helps reduce which gas?", options: ["Carbon dioxide", "Helium", "Chlorine"], a: 0 },
      { q: "What symbol means an item can be recycled?", options: ["⚠️", "♻️", "⛔"], a: 1 },
      { q: "Which practice saves the most paper at school?", options: ["Single-sided prints", "Digital submissions", "Extra photocopies for backup"], a: 1 },
      { q: "Wet waste should be…", options: ["Mixed with plastics", "Sent to composting", "Buried in a playground"], a: 1 },
      { q: "Which habit lowers your carbon footprint?", options: ["Taking stairs for 1-2 floors", "Letting the tap run", "Daily single-use bottles"], a: 0 },
    ],
    []
  );

  const total = questions.length;
  const pct = Math.round((current / total) * 100);

  const choose = (idx) => { if (!locked) setSelected(idx); };
  const submit = () => {
    if (selected == null) return;
    setLocked(true);
    if (selected === questions[current].a) setScore((s) => s + 1);
    setTimeout(() => {
      const next = current + 1;
      if (next >= total) setFinished(true);
      else { setCurrent(next); setSelected(null); setLocked(false); }
    }, 500);
  };
  const restart = (resetAvatar = false) => {
    setCurrent(0); setScore(0); setSelected(null); setLocked(false); setFinished(false);
    awardedRef.current = false;                           // ⬅️ reset award flag
    if (resetAvatar) { setAvatar(null); setShowPicker(true); }
  };

  const rewardXP = finished && score === total ? xpFor(avatar?.difficulty || "easy") : 0;

  // ⬅️ Award XP once when the round ends perfectly and a user is logged in
  useEffect(() => {
    if (finished && rewardXP > 0 && user && !awardedRef.current) {
      awardedRef.current = true;
      const nextUser = {
        ...user,
        xp: (user.xp || 0) + rewardXP,
      };
      // reuse login() to update the stored user profile in context/localStorage
      login(nextUser);
    }
  }, [finished, rewardXP, user, login]);

  // ------- SCOPED STYLES (unchanged from your version) -------
  const styles = `
    :root{
      --eco-bg:#1b2c25;
      --eco-bg-2:#21372e;
      --eco-card:#253f34;
      --eco-ink:#eaffe9;
      --eco-sub:#d0e6d8;
      --eco-acc:#2cc66e;
      --eco-acc-2:#9be6bd;
      --eco-bad:#ff5a6a;
      --eco-good:#39e27f;
      --eco-border:rgba(255,255,255,.10);
      --eco-border-strong:rgba(255,255,255,.18);
      --eco-shadow:0 12px 32px rgba(0,0,0,.28);
    }

    .eco-quiz{ min-height:100svh; color:var(--eco-ink);
      background:
        radial-gradient(70% 50% at 50% 0%, rgba(155,230,189,.18), transparent 60%),
        linear-gradient(180deg,var(--eco-bg-2),var(--eco-bg));
      display:flex; align-items:center; justify-content:center;
      padding:28px; font-family:system-ui, -apple-system, Segoe UI, Roboto, Inter, Poppins, Arial, sans-serif;
    }
    .eco-quiz .shell{ width:min(980px,100%); }

    .eco-quiz .topbar{ display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
    .eco-quiz .crumb{ color:var(--eco-sub); font-weight:800; letter-spacing:.3px; }
    .eco-quiz .xp-pill{ background:rgba(44,198,110,.16); border:1px solid rgba(44,198,110,.35);
      padding:6px 10px; border-radius:999px; font-size:12px; color:#eafff0; }

    .eco-quiz .card{ background:var(--eco-card); border:1px solid var(--eco-border);
      border-radius:18px; padding:22px; box-shadow:var(--eco-shadow); }

    .eco-quiz .hud{ display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:14px; }
    .eco-quiz .avatar{ display:flex; align-items:center; gap:12px; }
    .eco-quiz .bubble{
      position:static; left:auto; top:auto;
      width:46px; height:46px; border-radius:50%;
      display:grid; place-items:center; font-size:22px;
      background:linear-gradient(135deg,#294c3e,#2f6b53);
      border:1px solid var(--eco-border-strong); color:#fff; flex:0 0 46px;
    }
    .eco-quiz .bubble { position: static !important; left: 0 !important; top: 0 !important; }

    .eco-quiz .role{ font-size:12px; color:var(--eco-sub); line-height:1.2; }

    .eco-quiz .progress{ height:8px; background:#183027; border:1px solid var(--eco-border); border-radius:999px; overflow:hidden; }
    .eco-quiz .progress>div{ height:100%; background:linear-gradient(90deg,var(--eco-acc),#34d37a); width:0%; }

    .eco-quiz .question{ font-size:20px; font-weight:900; letter-spacing:.2px; margin:8px 0 14px; color:#fff; }
    .eco-quiz .opts{ display:grid; gap:12px; }
    .eco-quiz .opt{
      text-align:left; border:1px solid var(--eco-border);
      background:#1c352b; color:#ffffff;
      padding:14px; border-radius:14px; cursor:pointer; transition:.2s;
      display:flex; align-items:center; gap:10px; font-weight:800;
      box-shadow: inset 0 -1px 0 rgba(0,0,0,.15);
    }
    .eco-quiz .opt:hover{ transform:translateY(-1px); border-color:var(--eco-acc-2); }
    .eco-quiz .opt.chosen{ outline:2px solid var(--eco-acc); background:#1d3b30; }
    .eco-quiz .opt.correct{ border-color:var(--eco-good); background:#1a3d2f; }
    .eco-quiz .opt.wrong{ border-color:var(--eco-bad); background:#3a1f25; }

    .eco-quiz .actions{ display:flex; gap:12px; justify-content:flex-end; margin-top:14px; }
    .eco-quiz .btn{ border:1px solid var(--eco-border); background:#20362d; color:#fff;
      padding:12px 16px; border-radius:12px; font-weight:900; cursor:pointer; transition:.2s; }
    .eco-quiz .btn:hover{ transform:translateY(-1px); border-color:var(--eco-border-strong); }
    .eco-quiz .btn.primary{ background:linear-gradient(180deg,#2cc66e,#1ea75a); color:#0a1a13; box-shadow:0 8px 18px rgba(44,198,110,.35); border:none; }
    .eco-quiz .btn:disabled{ opacity:.6; cursor:not-allowed; }

    .eco-quiz .result{ text-align:center; padding:26px 10px; }
    .eco-quiz .result h2{ margin:0 0 10px; font-size:28px; color:#fff; }
    .eco-quiz .result .big{ font-size:42px; font-weight:900; }
    .eco-quiz .result .xp{
      display:inline-flex; align-items:center; gap:8px; margin-top:8px;
      padding:8px 12px; border-radius:999px;
      background:rgba(44,198,110,.20); border:1px solid rgba(44,198,110,.40);
      font-weight:900; color:#bff7d7;
    }

    .eco-quiz .overlay{ position:fixed; inset:0; background:rgba(19,29,25,.78);
      backdrop-filter: blur(6px); display:grid; place-items:center; padding:20px; z-index:10; }
    .eco-quiz .picker{ width:min(960px,100%); background:#2b473c; color:#ffffff;
      border:1px solid var(--eco-border-strong); border-radius:18px; padding:22px; box-shadow:var(--eco-shadow); }
    .eco-quiz .picker h3{ margin:0 0 8px 0; font-size:22px; }

    .eco-quiz .grid{ display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:14px; margin-top:12px; }
    .eco-quiz .tile{
      border:1px solid var(--eco-border);
      background:#2f5144;
      border-radius:14px; padding:12px; display:flex; gap:12px; align-items:center;
      cursor:pointer; transition:.2s; color:#ffffff;
    }
    .eco-quiz .tile:hover{ border-color:var(--eco-acc-2); transform:translateY(-1px); }
    .eco-quiz .tile.sel{ outline:2px solid var(--eco-acc); background:#2a4a3e; }
    .eco-quiz .tile .title{ color:#ffffff; letter-spacing:.4px; }
    .eco-quiz .tile .meta{ font-size:12px; color:#e7fff2; }
  `;

  const AVATARS = [
    { difficulty: "easy", icon: "🙂" },
    { difficulty: "moderate", icon: "😎" },
    { difficulty: "hard", icon: "🧠" },
  ];

  return (
    <div className="eco-quiz">
      <style>{styles}</style>

      <div className="shell">
        <div className="topbar">
          <div className="crumb">Play ▸ Trivia</div>
          <div className="xp-pill">Answer all 10 correctly to earn XP</div>
        </div>

        <motion.div className="card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {!finished ? (
            <>
              <div className="hud">
                <div className="avatar">
                  <div className="bubble">{avatar?.icon || "🎯"}</div>
                  <div>
                    <div style={{ fontWeight: 900 }}>
                      {avatar ? avatar.difficulty.toUpperCase() : "Select Difficulty"}
                    </div>
                    <div className="role">
                      {avatar ? `${xpFor(avatar.difficulty)} XP if flawless` : "Required to start"}
                    </div>
                  </div>
                </div>

                <div style={{ flex: 1, marginInline: 12 }}>
                  <div className="progress"><div style={{ width: `${pct}%` }} /></div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div className="role">Question</div>
                  <div style={{ fontWeight: 900, fontSize: 20 }}>
                    {Math.min(current + 1, total)} / {total}
                  </div>
                </div>
              </div>

              <div className="question">{questions[current].q}</div>

              <div className="opts">
                {questions[current].options.map((opt, i) => {
                  const isChosen = selected === i;
                  const isCorrect = locked && i === questions[current].a;
                  const isWrong = locked && isChosen && !isCorrect;
                  const cls = `opt ${isChosen ? "chosen" : ""} ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`;
                  return (
                    <button key={i} className={cls} onClick={() => choose(i)} disabled={locked}>
                      <span style={{ opacity: 0.85, marginRight: 6 }}>{String.fromCharCode(65 + i)}.</span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              <div className="actions">
                <button className="btn" onClick={() => restart(true)}>Change Difficulty</button>
                <button className="btn primary" onClick={submit} disabled={selected == null}>Submit</button>
              </div>
            </>
          ) : (
            <div className="result">
              <h2>Round Complete</h2>
              <div className="big">{score}/{total} correct</div>
              {rewardXP > 0 ? (
                <div className="xp">✅ Flawless! +{rewardXP} XP</div>
              ) : (
                <div style={{ color: "#ffd7a1", marginTop: 8, fontWeight: 800 }}>
                  Get all answers right to earn XP next time.
                </div>
              )}
              <div className="actions" style={{ justifyContent: "center", marginTop: 18, flexWrap: "wrap" }}>
                <button className="btn" onClick={() => restart(true)}>Choose Difficulty</button>
                <button className="btn primary" onClick={() => restart(false)}>Play Again</button>
                {/* ⬇️ router interactions */}
                <button className="btn" onClick={() => navigate("/home")}>Go to Dashboard</button>
                <button className="btn" onClick={() => navigate("/learn")}>Explore Learn</button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {showPicker && (
          <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="picker" initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              <h3>Pick Difficulty</h3>
              <div className="grid">
                {AVATARS.map((a, idx) => {
                  const isSel = avatar && avatar.difficulty === a.difficulty;
                  return (
                    <button key={idx} className={`tile ${isSel ? "sel" : ""}`} onClick={() => setAvatar({ ...a })}>
                      <div className="bubble">{a.icon}</div>
                      <div>
                        <div className="title" style={{ fontWeight: 900 }}>{a.difficulty.toUpperCase()}</div>
                        <div className="meta">Rewards {xpFor(a.difficulty)} XP</div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="actions" style={{ marginTop: 14 }}>
                <button className="btn" onClick={() => setAvatar(null)}>Reset</button>
                <button
                  className="btn primary"
                  onClick={() => { if (!avatar) return; setShowPicker(false); }}
                  disabled={!avatar}
                >
                  Start Quiz
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
// End of src/TriviaQuiz.jsx