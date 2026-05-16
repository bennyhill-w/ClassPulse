import { useState, useEffect } from "react";
import { MdFilterList } from "react-icons/md";
import { FiRefreshCw } from "react-icons/fi";

const ALL_EVENTS = [
  {
    init: "JA",
    color: "#2563EB",
    name: "Mr. John Adeola",
    detail: "Checked in on time · GPS verified · Gate A",
    time: "7:58 AM",
    badge: "CHECKED IN",
    bcolor: "#ECFDF5",
    btcolor: "#10B981",
    type: "checkin",
  },
  {
    init: "CN",
    color: "#7C3AED",
    name: "Mrs. Chioma Nwankwo",
    detail: "Checked in on time · GPS verified · Gate A",
    time: "7:52 AM",
    badge: "CHECKED IN",
    bcolor: "#ECFDF5",
    btcolor: "#10B981",
    type: "checkin",
  },
  {
    init: "KA",
    color: "#DC2626",
    name: "Mr. Kunle Adeyemi",
    detail: "Checked in on time · QR Code scan · Gate A",
    time: "7:59 AM",
    badge: "CHECKED IN",
    bcolor: "#ECFDF5",
    btcolor: "#10B981",
    type: "checkin",
  },
  {
    init: "EO",
    color: "#059669",
    name: "Mr. Emeka Okafor",
    detail: "Checked in late · 20 minutes past 8:00 AM",
    time: "8:20 AM",
    badge: "LATE",
    bcolor: "#FEF3C7",
    btcolor: "#F59E0B",
    type: "late",
  },
  {
    init: "TR",
    color: "#7C3AED",
    name: "Mr. Tunde Rahman",
    detail: "Checked in late · 28 minutes past 8:00 AM",
    time: "8:28 AM",
    badge: "LATE",
    bcolor: "#FEF3C7",
    btcolor: "#F59E0B",
    type: "late",
  },
  {
    init: "AB",
    color: "#0284C7",
    name: "Mr. Adewale Balogun",
    detail: "Checked in · On Time · QR Code scan",
    time: "7:55 AM",
    badge: "CHECKED IN",
    bcolor: "#ECFDF5",
    btcolor: "#10B981",
    type: "checkin",
  },
  {
    init: "JA",
    color: "#2563EB",
    name: "Mr. John Adeola",
    detail: "Started English Language · Tech 2 Computer Crafts · Room 14",
    time: "9:01 AM",
    badge: "CLASS STARTED",
    bcolor: "#EFF6FF",
    btcolor: "#2563EB",
    type: "class",
  },
  {
    init: "KA",
    color: "#DC2626",
    name: "Mr. Kunle Adeyemi",
    detail: "Started Mathematics · Tech 3 Electrical · Room 3",
    time: "9:02 AM",
    badge: "CLASS STARTED",
    bcolor: "#EFF6FF",
    btcolor: "#2563EB",
    type: "class",
  },
  {
    init: "CN",
    color: "#7C3AED",
    name: "Mrs. Chioma Nwankwo",
    detail: "Started ICT · Tech 1 Computer Crafts · Lab B",
    time: "9:32 AM",
    badge: "CLASS STARTED",
    bcolor: "#EFF6FF",
    btcolor: "#2563EB",
    type: "class",
  },
  {
    init: "EO",
    color: "#059669",
    name: "Mr. Emeka Okafor",
    detail: "Started Physics · Tech 3 Electronic Works · Lab A",
    time: "9:47 AM",
    badge: "CLASS STARTED",
    bcolor: "#EFF6FF",
    btcolor: "#2563EB",
    type: "class",
  },
  {
    init: "OA",
    color: "#059669",
    name: "Mr. Ola Adesanya",
    detail: "Ended English Language class · 65 mins duration",
    time: "10:05 AM",
    badge: "CLASS ENDED",
    bcolor: "#F5F3FF",
    btcolor: "#7C3AED",
    type: "class",
  },
  {
    init: "KA",
    color: "#DC2626",
    name: "Mr. Kunle Adeyemi",
    detail: "Ended Mathematics · 58 mins duration",
    time: "10:00 AM",
    badge: "CLASS ENDED",
    bcolor: "#F5F3FF",
    btcolor: "#7C3AED",
    type: "class",
  },
  {
    init: "BT",
    color: "#D97706",
    name: "Mrs. Bola Taiwo",
    detail: "No check-in recorded · flagged absent",
    time: "9:00 AM",
    badge: "ABSENT",
    bcolor: "#FEF2F2",
    btcolor: "#EF4444",
    type: "late",
  },
  {
    init: "JA",
    color: "#2563EB",
    name: "Mr. John Adeola",
    detail: "Checked out · Arrived 7:58 AM · Left 3:42 PM",
    time: "3:42 PM",
    badge: "CHECKED OUT",
    bcolor: "#F5F3FF",
    btcolor: "#7C3AED",
    type: "checkout",
  },
  {
    init: "CN",
    color: "#7C3AED",
    name: "Mrs. Chioma Nwankwo",
    detail: "Checked out · Arrived 7:52 AM · Left 2:30 PM",
    time: "2:30 PM",
    badge: "CHECKED OUT",
    bcolor: "#F5F3FF",
    btcolor: "#7C3AED",
    type: "checkout",
  },
  {
    init: "FA",
    color: "#0284C7",
    name: "Mrs. Funke Adeyemi",
    detail: "Checked out · Arrived 8:01 AM · Left 3:15 PM",
    time: "3:15 PM",
    badge: "CHECKED OUT",
    bcolor: "#F5F3FF",
    btcolor: "#7C3AED",
    type: "checkout",
  },
];

