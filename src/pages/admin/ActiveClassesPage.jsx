import { useState } from "react";
import { FiEye, FiX, FiClock } from "react-icons/fi";
import { MdClass, MdCheckCircle, MdSchedule, MdCancel } from "react-icons/md";

const CLASSES = [
  {
    sub: "English Language",
    teacher: "Mr. John Adeola",
    id: "TCH-001",
    meta: "Tech 2 — Computer Crafts",
    room: "Room 14",
    time: "9:00–10:00",
    status: "active",
    elapsed: "0:42",
    color: "#2563EB",
    init: "JA",
  },
  {
    sub: "ICT",
    teacher: "Mrs. Chioma Nwankwo",
    id: "TCH-002",
    meta: "Tech 1 — Computer Crafts",
    room: "Lab B",
    time: "9:30–10:30",
    status: "active",
    elapsed: "0:28",
    color: "#7C3AED",
    init: "CN",
  },
  {
    sub: "Physics",
    teacher: "Mr. Emeka Okafor",
    id: "TCH-003",
    meta: "Tech 3 — Electronic Works",
    room: "Lab A",
    time: "9:45–10:45",
    status: "active",
    elapsed: "0:15",
    color: "#059669",
    init: "EO",
  },
  {
    sub: "Chemistry",
    teacher: "Mr. Kunle Adeyemi",
    id: "TCH-005",
    meta: "Tech 2 — Electrical Installation",
    room: "Room 20",
    time: "9:00–10:00",
    status: "active",
    elapsed: "0:55",
    color: "#DC2626",
    init: "KA",
  },
  {
    sub: "Basic Programming",
    teacher: "Mr. John Adeola",
    id: "TCH-001",
    meta: "Tech 3 — Computer Crafts",
    room: "Lab B",
    time: "1:00–2:00",
    status: "upcoming",
    elapsed: "—",
    color: "#2563EB",
    init: "JA",
  },
  {
    sub: "Economics",
    teacher: "Mrs. Funke Adeyemi",
    id: "TCH-006",
    meta: "Tech 1 — Bookkeeping",
    room: "Room 11",
    time: "10:30–11:30",
    status: "upcoming",
    elapsed: "—",
    color: "#0284C7",
    init: "FA",
  },
  {
    sub: "AutoCAD",
    teacher: "Mr. Adewale Balogun",
    id: "TCH-009",
    meta: "Tech 2 — Draughtsmanship",
    room: "Lab C",
    time: "10:00–11:00",
    status: "upcoming",
    elapsed: "—",
    color: "#0284C7",
    init: "AB",
  },
  {
    sub: "Technical Drawing",
    teacher: "—",
    id: "—",
    meta: "Tech 2 — Draughtsmanship",
    room: "Room 9",
    time: "11:00–12:00",
    status: "absent",
    elapsed: "—",
    color: "#94A3B8",
    init: "?",
  },
  {
    sub: "Mathematics",
    teacher: "Mr. Kunle Adeyemi",
    id: "TCH-005",
    meta: "Tech 1 — Electrical Installation",
    room: "Room 3",
    time: "8:00–9:00",
    status: "done",
    elapsed: "60min",
    color: "#DC2626",
    init: "KA",
  },
  {
    sub: "Biology",
    teacher: "Mrs. Bola Taiwo",
    id: "TCH-004",
    meta: "Tech 3 — Garment Making",
    room: "Room 11",
    time: "8:00–9:00",
    status: "done",
    elapsed: "58min",
    color: "#D97706",
    init: "BT",
  },
];

const STATUS_CONFIG = {
  active: { label: "Active", color: "#10B981", bg: "#ECFDF5", dot: true },
  upcoming: { label: "Upcoming", color: "#2563EB", bg: "#EFF6FF", dot: false },
  absent: { label: "Absent", color: "#EF4444", bg: "#FEF2F2", dot: false },
  done: { label: "Done", color: "#94A3B8", bg: "#F1F5F9", dot: false },
};

