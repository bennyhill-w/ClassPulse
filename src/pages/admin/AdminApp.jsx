import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdMonitor,
  MdPeople,
  MdClass,
  MdAssignment,
  MdBarChart,
  MdWarning,
  MdSettings,
  MdNotifications,
  MdLogout,
  MdMenu,
  MdClose,
  MdPin,
} from "react-icons/md";
import { FiClock } from "react-icons/fi";
import useAuthStore from "../../store/authStore";
import { displayName, initials } from "../../utils/helpers";

const NAV_ITEMS = [
  { path: "/admin/overview", icon: MdDashboard, label: "Overview" },
  { path: "/admin/monitor", icon: MdMonitor, label: "Live Monitor" },
  { path: "/admin/teachers", icon: MdPeople, label: "Teachers" },
  { path: "/admin/classes", icon: MdClass, label: "Active Classes" },
  { path: "/admin/reports", icon: MdAssignment, label: "Reports" },
  { path: "/admin/analytics", icon: MdBarChart, label: "Analytics" },
  { path: "/admin/alerts", icon: MdWarning, label: "Alerts" },
  { path: "/admin/settings", icon: MdSettings, label: "Settings" },
  { path: "/admin/pins", icon: MdPin, label: "Class PINs" },
];

const PAGE_TITLES = {
  "/admin/overview": {
    title: "Dashboard Overview",
    subtitle: "Real-time school monitoring",
  },
  "/admin/monitor": {
    title: "Live Monitor",
    subtitle: "Live teacher & class activity",
  },
  "/admin/teachers": {
    title: "Teachers",
    subtitle: "Staff attendance management",
  },
  "/admin/classes": {
    title: "Active Classes",
    subtitle: "Live classroom tracking",
  },
  "/admin/reports": {
    title: "Attendance Reports",
    subtitle: "Generate and export reports",
  },
  "/admin/analytics": { title: "Analytics", subtitle: "Performance insights" },
  "/admin/alerts": { title: "Alerts", subtitle: "Issues requiring attention" },
  "/admin/settings": { title: "Settings", subtitle: "System configuration" },
  "/admin/pins": {
    title: "Class PINs",
    subtitle: "Daily classroom verification codes",
  },
};

