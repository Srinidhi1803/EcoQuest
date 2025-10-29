import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ECO ASSISTANT — Full‑page AI UX (greens & whites)
 * Creative pass with: Problem strip, ambient background (safe), micro‑interactions,
 * non‑scroll page (only chat scrolls), plus icon, polished chips & bubbles.
 *
 * Drop into src/EcoAssistant.jsx and render <EcoAssistant /> on a route.
 */

export default function EcoAssistant() {
  const [messages, setMessages] = useState(() => [
    {
      id: "m1",
      role: "assistant",
      content:
        "Hey! I’m Eco — your sustainability copilot. Ask me to analyze footprint, plan greener commutes, or turn habits into weekly goals.",
      time: timestamp(),
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, thinking]);

  const quickStarts = useMemo(
    () => [
      "What is climate change in simple words?",
      "Easy ways I can save water at home",
      "What goes in wet waste vs dry waste?",
      "How trees help the air we breathe",
      "Make a poster slogan about saving water",
    ],
    []
  );

  function handleSend(text) {
    const content = (text ?? input).trim();
    if (!content) return;

    const userMsg = {
      id: cryptoId(),
      role: "user",
      content,
      time: timestamp(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    // Simulate assistant response — replace with your API call
    setThinking(true);
    setTimeout(() => {
      const reply = {
        id: cryptoId(),
        role: "assistant",
        content: draftEcoReply(content),
        time: timestamp(),
      };
      setMessages((m) => [...m, reply]);
      setThinking(false);
    }, 700);
  }

  return (
    <div className="eco-page">
      <StyleTag />

      {/* HEADER */}
      <header className="eco-header">
        <div className="brand">
          <LeafIcon />
          <div className="brand-txt">
            <h1>Eco-ssistant</h1>
            <p>AI Integration Guide for Greener Choices</p>
          </div>
        </div>
        <div className="header-actions">
          <motion.button
            className="pill ghost"
            title="New conversation"
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setMessages(messages.slice(0, 1))}
          >
            <PlusIcon /> New chat
          </motion.button>
        </div>
      </header>

      {/* SHELL (grid): strip on top row, aside + main below */}
      <div className="eco-shell">
        <ProblemStrip />

        {/* Sidebar */}
        <aside className="eco-aside">
          <section className="card">
            <h3>Quick start</h3>
            <motion.ul className="chips" initial="off" animate="on">
              {quickStarts.map((q, i) => (
                <motion.li
                  key={q}
                  variants={{ off: { opacity: 0, y: 6 }, on: { opacity: 1, y: 0, transition: { duration: 0.22, delay: i * 0.03 } } }}
                >
                  <button className="chip" onClick={() => handleSend(q)}>
                    {q}
                  </button>
                </motion.li>
              ))}
            </motion.ul>
          </section>

          <section className="card">
            <h3>Focus areas</h3>
            <ul className="focus-list">
              {[
                { t: "Energy", d: "Home & appliances" },
                { t: "Mobility", d: "Commute & trips" },
                { t: "Waste", d: "Reduce • Reuse • Recycle" },
                { t: "Food", d: "Seasonal & local" },
              ].map((f) => (
                <li key={f.t}>
                  <span className="dot" />
                  <div>
                    <div className="t">{f.t}</div>
                    <div className="d">{f.d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          
        </aside>

        {/* Chat */}
        <main className="eco-main">
          <motion.div
            className="chat"
            ref={scrollRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className={`msg ${m.role}`}
                >
                  <div className="avatar">{m.role === "assistant" ? <LeafIcon /> : <UserIcon />}</div>
                  <div className="bubble">
                    <div className="meta">
                      <span className="who">{m.role === "assistant" ? "Eco" : "You"}</span>
                      <span className="time">{m.time}</span>
                    </div>
                    <p className="text">{m.content}</p>
                  </div>
                </motion.div>
              ))}

              {thinking && (
                <motion.div
                  key="thinking"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="msg assistant"
                >
                  <div className="avatar">
                    <LeafIcon />
                  </div>
                  <div className="bubble">
                    <div className="meta">
                      <span className="who">Eco</span>
                      <span className="time">{timestamp()}</span>
                    </div>
                    <TypingDots />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <footer className="composer">
            <div className="tools">
              <button className="icon" title="Attach">
                <PaperclipIcon />
              </button>
              <button className="icon" title="Microphone">
                <MicIcon />
              </button>
            </div>
            <input
              className="input"
              placeholder="Ask Eco anything — e.g., ‘Design a low‑waste weekly plan’"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button className="send" onClick={() => handleSend()} disabled={!input.trim()}>
              <SendIcon />
            </button>
          </footer>
        </main>
      </div>
    </div>
  );
}

/* --------------------------------- Helpers -------------------------------- */
function cryptoId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
function timestamp() {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function draftEcoReply(prompt) {
  // Very simple placeholder response generator
  if (/footprint|carbon|co2|co₂/i.test(prompt))
    return (
      "Here’s a fast footprint estimate: ~3.8 kg CO₂e/day from commute + 1.4 kg from electricity. " +
      "Want me to tailor this using your city, commute, and appliances?"
    );
  if (/travel|trip|goa|flight|train/i.test(prompt))
    return (
      "Plan idea: prefer train over flight where possible, choose stays with energy labels, and pack a reusable kit. " +
      "I can build a detailed green itinerary if you share dates and budget."
    );
  if (/waste|plastic|zero/i.test(prompt))
    return (
      "Zero‑waste starter kit: steel bottle, cloth bag, lunchbox, compost bin. I can generate a 7‑day habit plan with reminders."
    );
  return "Got it! I’ll break that into actionable green steps with estimated impact. Share a bit more context if you can.";
}

/* ------------------------------ Problem Strip ------------------------------ */
function ProblemStrip(){
  return (
    <motion.div
      className="problem-strip"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      
    </motion.div>
  );
}

/* ---------------------------------- UI Bits -------------------------------- */
function KPI({ label, value }) {
  return (
    <div className="kpi">
      <div className="val">{value}</div>
      <div className="lab">{label}</div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="dots">
      <span />
      <span />
      <span />
    </div>
  );
}

/* ------------------------------- Inline Styles ----------------------------- */
function StyleTag() {
  return (
    <style>{`
      :root{
        --eco-ink:#0f172a;            /* slate-900 */
        --eco-ink-2:#334155;          /* slate-600 */
        --eco-bg:#ffffff;             /* paper */
        --eco-pane:#f1f5f9;           /* slate-100 */
        --eco-card:#ffffff;           /* card */
        --eco-border:#e2e8f0;         /* border */
        --eco-brand:#16a34a;          /* green-600 */
        --eco-brand-2:#22c55e;        /* green-500 */
        --eco-brand-3:#86efac;        /* green-200 */
        --eco-shadow: 0 8px 30px rgba(2, 6, 23, 0.06);
      }
      * { box-sizing: border-box; }
      html, body, #root { height: 100%; background: var(--eco-pane); }
      body { margin:0; color: var(--eco-ink); font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, "Helvetica Neue", Arial; overflow:hidden; }

      .eco-page { min-height:100vh; display:flex; flex-direction:column; }

      .eco-header { position:sticky; top:0; z-index:5; display:flex; align-items:center; justify-content:space-between; padding:14px 20px; border-bottom:1px solid var(--eco-border); background:linear-gradient(180deg, #eafff3, #fff 60%);
        backdrop-filter:saturate(1.2) blur(2px); height:72px; }
      .brand { display:flex; align-items:center; gap:12px; }
      .brand svg { width:36px; height:36px; }
      .brand-txt h1 { margin:0; font-size:20px; letter-spacing:.2px; }
      .brand-txt p { margin:2px 0 0; color:var(--eco-ink-2); font-size:12px; }

      .header-actions { display:flex; gap:10px; flex-wrap: nowrap; }
      .pill { position:relative; display:inline-flex; align-items:center; gap:8px; border-radius:999px; padding:12px 18px; font-weight:700; font-size:14px; cursor:pointer; border:1px solid var(--eco-border); transition:.2s ease; white-space:nowrap; min-width:max-content; overflow:hidden; }
      .pill::after{ content:""; position:absolute; inset:0; background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,.5) 40%, transparent 60%); transform: translateX(-120%); transition: transform .5s ease; }
      .pill:hover::after{ transform: translateX(120%); }
      .pill svg { width:16px; height:16px; flex:0 0 auto; display:block; }
      .pill.ghost { background:#fff; color: var(--eco-ink); }
      .pill.ghost:hover { border-color: var(--eco-brand-3); box-shadow: var(--eco-shadow); }
      .pill.solid { background: var(--eco-brand); color:#fff; border-color:transparent; }
      .pill.solid:hover { filter: brightness(1.05); box-shadow: var(--eco-shadow); }

      /* SHELL GRID: two columns; first row is the strip; second row fills */
      .eco-shell { position: relative; z-index: 0; display:grid; grid-template-columns: 320px 1fr; grid-template-rows: auto 1fr; gap:18px; padding:18px; max-width:1200px; margin:0 auto; width:100%; height: calc(100vh - 72px); overflow:hidden; }

      /* Ambient background safely behind content */
      .eco-shell::before{ content:""; position:absolute; inset:-6% -3% -8% -3%; z-index:-1; filter: blur(24px); opacity:.38; pointer-events:none; background:
        radial-gradient(260px 260px at 6% 24%,  #86efac, #22c55e 60%, transparent 61%),
        radial-gradient(220px 220px at 96% 34%, #bbf7d0, #16a34a 55%, transparent 56%),
        radial-gradient(180px 180px at 30% 92%, #eafff3, #86efac 50%, transparent 51%);
      }

      .problem-strip{ grid-column: 1 / -1; position: relative; z-index: 1; padding: 10px 18px; border-radius: 14px; border: 1px solid var(--eco-border); background:
        linear-gradient(#ffffff,#ffffff) padding-box,
        linear-gradient(120deg, #eafff3, #ffffff) border-box; box-shadow: var(--eco-shadow); display: grid; grid-template-columns: auto 1fr; gap: 12px; align-items: center; }
      .problem-pill{ font-size: 12px; font-weight: 800; color: var(--eco-brand); padding: 6px 10px; border-radius: 999px; border: 1px solid var(--eco-brand-3); background: #f8fff9; white-space: nowrap; }

      .eco-aside { display:flex; flex-direction:column; gap:14px; }
      .card { background:var(--eco-card); border:1px solid var(--eco-border); border-radius:16px; padding:14px; box-shadow: var(--eco-shadow); }
      .card h3 { margin:2px 0 10px; font-size:14px; text-transform:uppercase; letter-spacing:.4px; color:var(--eco-ink-2); }

      .chips { list-style:none; padding:0; margin:0; display:flex; flex-wrap:nowrap; gap:10px; overflow-x:auto; scrollbar-width:none; }
      .chips::-webkit-scrollbar{ display:none; }
      .chips li{ flex:0 0 auto; }
      .chip { background:#fff; border:1px solid var(--eco-brand-3); color:var(--eco-ink); padding:10px 12px; border-radius:999px; font-size:12px; cursor:pointer; white-space:nowrap; transition: transform .12s ease, border-color .12s ease; }
      .chip:hover { transform: translateY(-2px); border-color: var(--eco-brand-2); }

      .focus-list { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:10px; }
      .focus-list li { display:flex; gap:10px; align-items:flex-start; }
      .focus-list .dot { width:10px; height:10px; border-radius:50%; background:var(--eco-brand); margin-top:6px; box-shadow:0 0 0 3px var(--eco-brand-3); }
      .focus-list .t { font-weight:700; }
      .focus-list .d { font-size:12px; color:var(--eco-ink-2); margin-top:2px; }

      .kpis .kpi-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap:8px; }
      .kpi { background:#f8fff9; border:1px solid var(--eco-brand-3); border-radius:12px; padding:10px; text-align:center; }
      .kpi .val { font-weight:800; font-size:18px; }
      .kpi .lab { font-size:11px; color:var(--eco-ink-2); }

      .eco-main { display:flex; flex-direction:column; gap:12px; height:100%; min-height:0; }
      .chat { background:#fff !important; border:1px solid var(--eco-border); border-radius:16px; box-shadow: var(--eco-shadow); flex:1; min-height:0; overflow:auto; padding:16px; }

      .msg { display:flex; gap:10px; margin:10px 0; }
      .msg .avatar { width:34px; height:34px; flex:0 0 auto; display:grid; place-items:center; border-radius:50%; border:1px solid var(--eco-border); background:#fff; }
      .msg .avatar svg { width:20px; height:20px; }
      .msg .bubble { background:#fff; border:1px solid var(--eco-border); border-radius:14px; padding:10px 12px; max-width:72ch; box-shadow: var(--eco-shadow); }
      .msg.user .bubble { background:linear-gradient(180deg, #f6fff8, #fff); border-color: var(--eco-brand-3); transition: transform .12s ease, box-shadow .12s ease; }
      .msg.user .bubble:hover{ transform: translateY(-2px); box-shadow: 0 10px 24px rgba(2,6,23,0.08); }
      .msg.assistant .bubble{ background: linear-gradient(#fff,#fff) padding-box, linear-gradient(135deg, #86efac, #22c55e) border-box; border: 1px solid transparent; }

      .meta { display:flex; gap:8px; align-items:center; margin-bottom:6px; font-size:12px; color:var(--eco-ink-2); }
      .meta .who { font-weight:800; color: var(--eco-brand); }
      .text { margin:0; line-height:1.5; }

      .composer { display:grid; grid-template-columns: 44px 1fr 44px; gap:10px; align-items:center; padding:8px; border:1px solid var(--eco-border); background:var(--eco-card); border-radius:14px; box-shadow: var(--eco-shadow); position:sticky; bottom:0; }
      .composer .tools { display:flex; gap:6px; align-items:center; justify-content:center; }
      .icon { width:36px; height:36px; border-radius:10px; background:#fff; border:1px solid var(--eco-border); display:grid; place-items:center; cursor:pointer; }
      .icon:hover { border-color: var(--eco-brand-3); }

      .input { width:100%; border:1px solid var(--eco-border); border-radius:10px; padding:10px 12px; font-size:14px; outline:none; }
      .input:focus { border-color: var(--eco-brand-2); box-shadow: 0 0 0 4px rgba(34,197,94,.15); }

      .send { width:40px; height:40px; border-radius:10px; border:none; background: var(--eco-brand); color:#fff; cursor:pointer; display:grid; place-items:center; transition:.15s; position:relative; overflow:hidden; }
      .send:disabled { opacity:.6; cursor:not-allowed; }
      .send:hover:not(:disabled) { filter:brightness(1.05); box-shadow: var(--eco-shadow); }
      .send::before{ content:""; position:absolute; inset:-40%; background: radial-gradient(circle, rgba(255,255,255,.6), transparent 60%); transform: scale(0); transition: transform .25s ease; }
      .send:hover::before{ transform: scale(1); }

      .dots { display:flex; gap:4px; align-items:center; height:20px; }
      .dots span { width:6px; height:6px; border-radius:50%; background: var(--eco-brand-2); opacity:.5; animation: bounce 1.2s infinite; }
      .dots span:nth-child(2){ animation-delay:.15s; }
      .dots span:nth-child(3){ animation-delay:.3s; }
      @keyframes bounce { 0%,80%,100%{ transform:translateY(0) } 40% { transform:translateY(-4px) } }

      /* Responsive */
      @media (max-width: 980px){
        .eco-shell { grid-template-columns: 1fr; grid-template-rows: auto auto 1fr; }
        .problem-strip { grid-column: 1; }
        .eco-aside { grid-column:1; grid-row:2; }
        .eco-main { grid-column:1; grid-row:3; }
      }
    `}</style>
  );
}

/* ------------------------------- SVG Icons -------------------------------- */
function PlusIcon(){
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  );
}
function LeafIcon(){
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M21 3S12 2 7 7s-4 10-4 10 5 1 10-4 7-10 7-10Z" fill="#16a34a" stroke="#16a34a"/>
      <path d="M3 17c4.5-2.5 8-4 12-8"/>
    </svg>
  );
}
function UserIcon(){
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
    </svg>
  );
}
function PaperclipIcon(){
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 8l-9.5 9.5a5 5 0 01-7-7L12 3l2 2-7.5 7.5a2 2 0 002.8 2.8L19 6"/>
    </svg>
  );
}
function MicIcon(){
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="9" y="3" width="6" height="10" rx="3"/>
      <path d="M5 10v2a7 7 0 0014 0v-2M12 19v2"/>
    </svg>
  );
}
function SendIcon(){
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M22 2L11 13"/>
      <path d="M22 2l-7 20-4-9-9-4 20-7Z"/>
    </svg>
  );
}