export default function ActiveClassesPage() {
  const [filter, setFilter] = useState("all");
  const [detail, setDetail] = useState(null);

  const activeCount = CLASSES.filter((c) => c.status === "active").length;
  const upcomingCount = CLASSES.filter((c) => c.status === "upcoming").length;
  const doneCount = CLASSES.filter((c) => c.status === "done").length;
  const absentCount = CLASSES.filter((c) => c.status === "absent").length;

  const filtered =
    filter === "all" ? CLASSES : CLASSES.filter((c) => c.status === filter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── STAT CARDS ─────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 14,
        }}
      >
        {[
          {
            icon: MdClass,
            val: activeCount,
            label: "Active Now",
            color: "#10B981",
            bg: "#ECFDF5",
          },
          {
            icon: MdSchedule,
            val: upcomingCount,
            label: "Upcoming",
            color: "#2563EB",
            bg: "#EFF6FF",
          },
          {
            icon: MdCheckCircle,
            val: doneCount,
            label: "Completed",
            color: "#94A3B8",
            bg: "#F1F5F9",
          },
          {
            icon: MdCancel,
            val: absentCount,
            label: "No Teacher",
            color: "#EF4444",
            bg: "#FEF2F2",
          },
        ].map(({ icon: Icon, val, label, color, bg }) => (
          <div
            key={label}
            style={{
              background: "white",
              borderRadius: 14,
              padding: "16px 18px",
              border: "1px solid #E2E8F0",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <Icon size={20} color={color} />
            </div>
            <p
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: 28,
                fontWeight: 800,
                color,
                margin: 0,
              }}
            >
              {val}
            </p>
            <p style={{ fontSize: 12, color: "#64748B", margin: "3px 0 0" }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* ── FILTER TABS ────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {[
          { key: "all", label: "All Classes" },
          { key: "active", label: "Active" },
          { key: "upcoming", label: "Upcoming" },
          { key: "absent", label: "No Teacher" },
          { key: "done", label: "Completed" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: "7px 16px",
              borderRadius: 20,
              border: "none",
              cursor: "pointer",
              background: filter === f.key ? "#2563EB" : "#F1F5F9",
              color: filter === f.key ? "white" : "#64748B",
              fontSize: 12,
              fontWeight: 700,
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── TABLE ──────────────────────────────────────────────── */}
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
            {filter === "active" && (
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#10B981",
                  animation: "pulse 2s infinite",
                }}
              />
            )}
            <h3
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: "#0F172A",
                margin: 0,
              }}
            >
              All Classes Today — {filtered.length} total
            </h3>
          </div>
          {filter === "active" && (
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
              LIVE TRACKING
            </span>
          )}
        </div>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 680 }}
          >
            <thead>
              <tr style={{ background: "#F8FAFC" }}>
                {[
                  "Subject",
                  "Teacher",
                  "Class / Trade",
                  "Room",
                  "Scheduled",
                  "Status",
                  "Duration",
                  "Detail",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#94A3B8",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((cls, i) => {
                const cfg = STATUS_CONFIG[cls.status];
                return (
                  <tr key={i} style={{ borderTop: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#0F172A",
                          margin: 0,
                        }}
                      >
                        {cls.sub}
                      </p>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 8,
                            background: cls.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 10,
                            fontWeight: 700,
                            color: "white",
                            flexShrink: 0,
                          }}
                        >
                          {cls.init}
                        </div>
                        <span style={{ fontSize: 12, color: "#334155" }}>
                          {cls.teacher}
                        </span>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: 12,
                        color: "#64748B",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {cls.meta}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: 12,
                        color: "#64748B",
                      }}
                    >
                      {cls.room}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: 12,
                        color: "#64748B",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {cls.time}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        {cfg.dot && (
                          <div
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: cfg.color,
                              animation: "pulse 2s infinite",
                            }}
                          />
                        )}
                        <span
                          style={{
                            fontSize: 11.5,
                            fontWeight: 700,
                            color: cfg.color,
                            background: cfg.bg,
                            padding: "3px 10px",
                            borderRadius: 20,
                          }}
                        >
                          {cfg.label}
                        </span>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: 12,
                        color: "#64748B",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      {cls.elapsed !== "—" && (
                        <FiClock size={11} color="#94A3B8" />
                      )}
                      {cls.elapsed}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <button
                        onClick={() => setDetail(cls)}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 8,
                          border: "1px solid #E2E8F0",
                          background: "white",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#64748B",
                        }}
                      >
                        <FiEye size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══ CLASS DETAIL MODAL ═══════════════════════════════════ */}
      {detail && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            backdropFilter: "blur(4px)",
            padding: 20,
          }}
          onClick={() => setDetail(null)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 420,
              background: "white",
              borderRadius: 24,
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                background: "linear-gradient(135deg, #1E40AF, #2563EB)",
                padding: "24px",
                position: "relative",
              }}
            >
              <button
                onClick={() => setDetail(null)}
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  borderRadius: 8,
                  width: 30,
                  height: 30,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <FiX size={15} />
              </button>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.6)",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  margin: "0 0 6px",
                }}
              >
                Class Detail
              </p>
              <h3
                style={{
                  fontFamily: "Sora, sans-serif",
                  fontSize: 22,
                  fontWeight: 800,
                  color: "white",
                  margin: "0 0 4px",
                }}
              >
                {detail.sub}
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.7)",
                  margin: 0,
                }}
              >
                {detail.meta}
              </p>
            </div>
            {/* Body */}
            <div style={{ padding: "20px 24px 28px" }}>
              {[
                { label: "Teacher", value: detail.teacher },
                { label: "Staff ID", value: detail.id },
                { label: "Room", value: detail.room },
                { label: "Scheduled", value: detail.time },
                { label: "Status", value: STATUS_CONFIG[detail.status].label },
                {
                  label: "Duration",
                  value:
                    detail.elapsed !== "—" ? detail.elapsed : "Not started",
                },
              ].map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: "1px solid #F1F5F9",
                  }}
                >
                  <span style={{ fontSize: 13, color: "#94A3B8" }}>
                    {row.label}
                  </span>
                  <span
                    style={{ fontSize: 13, color: "#0F172A", fontWeight: 600 }}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
              {detail.status === "absent" && (
                <button
                  style={{
                    width: "100%",
                    height: 48,
                    borderRadius: 12,
                    border: "none",
                    background: "#FEF2F2",
                    color: "#EF4444",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    marginTop: 16,
                    fontFamily: "DM Sans, sans-serif",
                  }}
                >
                  🚨 Flag as Idle Class
                </button>
              )}
              <button
                onClick={() => setDetail(null)}
                style={{
                  width: "100%",
                  height: 46,
                  borderRadius: 12,
                  border: "1px solid #E2E8F0",
                  background: "white",
                  color: "#64748B",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  marginTop: 10,
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}
