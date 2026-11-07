import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    try {
      const { user } = await api.get("/auth/me");
      setUser(user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  const signup = async (data) => api.post("/auth/signup", data);
  const requestOtp = async (email, purpose) => api.post("/auth/request-otp", { email, purpose });
  const verifyOtp = async (email, code) => {
    const { user } = await api.post("/auth/verify-otp", { email, code });
    setUser(user);
    return user;
  };
  const login = async (phone, password) => {
    const { user } = await api.post("/auth/login", { phone, password });
    setUser(user);
    return user;
  };
  const adminLogin = async (email, password) => {
    const { user } = await api.post("/auth/admin/login", { email, password });
    setUser(user);
    return user;
  };
  const setPassword = async (newPassword) => api.post("/auth/set-password", { newPassword });
  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: user?.role === "admin",
        signup,
        requestOtp,
        verifyOtp,
        login,
        adminLogin,
        setPassword,
        logout,
        refreshMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