const FILTERS = [
  { key: "all", label: "All Events" },
  { key: "checkin", label: "Check-ins" },
  { key: "checkout", label: "Check-outs" },
  { key: "class", label: "Classes" },
  { key: "late", label: "Late Arrivals" },
];

const STATS = [
  { key: "checkin", label: "Check-ins", color: "#10B981", bg: "#ECFDF5" },
  { key: "class", label: "Class Events", color: "#2563EB", bg: "#EFF6FF" },
  { key: "late", label: "Late / Absent", color: "#F59E0B", bg: "#FEF3C7" },
  { key: "checkout", label: "Check-outs", color: "#7C3AED", bg: "#F5F3FF" },
];

export default function LiveMonitorPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [events, setEvents] = useState(ALL_EVENTS);
  const [lastUpdate, setLastUpdate] = useState("just now");

  // Merge teacher app events from localStorage
  useEffect(() => {
    function sync() {
      try {
        const stored = JSON.parse(
          localStorage.getItem("klacify_events") || "[]",
        );
        if (stored.length > 0) {
          const mapped = stored.map((e) => ({
            init: e.avatar || "??",
            color: e.color || "#2563EB",
            name: e.name || "Teacher",
            detail: e.detail || "",
            time: e.time || "now",
            badge: e.badge || "EVENT",
            bcolor:
              e.bclass === "fb-green"
                ? "#ECFDF5"
                : e.bclass === "fb-blue"
                  ? "#EFF6FF"
                  : e.bclass === "fb-orange"
                    ? "#FEF3C7"
                    : "#F5F3FF",
            btcolor:
              e.bclass === "fb-green"
                ? "#10B981"
                : e.bclass === "fb-blue"
                  ? "#2563EB"
                  : e.bclass === "fb-orange"
                    ? "#F59E0B"
                    : "#7C3AED",
            type: e.badge?.includes("CHECK-IN")
              ? "checkin"
              : e.badge?.includes("OUT")
                ? "checkout"
                : e.badge === "LATE"
                  ? "late"
                  : "class",
          }));
          setEvents([...mapped, ...ALL_EVENTS]);
          setLastUpdate("just now");
        }
      } catch {}
    }
    sync();
    const t = setInterval(sync, 3000);
    return () => clearInterval(t);
  }, []);

  const filtered =
    activeFilter === "all"
      ? events
      : events.filter((e) => e.type === activeFilter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── HEADER ROW ─────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color: "#94A3B8",
          }}
        >
          <FiRefreshCw size={13} />
          Updated {lastUpdate}
        </div>
      </div>

      {/* ── MINI STATS ─────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 12,
        }}
      >
        {STATS.map((st) => {
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
              <p
                style={{
                  fontSize: 12,
                  color: "#64748B",
                  margin: "3px 0 0",
                  fontWeight: 500,
                }}
              >
                {st.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── FILTER TABS ────────────────────────────────────────── */}
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
              transition: "all 0.15s",
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

      {/* ── FEED ───────────────────────────────────────────────── */}
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

        {filtered.length === 0 ? (
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
              Events will appear here in real time
            </p>
          </div>
        ) : (
          filtered.map((e, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 20px",
                borderBottom:
                  i < filtered.length - 1 ? "1px solid #F8FAFC" : "none",
                transition: "background 0.15s",
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: e.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "white",
                  flexShrink: 0,
                }}
              >
                {e.init}
              </div>
              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#0F172A",
                    margin: 0,
                  }}
                >
                  {e.name}
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
              {/* Time + badge */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 5,
                  flexShrink: 0,
                }}
              >
                <span
                  style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500 }}
                >
                  {e.time}
                </span>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: e.btcolor,
                    background: e.bcolor,
                    padding: "3px 10px",
                    borderRadius: 20,
                    whiteSpace: "nowrap",
                  }}
                >
                  {e.badge}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}
