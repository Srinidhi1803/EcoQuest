// LoginForm.jsx
import React, { useState } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    alert(`Email: ${email}, Password: ${password}`);
  };

  return (
    <form className="login-form" onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={inputStyle}
      />

      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={inputStyle}
      />

      <button type="submit" style={buttonStyle}>
        Login
      </button>
    </form>
  );
}

const inputStyle = {
  padding: "1rem",
  borderRadius: "8px",
  border: "1px solid #ddd",
  outline: "none",
  fontSize: "1.07rem",
  background: "#f5f8fa",
  marginBottom: "1rem",
  width: "100%",
};

const buttonStyle = {
  padding: "1.1rem",
  borderRadius: "10px",
  border: "none",
  backgroundColor: "#1db954",
  color: "#fff",
  fontWeight: "bold",
  fontSize: "1.06rem",
  cursor: "pointer",
};

export default LoginForm;
