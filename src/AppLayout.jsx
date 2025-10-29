import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const wrap = {
  minHeight: "100vh",
  color: "white",
  background: "linear-gradient(135deg,#2e7d32,#1b5e20)",
};
const header = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 16px",
  background: "rgba(0,0,0,0.2)",
  backdropFilter: "blur(6px)",
  borderBottom: "1px solid rgba(255,255,255,0.15)",
};
const brand = { fontSize: 18, fontWeight: 700, margin: 0 };
const nav = { display: "flex", gap: 8, flexWrap: "wrap" };
const linkBase = {
  padding: "8px 12px",
  borderRadius: 8,
  textDecoration: "none",
  color: "white",
  fontWeight: 600,
};
const linkActive = { background: "rgba(255,255,255,0.2)" };
const linkHover = { background: "rgba(255,255,255,0.1)" };

export default function AppLayout() {
  const { user, logout } = useAuth();

  const linkStyle = ({ isActive }) => ({
    ...linkBase,
    ...(isActive ? linkActive : {}),
  });

  return (
    <div style={wrap}>
      <header style={header}>
        <h1 style={brand}>Eco Quest</h1>
        <nav style={nav}>
          

          {user ? (
            <>
              <NavLink to="/home" style={linkStyle}>Home</NavLink>
              <NavLink to="/learn" style={linkStyle}>Learn</NavLink>
              <NavLink to="/trivia" style={linkStyle}>Trivia</NavLink>
              <NavLink to="/games" style={linkStyle}>Games</NavLink>
              <NavLink to="/assistant" style={linkStyle}>Assistant</NavLink>
              <NavLink to="/leaderboard" style={linkStyle}>Leaderboard</NavLink>
              <NavLink to="/profile" style={linkStyle}>Profile</NavLink>
              <button
                onClick={logout}
                style={{ ...linkBase, background: "transparent", border: "1px solid rgba(255,255,255,0.25)", cursor: "pointer" }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" style={linkStyle}>Login</NavLink>
              <NavLink to="/signup" style={linkStyle}>Sign Up</NavLink>
            </>
          )}
        </nav>
      </header>

      <main style={{ padding: 16 }}>
        <Outlet />
      </main>
    </div>
  );
}
