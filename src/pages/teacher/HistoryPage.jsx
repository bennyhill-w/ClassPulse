import { useState } from "react";
import {
  FiClock,
  FiCalendar,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

const FILTERS = ["Today", "This Week", "This Month"];

const HISTORY_DATA = {
  Today: [
    {
      sub: "English Language",
      meta: "Tech 2 — Garment Making · Room 4",
      time: "8:00–9:00 AM",
      status: "done",
      date: "Today",
    },
    {
      sub: "Computer Hardware",
      meta: "Tech 1 — Computer Crafts · Lab A",
      time: "9:10–10:10 AM",
      status: "done",
      date: "Today",
    },
    {
      sub: "Physics",
      meta: "Tech 2 — Electronic Works · Room 5",
      time: "10:20–11:20 AM",
      status: "late",
      date: "Today",
    },
    {
      sub: "Technical Drawing",
      meta: "Tech 1 — Draughtsmanship · Room 9",
      time: "12:00–1:00 PM",
      status: "done",
      date: "Today",
    },
  ],
  "This Week": [
    {
      sub: "ICT",
      meta: "Tech 2 — Computer Crafts · Lab B",
      time: "8:00–9:00 AM",
      status: "done",
      date: "Yesterday",
    },
    {
      sub: "AutoCAD",
      meta: "Tech 3 — Draughtsmanship · Lab C",
      time: "9:10–10:10 AM",
      status: "done",
      date: "Yesterday",
    },
    {
      sub: "Mathematics",
      meta: "Tech 1 — Computer Crafts · Room 7",
      time: "12:00–1:00 PM",
      status: "done",
      date: "Yesterday",
    },
    {
      sub: "English Language",
      meta: "Tech 1 — Computer Crafts · Room 7",
      time: "8:00–9:00 AM",
      status: "done",
      date: "Mon, 12 May",
    },
    {
      sub: "Mathematics",
      meta: "Tech 2 — Electrical Installation · Room 3",
      time: "9:10–10:10 AM",
      status: "late",
      date: "Mon, 12 May",
    },
    {
      sub: "Basic Electricity",
      meta: "Tech 1 — Electrical Installation · Lab A",
      time: "10:20–11:20 AM",
      status: "done",
      date: "Mon, 12 May",
    },
    {
      sub: "Physics",
      meta: "Tech 3 — Electronic Works · Room 5",
      time: "12:00–1:00 PM",
      status: "done",
      date: "Mon, 12 May",
    },
  ],
  "This Month": [
    {
      sub: "ICT",
      meta: "Tech 2 — Computer Crafts · Lab B",
      time: "8:00–9:00 AM",
      status: "done",
      date: "Week 2",
    },
    {
      sub: "Basic Programming",
      meta: "Tech 3 — Computer Crafts · Lab B",
      time: "1:30–2:30 PM",
      status: "done",
      date: "Week 2",
    },
    {
      sub: "Chemistry",
      meta: "Tech 2 — Refrigeration & A/C · Room 6",
      time: "10:20–11:20 AM",
      status: "late",
      date: "Week 2",
    },
    {
      sub: "AutoCAD",
      meta: "Tech 3 — Draughtsmanship · Lab C",
      time: "9:10–10:10 AM",
      status: "done",
      date: "Week 1",
    },
    {
      sub: "English Language",
      meta: "Tech 2 — Garment Making · Room 4",
      time: "8:00–9:00 AM",
      status: "done",
      date: "Week 1",
    },
    {
      sub: "Computer Hardware",
      meta: "Tech 1 — Computer Crafts · Lab A",
      time: "9:10–10:10 AM",
      status: "done",
      date: "Week 1",
    },
    {
      sub: "Physics",
      meta: "Tech 2 — Electronic Works · Room 5",
      time: "10:20–11:20 AM",
      status: "done",
      date: "Week 1",
    },
    {
      sub: "Technical Drawing",
      meta: "Tech 1 — Draughtsmanship · Room 9",
      time: "12:00–1:00 PM",
      status: "late",
      date: "Week 1",
    },
    {
      sub: "Economics",
      meta: "Tech 1 — Bookkeeping · Room 12",
      time: "2:40–3:30 PM",
      status: "done",
      date: "Week 1",
    },
  ],
};

export default function HistoryPage() {
  const [activeFilter, setActiveFilter] = useState("Today");

  const data = HISTORY_DATA[activeFilter] || [];
  const totalDone = data.filter((d) => d.status === "done").length;
  const totalLate = data.filter((d) => d.status === "late").length;

  // Group by date
  const grouped = data.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#F1F5F9",
      }}
    >
      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(135deg, #1E40AF, #2563EB)",
          padding: "20px 20px 16px",
          flexShrink: 0,
        }}
      >
        <h1
          style={{
            fontFamily: "Sora, sans-serif",
            fontSize: 20,
            fontWeight: 700,
            color: "white",
            margin: "0 0 14px",
          }}
        >
          Class History
        </h1>

        {/* Filter chips */}
        <div style={{ display: "flex", gap: 8 }}>
          {FILTERS.map((f) => {
            const active = f === activeFilter;
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  padding: "7px 16px",
                  borderRadius: 20,
                  border: active ? "none" : "1px solid rgba(255,255,255,0.25)",
                  background: active ? "white" : "rgba(255,255,255,0.12)",
                  color: active ? "#2563EB" : "rgba(255,255,255,0.8)",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── SCROLLABLE CONTENT ─────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 24px" }}>
        {/* Summary cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              background: "#ECFDF5",
              borderRadius: 14,
              padding: "14px 16px",
              border: "1px solid rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <FiCheckCircle size={16} color="#10B981" />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#10B981",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Completed
              </span>
            </div>
            <p
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: 28,
                fontWeight: 800,
                color: "#10B981",
                margin: 0,
              }}
            >
              {totalDone}
            </p>
            <p style={{ fontSize: 11.5, color: "#64748B", margin: "2px 0 0" }}>
              classes taught
            </p>
          </div>
          <div
            style={{
              background: "#FEF3C7",
              borderRadius: 14,
              padding: "14px 16px",
              border: "1px solid rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <FiAlertCircle size={16} color="#F59E0B" />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#F59E0B",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Late Start
              </span>
            </div>
            <p
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: 28,
                fontWeight: 800,
                color: "#F59E0B",
                margin: 0,
              }}
            >
              {totalLate}
            </p>
            <p style={{ fontSize: 11.5, color: "#64748B", margin: "2px 0 0" }}>
              late classes
            </p>
          </div>
        </div>

        {/* Grouped list */}
        {Object.entries(grouped).map(([date, items]) => (
          <div key={date}>
            {/* Date label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                margin: "16px 0 10px",
              }}
            >
              <FiCalendar size={13} color="#94A3B8" />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#94A3B8",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                }}
              >
                {date}
              </span>
            </div>

            {items.map((item, i) => (
              <div
                key={i}
                style={{
                  background: "white",
                  borderRadius: 14,
                  padding: "12px 14px",
                  marginBottom: 8,
                  border: "1px solid #E2E8F0",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: item.status === "done" ? "#EFF6FF" : "#FEF3C7",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FiClock
                    size={16}
                    color={item.status === "done" ? "#2563EB" : "#F59E0B"}
                  />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#0F172A",
                      margin: 0,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.sub}
                  </p>
                  <p
                    style={{
                      fontSize: 11.5,
                      color: "#64748B",
                      margin: "2px 0 0",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.meta}
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: "#94A3B8",
                      margin: "2px 0 0",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <FiClock size={10} /> {item.time}
                  </p>
                </div>

                {/* Badge */}
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: 20,
                    flexShrink: 0,
                    background: item.status === "done" ? "#ECFDF5" : "#FEF3C7",
                    color: item.status === "done" ? "#10B981" : "#F59E0B",
                  }}
                >
                  {item.status === "done" ? "✓ Done" : "⚠ Late start"}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
