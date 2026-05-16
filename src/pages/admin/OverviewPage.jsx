import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdPeople,
  MdPersonOff,
  MdAccessTime,
  MdClass,
  MdWarning,
  MdRefresh,
} from "react-icons/md";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";

// ── MOCK DATA ─────────────────────────────────────────────────────
const FEED_EVENTS = [
  {
    init: "JA",
    color: "#2563EB",
    name: "Mr. John Adeola",
    detail: "Checked in on time · GPS verified",
    time: "7:58 AM",
    badge: "CHECK-IN",
    bcolor: "#ECFDF5",
    btcolor: "#10B981",
  },
  {
    init: "CN",
    color: "#7C3AED",
    name: "Mrs. Chioma Nwankwo",
    detail: "Checked in on time · GPS verified",
    time: "7:52 AM",
    badge: "CHECK-IN",
    bcolor: "#ECFDF5",
    btcolor: "#10B981",
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
  },
  {
    init: "EO",
    color: "#059669",
    name: "Mr. Emeka Okafor",
    detail: "Checked in · Late by 20 minutes",
    time: "8:20 AM",
    badge: "LATE",
    bcolor: "#FEF3C7",
    btcolor: "#F59E0B",
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
  },
  {
    init: "TR",
    color: "#7C3AED",
    name: "Mr. Tunde Rahman",
    detail: "Checked in · Late by 28 minutes",
    time: "8:28 AM",
    badge: "LATE",
    bcolor: "#FEF3C7",
    btcolor: "#F59E0B",
  },
];

const ACTIVE_CLASSES = [
  {
    sub: "English Language",
    teacher: "Mr. Adeola",
    meta: "Tech 2 Computer Crafts · Room 14",
    elapsed: "0:42",
  },
  {
    sub: "ICT",
    teacher: "Mrs. Chioma",
    meta: "Tech 1 Computer Crafts · Lab B",
    elapsed: "0:28",
  },
  {
    sub: "Physics",
    teacher: "Mr. Emeka",
    meta: "Tech 3 Electronic Works · Lab A",
    elapsed: "0:15",
  },
  {
    sub: "Chemistry",
    teacher: "Mr. Kunle",
    meta: "Tech 2 Electrical · Room 20",
    elapsed: "0:55",
  },
];

const CHECKIN_DATA = [
  {
    init: "JA",
    color: "#2563EB",
    name: "Mr. John Adeola",
    id: "TCH-001",
    time: "7:58 AM",
    status: "On Time",
    scolor: "#10B981",
    sbg: "#ECFDF5",
    activity: "2 / 4 done",
    rate: 93,
  },
  {
    init: "CN",
    color: "#7C3AED",
    name: "Mrs. Chioma Nwankwo",
    id: "TCH-002",
    time: "7:52 AM",
    status: "On Time",
    scolor: "#10B981",
    sbg: "#ECFDF5",
    activity: "1 / 3 done",
    rate: 97,
  },
  {
    init: "EO",
    color: "#059669",
    name: "Mr. Emeka Okafor",
    id: "TCH-003",
    time: "8:20 AM",
    status: "Late",
    scolor: "#F59E0B",
    sbg: "#FEF3C7",
    activity: "Active Class",
    rate: 78,
  },
  {
    init: "BT",
    color: "#D97706",
    name: "Mrs. Bola Taiwo",
    id: "TCH-004",
    time: "—",
    status: "Absent",
    scolor: "#EF4444",
    sbg: "#FEF2F2",
    activity: "—",
    rate: 65,
  },
  {
    init: "KA",
    color: "#DC2626",
    name: "Mr. Kunle Adeyemi",
    id: "TCH-005",
    time: "7:59 AM",
    status: "On Time",
    scolor: "#10B981",
    sbg: "#ECFDF5",
    activity: "1 / 2 done",
    rate: 90,
  },
];

// ── STAT CARD ─────────────────────────────────────────────────────
function StatCard({ icon: Icon, iconBg, iconColor, value, label, sub, subUp }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        padding: "20px 20px",
        border: "1px solid #E2E8F0",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={22} color={iconColor} />
        </div>
        {sub && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 12,
              fontWeight: 600,
              color: subUp ? "#10B981" : "#EF4444",
            }}
          >
            {subUp ? <FiArrowUp size={12} /> : <FiArrowDown size={12} />}
            {sub}
          </div>
        )}
      </div>
      <p
        style={{
          fontFamily: "Sora, sans-serif",
          fontSize: 36,
          fontWeight: 800,
          color: "#0F172A",
          margin: "0 0 4px",
          lineHeight: 1,
        }}
      >
        {value}
      </p>
      <p style={{ fontSize: 13, color: "#64748B", margin: 0, fontWeight: 500 }}>
        {label}
      </p>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────
