import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { FiHome, FiCalendar, FiClock, FiUser } from "react-icons/fi";

const navItems = [
  { path: "/teacher/home", icon: FiHome, label: "Home" },
  { path: "/teacher/schedule", icon: FiCalendar, label: "Schedule" },
  { path: "/teacher/history", icon: FiClock, label: "History" },
  { path: "/teacher/profile", icon: FiUser, label: "Profile" },
];

export default function TeacherLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="relative w-full max-w-sm mx-auto min-h-screen bg-bg flex flex-col overflow-hidden shadow-2xl">
      {/* ── PAGE CONTENT ───────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <Outlet />
      </div>

      {/* ── BOTTOM NAVIGATION ──────────────────────────────────── */}
      <nav className="flex-shrink-0 bg-surface border-t border-border px-2 pb-2 pt-1 safe-area-bottom">
        <div className="flex justify-around">
          {navItems.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`
                  flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl
                  transition-all duration-200
                  ${active ? "text-primary" : "text-text3 hover:text-text2"}
                `}
              >
                {/* Active indicator dot */}
                {active && (
                  <span className="absolute mt-0 w-1 h-1 bg-primary rounded-full -translate-y-1" />
                )}
                <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
                <span
                  className={`text-xs font-semibold ${active ? "text-primary" : "text-text3"}`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

// ── MISSING IMPORTS ───────────────────────────────────────────────
import { useState, useEffect } from "react";
