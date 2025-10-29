// src/Aks/LoginPage.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";        // ⬅️ from /src
import Squares from "../Squares";               // ⬅️ from /src
import "./LoginPage.css";                       // ⬅️ stays in /Aks

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const nav = useNavigate();
  const loc = useLocation();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    // fake login (replace with real auth when ready)
    const user = { id: String(Date.now()), name: "Student", email };
    login(user);                                // ⬅️ sets context/localStorage
    const to = loc.state?.from?.pathname || "/home";
    nav(to, { replace: true });                 // ⬅️ go to intended page or /home
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Squares background */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Squares
          speed={0.35}
          squareSize={42}
          direction="diagonal"
          borderColor="rgba(255,255,255,0.15)"
          hoverFillColor="#66bb6a"
          className="squares-fill"
        />
      </div>

      {/* Centered Login card */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 2,
          width: "410px",
          maxWidth: "95vw",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            background: "rgba(255,255,255, 0.95)",
            padding: "2.5rem 2rem",
            borderRadius: "24px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            width: "100%",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              color: "#0f5132",
              fontSize: "2.1rem",
              marginBottom: "1.3rem",
            }}
          >
            Login
          </h2>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1.3rem" }}
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              required
            />

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              style={{
                background: "#1db954",
                color: "white",
                border: "none",
                padding: "1.1rem",
                borderRadius: "10px",
                fontWeight: "bold",
                fontSize: "1.06rem",
                cursor: "pointer",
                marginTop: "0.5rem",
              }}
            >
              Login
            </motion.button>
          </form>

          <p
            style={{
              marginTop: "2rem",
              fontSize: "1rem",
              textAlign: "center",
            }}
          >
            Don’t have an account?{" "}
            <Link
              to="/signup"
              style={{
                color: "#032912ff",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "1.05rem",
              }}
            >
              Sign Up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "1rem",
  borderRadius: "8px",
  border: "1px solid #ddd",
  outline: "none",
  fontSize: "1.07rem",
  background: "#f5f8fa",
};