export default function OverviewPage() {
  const navigate = useNavigate();
  const [lastUpdated, setLastUpdated] = useState("just now");
  const [feedEvents, setFeedEvents] = useState(FEED_EVENTS);
  const [idleCount, setIdleCount] = useState(0);

  // Simulate new events coming in
  useEffect(() => {
    const t = setInterval(() => {
      setLastUpdated("just now");
    }, 30000);
    return () => clearInterval(t);
  }, []);

  // Check localStorage for teacher events
  useEffect(() => {
    function syncEvents() {
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
                    : e.bclass === "fb-red"
                      ? "#FEF2F2"
                      : "#F5F3FF",
            btcolor:
              e.bclass === "fb-green"
                ? "#10B981"
                : e.bclass === "fb-blue"
                  ? "#2563EB"
                  : e.bclass === "fb-orange"
                    ? "#F59E0B"
                    : e.bclass === "fb-red"
                      ? "#EF4444"
                      : "#7C3AED",
          }));
          setFeedEvents([...mapped, ...FEED_EVENTS].slice(0, 12));
        }
      } catch {}
    }
    syncEvents();
    const t = setInterval(syncEvents, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* ── DATE + REFRESH ─────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <p style={{ fontSize: 13, color: "#94A3B8", margin: 0 }}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
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
          <MdRefresh size={14} />
          <span>Updated {lastUpdated}</span>
        </div>
      </div>

      {/* ── STAT CARDS ─────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
        }}
      >
        <StatCard
          icon={MdPeople}
          iconBg="#ECFDF5"
          iconColor="#10B981"
          value="24"
          label="Teachers Present"
          sub="2 more vs yesterday"
          subUp={true}
        />
        <StatCard
          icon={MdPersonOff}
          iconBg="#FEF2F2"
          iconColor="#EF4444"
          value="3"
          label="Absent Today"
          sub="1 more vs yesterday"
          subUp={false}
        />
        <StatCard
          icon={MdAccessTime}
          iconBg="#FEF3C7"
          iconColor="#F59E0B"
          value="5"
          label="Late Arrivals"
          sub="20 mins avg late"
          subUp={false}
        />
        <StatCard
          icon={MdClass}
          iconBg="#EFF6FF"
          iconColor="#2563EB"
          value="4"
          label="Active Classes Now"
          sub="14 total scheduled"
          subUp={true}
        />
      </div>

      {/* ── IDLE CARD ──────────────────────────────────────────── */}
      <div
        style={{
          background: idleCount > 0 ? "#FEF2F2" : "white",
          borderRadius: 16,
          padding: "20px",
          border: idleCount > 0 ? "1.5px solid #FECACA" : "1px solid #E2E8F0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: idleCount > 0 ? "#FEF2F2" : "#F1F5F9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MdWarning
              size={22}
              color={idleCount > 0 ? "#EF4444" : "#94A3B8"}
            />
          </div>
          <div>
            <p
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: 28,
                fontWeight: 800,
                color: idleCount > 0 ? "#EF4444" : "#94A3B8",
                margin: 0,
              }}
            >
              {idleCount}
            </p>
            <p style={{ fontSize: 13, color: "#64748B", margin: 0 }}>
              Idle / Unattended Classes
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            const demo = [
              {
                sub: "Technical Drawing",
                meta: "Tech 2 Draughtsmanship · Room 9",
                time: "11:00 AM",
              },
            ];
            setIdleCount(demo.length);
          }}
          style={{
            padding: "8px 16px",
            borderRadius: 10,
            border: "1px solid #E2E8F0",
            background: "white",
            fontSize: 12,
            fontWeight: 700,
            color: "#64748B",
            cursor: "pointer",
            fontFamily: "DM Sans, sans-serif",
          }}
        >
          ⚡ Simulate Idle
        </button>
      </div>

      {/* ── BOTTOM GRID ─────────────────────────────────────────── */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}
      >
        {/* Live Activity Feed */}
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
              padding: "16px 20px",
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
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#0F172A",
                  margin: 0,
                }}
              >
                Live Activity Feed
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
              Real-time
            </span>
          </div>
          <div style={{ maxHeight: 400, overflowY: "auto" }}>
            {feedEvents.map((e, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 20px",
                  borderBottom: "1px solid #F8FAFC",
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: e.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "white",
                    flexShrink: 0,
                  }}
                >
                  {e.init}
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
                    {e.name}
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
                    {e.detail}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 4,
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: 10.5, color: "#94A3B8" }}>
                    {e.time}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: e.btcolor,
                      background: e.bcolor,
                      padding: "2px 8px",
                      borderRadius: 20,
                    }}
                  >
                    {e.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Today's Attendance */}
          <div
            style={{
              background: "white",
              borderRadius: 16,
              border: "1px solid #E2E8F0",
              padding: "16px 20px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <h3
                style={{
                  fontFamily: "Sora, sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#0F172A",
                  margin: 0,
                }}
              >
                Today's Attendance
              </h3>
              <span style={{ fontSize: 11, color: "#94A3B8" }}>
                31 staff total
              </span>
            </div>
            {[
              { label: "Present", val: 24, pct: 77, color: "#10B981" },
              { label: "Late", val: 4, pct: 13, color: "#F59E0B" },
              { label: "Absent", val: 3, pct: 10, color: "#EF4444" },
            ].map((row) => (
              <div key={row.label} style={{ marginBottom: 10 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{ fontSize: 12, color: "#64748B", fontWeight: 500 }}
                  >
                    {row.label}
                  </span>
                  <span
                    style={{ fontSize: 12, fontWeight: 700, color: row.color }}
                  >
                    {row.val} ({row.pct}%)
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    borderRadius: 3,
                    background: "#F1F5F9",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${row.pct}%`,
                      background: row.color,
                      borderRadius: 3,
                      transition: "width 0.6s ease",
                    }}
                  />
                </div>
              </div>
            ))}
            <p style={{ fontSize: 11, color: "#94A3B8", margin: "10px 0 0" }}>
              Last updated: just now
            </p>
          </div>

          {/* Active Classes */}
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
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3
                style={{
                  fontFamily: "Sora, sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#0F172A",
                  margin: 0,
                }}
              >
                Active Classes
              </h3>
              <button
                onClick={() => navigate("/admin/classes")}
                style={{
                  fontSize: 12,
                  color: "#2563EB",
                  fontWeight: 600,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                View all
              </button>
            </div>
            {ACTIVE_CLASSES.map((cls, i) => (
              <div
                key={i}
                style={{
                  padding: "12px 20px",
                  borderBottom:
                    i < ACTIVE_CLASSES.length - 1
                      ? "1px solid #F8FAFC"
                      : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 2,
                  }}
                >
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
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#10B981",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        color: "#10B981",
                      }}
                    >
                      LIVE
                    </span>
                  </div>
                </div>
                <p
                  style={{ fontSize: 11.5, color: "#64748B", margin: "2px 0" }}
                >
                  {cls.teacher} · {cls.meta}
                </p>
                <p style={{ fontSize: 11, color: "#94A3B8", margin: 0 }}>
                  ⏱ {cls.elapsed} elapsed
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TEACHER CHECK-IN STATUS ─────────────────────────────── */}
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
            padding: "16px 20px",
            borderBottom: "1px solid #E2E8F0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3
            style={{
              fontFamily: "Sora, sans-serif",
              fontSize: 15,
              fontWeight: 700,
              color: "#0F172A",
              margin: 0,
            }}
          >
            Teacher Check-in Status
          </h3>
          <button
            onClick={() => navigate("/admin/teachers")}
            style={{
              fontSize: 12,
              color: "#2563EB",
              fontWeight: 600,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            View all teachers
          </button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}
          >
            <thead>
              <tr style={{ background: "#F8FAFC" }}>
                {[
                  "Teacher",
                  "Staff ID",
                  "Check-in Time",
                  "Status",
                  "Today's Activity",
                  "Attendance Rate",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 20px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#94A3B8",
                      textTransform: "uppercase",
                      letterSpacing: "0.6px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CHECKIN_DATA.map((t, i) => (
                <tr key={i} style={{ borderTop: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "12px 20px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: t.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          fontWeight: 700,
                          color: "white",
                          flexShrink: 0,
                        }}
                      >
                        {t.init}
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#0F172A",
                        }}
                      >
                        {t.name}
                      </span>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "12px 20px",
                      fontSize: 12,
                      color: "#64748B",
                    }}
                  >
                    {t.id}
                  </td>
                  <td
                    style={{
                      padding: "12px 20px",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#0F172A",
                    }}
                  >
                    {t.time}
                  </td>
                  <td style={{ padding: "12px 20px" }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: t.scolor,
                        background: t.sbg,
                        padding: "4px 10px",
                        borderRadius: 20,
                      }}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "12px 20px",
                      fontSize: 12,
                      color: "#64748B",
                    }}
                  >
                    {t.activity}
                  </td>
                  <td style={{ padding: "12px 20px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <div
                        style={{
                          width: 60,
                          height: 6,
                          borderRadius: 3,
                          background: "#F1F5F9",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${t.rate}%`,
                            background:
                              t.rate >= 90
                                ? "#10B981"
                                : t.rate >= 75
                                  ? "#F59E0B"
                                  : "#EF4444",
                            borderRadius: 3,
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#0F172A",
                        }}
                      >
                        {t.rate}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}
