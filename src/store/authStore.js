import { create } from "zustand";

const useAuthStore = create((set) => ({
  // ── STATE ──────────────────────────────────────────────────────
  user: JSON.parse(localStorage.getItem("classpulse_user")) || null,
  token: localStorage.getItem("classpulse_token") || null,
  isAuthenticated: !!localStorage.getItem("classpulse_token"),
  isLoading: false,
  error: null,

  // ── ACTIONS ───────────────────────────────────────────────────
  setLoading: (val) => set({ isLoading: val }),
  setError: (msg) => set({ error: msg }),
  clearError: () => set({ error: null }),

  login: (user, token) => {
    localStorage.setItem("classpulse_token", token);
    localStorage.setItem("classpulse_user", JSON.stringify(user));
    set({ user, token, isAuthenticated: true, error: null });
  },

  logout: () => {
    localStorage.removeItem("classpulse_token");
    localStorage.removeItem("classpulse_user");
    sessionStorage.removeItem("cp_splash_shown");
    sessionStorage.removeItem("cp_checkin_time");
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: (updatedUser) => {
    localStorage.setItem("classpulse_user", JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },
}));

export default useAuthStore;
