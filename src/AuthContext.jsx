import { createContext, useContext, useMemo, useState } from "react";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  // TODO: replace with real auth; for now, a simple boolean + localStorage
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("eco_user");
    return raw ? JSON.parse(raw) : null;
  });

  const login = (userObj) => {
    localStorage.setItem("eco_user", JSON.stringify(userObj));
    setUser(userObj);
  };

  const logout = () => {
    localStorage.removeItem("eco_user");
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}
