import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiHome, FiCalendar, FiClock, FiUser } from "react-icons/fi";
import useAuthStore from "../../store/authStore";

const NAV_ITEMS = [
  { path: "/teacher/home", icon: FiHome, label: "Home" },
  { path: "/teacher/schedule", icon: FiCalendar, label: "Schedule" },
  { path: "/teacher/history", icon: FiClock, label: "History" },
  { path: "/teacher/profile", icon: FiUser, label: "Profile" },
];

export default function TeacherLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const isNonTeaching = user?.staffType === "non-teaching";

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#F1F5F9",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* ── PAGE CONTENT ───────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          paddingBottom: isNonTeaching ? 0 : 80,
        }}
      >
        <Outlet />
      </div>

      {/* ── BOTTOM NAVIGATION ──────────────────────────────────── */}
      {!isNonTeaching && (
        <nav
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            height: 72,
            background: "white",
            borderTop: "1px solid #F1F5F9",
            boxShadow: "0 -8px 32px rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            padding: "0 8px",
            zIndex: 100,
          }}
        >
          {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  height: "100%",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  position: "relative",
                  padding: "8px 0",
                  transition: "all 0.2s",
                }}
              >
                {/* Active pill indicator */}
                {active && (
                  <div
                    style={{
                      position: "absolute",
                      top: 8,
                      width: 36,
                      height: 36,
                      borderRadius: 12,
                      background: "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
                      zIndex: 0,
                    }}
                  />
                )}

                <div
                  style={{
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Icon
                    size={22}
                    color={active ? "#2563EB" : "#94A3B8"}
                    strokeWidth={active ? 2.5 : 1.8}
                    style={{ transition: "color 0.2s" }}
                  />
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: active ? 700 : 500,
                      color: active ? "#2563EB" : "#94A3B8",
                      fontFamily: "DM Sans, sans-serif",
                      transition: "color 0.2s",
                    }}
                  >
                    {label}
                  </span>
                </div>

                {/* Active dot */}
                {active && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 6,
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      background: "#2563EB",
                    }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
