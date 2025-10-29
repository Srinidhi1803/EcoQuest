// src/Aks/SignUpPage.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";   // ⬅️ from /src
import Squares from "../Squares";          // ⬅️ from /src
import "./LoginPage.css";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge]           = useState("");
  const [avatar, setAvatar]     = useState(null);

  const navigate  = useNavigate();
  const location  = useLocation();
  const { login } = useAuth();             // ⬅️ use auth context

  const avatars = ["🌱", "🌳", "🐢", "🦉", "🐝", "🦋", "🐧", "🐼"];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!avatar) {
      alert("Please select an avatar!");
      return;
    }

    // Fake signup → log the user in (replace with API later)
    const newUser = {
      id: String(Date.now()),
      name: username || "Student",
      email,
      avatar,
      age,
    };
    login(newUser);

    // Go to originally intended page (if any) or /home
    const to = location.state?.from?.pathname || "/home";
    navigate(to, {
      replace: true,
      state: { fromSignup: true, username, avatar }, // optional for confetti, etc.
    });
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
      {/* Squares background (slightly different) */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Squares
          speed={0.35}
          squareSize={42}
          direction="diagonal"
          borderColor="rgba(225,225,225,0.15)"
          hoverFillColor="#66bb6a"
          className="squares-fill"
        />
      </div>

      {/* Centered signup card */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 2,
          width: "450px",
          maxWidth: "95vw",
          background: "rgba(255,255,255,0.95)",
          padding: "2.5rem 2rem",
          borderRadius: "24px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
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
          Create Account
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
            required
          />

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

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={inputStyle}
            required
          />

          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            style={inputStyle}
            required
          />

          {/* Avatar selection */}
          <div>
            <label style={{ fontWeight: "bold", fontSize: "1.05rem" }}>
              Choose your avatar:
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "8px",
                marginTop: "10px",
              }}
            >
              {avatars.map((a, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setAvatar(a)}
                  style={{
                    fontSize: "2rem",
                    padding: "5px",
                    borderRadius: "12px",
                    textAlign: "center",
                    cursor: "pointer",
                    border: avatar === a ? "3px solid #1db954" : "2px solid #ccc",
                    background: avatar === a ? "#e8ffec" : "#fff",
                    boxShadow:
                      avatar === a ? "0 0 10px rgba(29,185,84,0.6)" : "none",
                  }}
                >
                  {a}
                </motion.div>
              ))}
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            style={{
              background: "rgba(29, 185, 84, 0.18)",
              color: "white",
              border: "1px solid rgba(29, 185, 84, 0.45)",
              padding: "1.1rem",
              borderRadius: "10px",
              fontWeight: "bold",
              fontSize: "1.06rem",
              cursor: "pointer",
              marginTop: "0.8rem",
            }}
          >
            Sign Up
          </motion.button>
        </form>

        <p style={{ marginTop: "2rem", fontSize: "1rem", textAlign: "center" }}>
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#032912ff",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "1.05rem",
              textDecoration: "none",
            }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "1rem",
  borderRadius: "8px",
  border: "1px solid #084512ff",
  outline: "none",
  fontSize: "1.07rem",
  background: "#f5f8fa",
};
