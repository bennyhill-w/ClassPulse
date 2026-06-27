import { useState, useEffect, useCallback } from "react";
import { MdFilterList } from "react-icons/md";
import { FiRefreshCw } from "react-icons/fi";
import api from "../../services/api";

const FILTERS = [
  { key: "all", label: "All Events" },
  { key: "checkin", label: "Check-ins" },
  { key: "checkout", label: "Check-outs" },
  { key: "class_start", label: "Classes" },
  { key: "late", label: "Late Arrivals" },
];

const BADGE_COLORS = {
  "fb-green": { color: "#10B981", bg: "#ECFDF5" },
  "fb-blue": { color: "#2563EB", bg: "#EFF6FF" },
  "fb-orange": { color: "#F59E0B", bg: "#FEF3C7" },
  "fb-red": { color: "#EF4444", bg: "#FEF2F2" },
  "fb-purple": { color: "#7C3AED", bg: "#F5F3FF" },
};

const TEACHER_COLORS = [
  "#2563EB",
  "#7C3AED",
  "#059669",
  "#DC2626",
  "#0284C7",
  "#D97706",
];

function getColor(initials) {
  const idx =
    (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) %
    TEACHER_COLORS.length;
  return TEACHER_COLORS[idx];
}

const TYPE_STATS = [
  { key: "checkin", label: "Check-ins", color: "#10B981", bg: "#ECFDF5" },
  {
    key: "class_start",
    label: "Class Events",
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  { key: "late", label: "Late / Absent", color: "#F59E0B", bg: "#FEF3C7" },
  { key: "checkout", label: "Check-outs", color: "#7C3AED", bg: "#F5F3FF" },
];

export default function LiveMonitorPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState("Loading...");

  const loadFeed = useCallback(async () => {
    try {
      const res = await api.get("/admin/feed?limit=100");
      setEvents(res.data.data.events);
      setLastUpdate("just now");
    } catch (err) {
      console.error("Feed error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeed();
    const interval = setInterval(loadFeed, 15000);
    return () => clearInterval(interval);
  }, [loadFeed]);

  const filtered =
    activeFilter === "all"
      ? events
      : events.filter((e) => e.type === activeFilter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "Sora, sans-serif",
              fontSize: 18,
              fontWeight: 700,
              color: "#0F172A",
              margin: "0 0 2px",
            }}
          >
            Live Activity Monitor
          </h2>
          <p style={{ fontSize: 13, color: "#94A3B8", margin: 0 }}>
            Real-time feed of all teacher activity across G.T.C Agidingbi
          </p>
        </div>
        <button
          onClick={loadFeed}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color: "#64748B",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <FiRefreshCw size={13} /> Updated {lastUpdate}
        </button>
      </div>

      {/* Mini Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 12,
        }}
      >
        {TYPE_STATS.map((st) => {
          const count = events.filter((e) => e.type === st.key).length;
          return (
            <div
              key={st.key}
              onClick={() => setActiveFilter(st.key)}
              style={{
                background: st.bg,
                borderRadius: 14,
                padding: "14px 16px",
                cursor: "pointer",
                border: `1.5px solid ${activeFilter === st.key ? st.color : "transparent"}`,
                transition: "all 0.15s",
              }}
            >
              <p
                style={{
                  fontFamily: "Sora, sans-serif",
                  fontSize: 26,
                  fontWeight: 800,
                  color: st.color,
                  margin: 0,
                }}
              >
                {count}
              </p>
              <p style={{ fontSize: 12, color: "#64748B", margin: "3px 0 0" }}>
                {st.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#64748B",
            fontSize: 12,
            marginRight: 4,
          }}
        >
          <MdFilterList size={15} />
          <span>Filter:</span>
        </div>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              border: "none",
              cursor: "pointer",
              background: activeFilter === f.key ? "#2563EB" : "#F1F5F9",
              color: activeFilter === f.key ? "white" : "#64748B",
              fontSize: 12,
              fontWeight: 700,
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            {f.label}
            {f.key !== "all" && (
              <span
                style={{
                  marginLeft: 6,
                  background:
                    activeFilter === f.key
                      ? "rgba(255,255,255,0.25)"
                      : "#E2E8F0",
                  color: activeFilter === f.key ? "white" : "#64748B",
                  padding: "1px 6px",
                  borderRadius: 10,
                  fontSize: 10,
                }}
              >
                {events.filter((e) => e.type === f.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div
        style={{
          background: "white",
          borderRadius: 16,
          border: "1px solid #E2E8F0",
          overflow: "hidden",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            padding: "14px 20px",
            borderBottom: "1px solid #E2E8F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#10B981",
                animation: "pulse 2s infinite",
              }}
            />
            <h3
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: "#0F172A",
                margin: 0,
              }}
            >
              {FILTERS.find((f) => f.key === activeFilter)?.label} —{" "}
              {filtered.length} event{filtered.length !== 1 ? "s" : ""}
            </h3>
          </div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#10B981",
              background: "#ECFDF5",
              padding: "3px 10px",
              borderRadius: 20,
            }}
          >
            LIVE
          </span>
        </div>

        {loading ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "#94A3B8",
              fontSize: 13,
            }}
          >
            Loading events...
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              padding: "48px 24px",
              textAlign: "center",
              color: "#94A3B8",
            }}
          >
            <p style={{ fontSize: 32, margin: "0 0 8px" }}>📭</p>
            <p
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#64748B",
                margin: "0 0 4px",
              }}
            >
              No events yet
            </p>
            <p style={{ fontSize: 13, margin: 0 }}>
              Events will appear here as teachers check in and start classes
            </p>
          </div>
        ) : (
          filtered.map((e, i) => {
            const bc = BADGE_COLORS[e.badgeClass] || BADGE_COLORS["fb-blue"];
            const col = getColor(e.teacherInitials || "AA");
            return (
              <div
                key={e.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 20px",
                  borderBottom:
                    i < filtered.length - 1 ? "1px solid #F8FAFC" : "none",
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    background: col,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "white",
                    flexShrink: 0,
                  }}
                >
                  {e.teacherInitials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#0F172A",
                      margin: 0,
                    }}
                  >
                    {e.teacherName}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#64748B",
                      margin: "2px 0 0",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {e.detail}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 5,
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: 11, color: "#94A3B8" }}>
                    {e.time}
                  </span>
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: bc.color,
                      background: bc.bg,
                      padding: "3px 10px",
                      borderRadius: 20,
                    }}
                  >
                    {e.badge}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}