export default function AdminApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    function update() {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      );
      setDate(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      );
    }
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  function handleNav(path) {
    navigate(path);
    setSidebarOpen(false);
  }

  const currentPage = PAGE_TITLES[location.pathname] || {
    title: "Classpulse Admin",
    subtitle: "",
  };
  const name = displayName(user) || "Principal";
  const initls = initials(user) || "PR";

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        background: "#F1F5F9",
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      {/* ── MOBILE OVERLAY ─────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 99,
            backdropFilter: "blur(2px)",
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ══════════════════════════════════════════════════════════
          SIDEBAR
      ══════════════════════════════════════════════════════════ */}
      <aside
        style={{
          width: 260,
          maxWidth: "85vw",
          flexShrink: 0,
          background: "#0F1F47",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 100,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
          overflowX: "hidden",
        }}
        className="admin-sidebar"
      >
        {/* Logo */}
        <div
          style={{
            padding: "24px 20px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                background: "white",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <img
                src="/logo.png"
                alt="Classpulse"
                style={{ width: 32, height: 32, objectFit: "contain" }}
              />
            </div>
            <div>
              <h1
                style={{
                  fontFamily: "Sora, sans-serif",
                  fontSize: 17,
                  fontWeight: 800,
                  color: "white",
                  margin: 0,
                }}
              >
                <span style={{ color: "#29ABE2" }}>Class</span>pulse
              </h1>
              <p
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.45)",
                  margin: 0,
                }}
              >
                G.T.C Agidingbi, Lagos
              </p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: "12px 12px", overflowY: "auto" }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase",
              letterSpacing: "1px",
              padding: "8px 8px 4px",
              margin: 0,
            }}
          >
            Main Menu
          </p>
          {NAV_ITEMS.slice(0, 6).map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => handleNav(path)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 12px",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  background: active ? "rgba(41,171,226,0.15)" : "transparent",
                  color: active ? "#29ABE2" : "rgba(255,255,255,0.6)",
                  fontSize: 13,
                  fontWeight: active ? 700 : 500,
                  fontFamily: "DM Sans, sans-serif",
                  marginBottom: 2,
                  textAlign: "left",
                  borderLeft: active
                    ? "3px solid #29ABE2"
                    : "3px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                <Icon size={18} />
                {label}
              </button>
            );
          })}

          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase",
              letterSpacing: "1px",
              padding: "16px 8px 4px",
              margin: 0,
            }}
          >
            Reports
          </p>
          {NAV_ITEMS.slice(6).map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => handleNav(path)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 12px",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  background: active ? "rgba(41,171,226,0.15)" : "transparent",
                  color: active ? "#29ABE2" : "rgba(255,255,255,0.6)",
                  fontSize: 13,
                  fontWeight: active ? 700 : 500,
                  fontFamily: "DM Sans, sans-serif",
                  marginBottom: 2,
                  textAlign: "left",
                  borderLeft: active
                    ? "3px solid #29ABE2"
                    : "3px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                <Icon size={18} />
                {label}
              </button>
            );
          })}
        </nav>

        {/* User + logout */}
        <div
          style={{
            padding: "16px 12px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "#29ABE2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                color: "white",
                flexShrink: 0,
              }}
            >
              {initls}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "white",
                  margin: 0,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {name}
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.4)",
                  margin: 0,
                }}
              >
                Principal
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 12px",
              borderRadius: 10,
              border: "none",
              background: "rgba(239,68,68,0.1)",
              color: "#FCA5A5",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            <MdLogout size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          marginLeft: 0,
          transition: "margin 0.3s",
        }}
        className="admin-main"
      >
        {/* ── TOPBAR ─────────────────────────────────────────────── */}
        <header
          className="admin-topbar"
          style={{
            width: "100%",
            background: "white",
            borderBottom: "1px solid #E2E8F0",
            padding: "0 20px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            position: "sticky",
            top: 0,
            zIndex: 50,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* Hamburger */}
            <button
              className="admin-hamburger"
              onClick={() => setSidebarOpen((p) => !p)}
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                border: "1px solid #E2E8F0",
                background: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748B",
              }}
            >
              {sidebarOpen ? <MdClose size={20} /> : <MdMenu size={20} />}
            </button>
            <div>
              <h2
                style={{
                  fontFamily: "Sora, sans-serif",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#0F172A",
                  margin: 0,
                }}
              >
                {currentPage.title}
              </h2>
              <p style={{ fontSize: 12, color: "#94A3B8", margin: 0 }}>
                {currentPage.subtitle}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Live badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "#ECFDF5",
                border: "1px solid #6EE7B7",
                borderRadius: 20,
                padding: "5px 12px",
              }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#10B981",
                  animation: "pulse 2s infinite",
                }}
              />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#10B981" }}>
                LIVE
              </span>
            </div>
            {/* Clock */}
            <div
              style={{
                display: "none",
                alignItems: "center",
                gap: 6,
                color: "#64748B",
                fontSize: 13,
              }}
              className="admin-clock"
            >
              <FiClock size={14} />
              <span style={{ fontWeight: 600 }}>{time}</span>
              <span style={{ color: "#94A3B8" }}>{date}</span>
            </div>
            {/* Notifications */}
            <button
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                border: "1px solid #E2E8F0",
                background: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748B",
                position: "relative",
              }}
            >
              <MdNotifications size={20} />
              <span
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#EF4444",
                  border: "2px solid white",
                }}
              />
            </button>
            {/* Avatar */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "#29ABE2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                color: "white",
                cursor: "pointer",
              }}
            >
              {initls}
            </div>
          </div>
        </header>

        {/* ── PAGE CONTENT ─────────────────────────────────────── */}
        <main
          style={{
            flex: 1,
            padding: 24,
            overflowY: "auto",
            overflowX: "hidden",
            width: "100%",
            minWidth: 0,
            boxSizing: "border-box",
          }}
        >
          <Outlet />
        </main>
      </div>

      {/* ── STYLES ─────────────────────────────────────────────── */}
      <style>{`
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  /* ── DESKTOP: sidebar always visible, main pushed right ── */
  @media (min-width: 768px) {
    .admin-sidebar {
      transform: translateX(0) !important;
      position: fixed !important;
    }
    .admin-main {
      margin-left: 260px !important;
      width: calc(100% - 260px) !important;
    }
    .admin-clock {
      display: flex !important;
    }
    .admin-hamburger {
      display: none !important;
    }
  }

  /* ── MOBILE: sidebar hidden by default ── */
  @media (max-width: 767px) {
    .admin-sidebar {
      position: fixed !important;
    }
    .admin-main {
      margin-left: 0 !important;
      width: 100% !important;
      max-width: 100% !important;
    }
    .admin-topbar {
      padding: 12px 12px !important;
      height: auto !important;
      flex-wrap: wrap !important;
      gap: 10px !important;
    }
    .admin-topbar > div:first-child {
      min-width: 0 !important;
      flex: 1 1 100% !important;
    }
    main {
      padding: 16px 12px !important;
    }
  }

  /* ── TOPBAR: always full width of main area ── */
  .admin-topbar {
    width: 100%;
    box-sizing: border-box;
  }
`}</style>
    </div>
  );
}
