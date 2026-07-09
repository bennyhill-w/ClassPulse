import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBell,
  FiUser,
  FiMapPin,
  FiClock,
  FiPlay,
  FiCheck,
} from "react-icons/fi";
import useAuthStore from "../../store/authStore";
import api from "../../services/api";
import Toast from "../../components/ui/Toast";
import { greeting, shortDate, timeStr, displayName } from "../../utils/helpers";

export default function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [time, setTime] = useState(timeStr());
  const [date, setDate] = useState(shortDate());
  const [toast, setToast] = useState(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinModalType, setPinModalType] = useState("start"); // 'start' | 'end'
  const [pinValue, setPinValue] = useState("");
  const [pinError, setPinError] = useState("");
  const [pendingIdx, setPendingIdx] = useState(null);
  const [pinLoading, setPinLoading] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [checkOutTime, setCheckOutTime] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [classStates, setClassStates] = useState({});
  const [todayClasses, setTodayClasses] = useState([]);
  const [recentHistory, setRecentHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifs, setShowNotifs] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState(null);

  const checkInTime = sessionStorage.getItem("cp_checkin_time") || "8:00 AM";

  // Live clock
  useEffect(() => {
    const t = setInterval(() => {
      setTime(timeStr());
      setDate(shortDate());
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const res = await api.get("/teacher/notifications");
        setNotifications(res.data.data.notifications || []);
        setUnreadCount(res.data.data.unreadCount || 0);
      } catch (err) {
        console.error("Notifications error:", err);
      }
    }

    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function loadTodayData() {
      try {
        const timetableRes = await api.get("/teacher/timetable");
        const timetable = timetableRes.data.data.timetable;
        const todayDow = new Date().getDay();
        const targetDow = todayDow === 0 || todayDow === 6 ? 1 : todayDow;
        const todayEntries = timetable[targetDow] || [];

        setTodayClasses(
          todayEntries.map((entry) => ({
            id: entry.id,
            start: entry.startTime,
            end: entry.endTime,
            sub: entry.subject,
            meta: `${entry.classYear} — ${entry.trade} · ${entry.room}`,
          })),
        );

        const historyRes = await api.get("/teacher/class/history?filter=week");
        const sessions = historyRes.data.data.sessions || [];
        setRecentHistory(
          sessions.slice(0, 3).map((s) => ({
            sub: s.subject,
            meta: `${s.trade} · ${s.room}`,
            time: new Date(s.startedAt).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            }),
            status: s.endedAt ? "Done" : "Active",
            color: s.endedAt ? "#10B981" : "#2563EB",
            bg: s.endedAt ? "#ECFDF5" : "#EFF6FF",
          })),
        );

        const attRes = await api.get("/checkin/today");
        setTodayAttendance(attRes.data.data.attendance);
      } catch (err) {
        console.error("Failed to load today data:", err);
      }
    }

    loadTodayData();
  }, []);

  // Start / End class
  function toggleClass(idx) {
    const state = classStates[idx] || "idle";
    if (state === "done") return;

    setPendingIdx(idx);
    setPinValue("");
    setPinError("");

    if (state === "idle") {
      setPinModalType("start");
      setShowPinModal(true);
    } else if (state === "active") {
      setPinModalType("end");
      setShowPinModal(true);
    }
  }

  async function submitPin() {
    if (!pinValue.trim() || pinValue.length < 4) {
      setPinError("Please enter the 4-digit PIN");
      return;
    }

    setPinLoading(true);
    setPinError("");

    const cls = todayClasses[pendingIdx];
    const state = classStates[pendingIdx] || "idle";

    try {
      if (state === "idle") {
        const metaParts = cls.meta.split("—");
        const classYear = metaParts[0]?.trim() || "Tech 1";
        const tradeRoom = metaParts[1]?.split("·") || [];
        const trade = tradeRoom[0]?.trim() || "General";
        const room = tradeRoom[1]?.trim() || "Room 1";

        const res = await api.post("/teacher/class/start", {
          subject: cls.sub,
          trade,
          classYear,
          room,
          pin: pinValue,
        });
        const sessionId = res.data.data.session.id;
        setClassStates((prev) => ({
          ...prev,
          [pendingIdx]: "active",
          [`${pendingIdx}_sessionId`]: sessionId,
        }));
        setToast({
          message: `✅ ${cls.sub} started! Admin notified.`,
          type: "success",
        });
      } else if (state === "active") {
        const sessionId = classStates[`${pendingIdx}_sessionId`];
        const res = await api.post("/teacher/class/end", {
          sessionId,
          pin: pinValue,
        });
        const { durationMins } = res.data.data;
        setClassStates((prev) => ({ ...prev, [pendingIdx]: "done" }));
        setToast({
          message: `Class ended — ${durationMins} min${durationMins !== 1 ? "s" : ""}`,
          type: "success",
        });
      }

      setShowPinModal(false);
      setPinValue("");
      setPendingIdx(null);
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid PIN. Try again.";
      setPinError(msg);
    } finally {
      setPinLoading(false);
    }
  }

  // Checkout
  async function confirmCheckOut() {
    try {
      const res = await api.post("/checkin/checkout");
      const t = res.data.data.checkOutTime;
      setCheckOutTime(t);
      setCheckedOut(true);
      setShowCheckout(false);
      setToast({
        message: "✅ Checked out. See you tomorrow!",
        type: "success",
      });
    } catch (err) {
      const message =
        err.response?.data?.message || "Checkout failed. Try again.";
      setToast({ message, type: "error" });
      setShowCheckout(false);
    }
  }

  const name = displayName(user) || "Teacher";
  const initials =
    `${(user?.firstName || "T")[0]}${(user?.lastName || "C")[0]}`.toUpperCase();

  const classCount = todayClasses.length;
  const doneCount = Object.values(classStates).filter(
    (s) => s === "done",
  ).length;

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
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Bg circles */}
        <div
          style={{
            position: "absolute",
            right: -30,
            top: -30,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 50,
            bottom: -40,
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            pointerEvents: "none",
          }}
        />

        {/* Top row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 14,
          }}
        >
          <div>
            <p
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 13,
                margin: 0,
              }}
            >
              {greeting()}
            </p>
            <h1
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: 20,
                fontWeight: 700,
                color: "white",
                margin: "2px 0",
              }}
            >
              {name} 👋
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: 12,
                margin: 0,
              }}
            >
              {date}
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              onClick={() => setShowNotifs((p) => !p)}
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "rgba(255,255,255,0.15)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <FiBell size={18} color="white" />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#EF4444",
                    border: "2px solid #2563EB",
                  }}
                />
              )}
            </button>
            <button
              onClick={() => navigate("/teacher/profile")}
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "rgba(255,255,255,0.15)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiUser size={18} color="white" />
            </button>
          </div>
        </div>

        {/* ── CHECK-IN CARD ──────────────────────────────────────── */}
        {!checkedOut ? (
          <div
            style={{
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 18,
              padding: "14px 16px 12px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  background: todayAttendance?.isLate
                    ? "rgba(245,158,11,0.25)"
                    : "rgba(52,211,153,0.25)",
                  color: todayAttendance?.isLate ? "#FCD34D" : "#A7F3D0",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: 20,
                  letterSpacing: "0.5px",
                }}
              >
                {todayAttendance?.isLate
                  ? `LATE — ${todayAttendance.lateMinutes} mins ⚠`
                  : "ON TIME ✓"}
              </span>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FiCheck size={16} color="white" />
              </div>
            </div>
            <p
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: 20,
                fontWeight: 800,
                color: "white",
                margin: "0 0 3px",
              }}
            >
              Checked In
            </p>
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.7)",
                margin: "0 0 12px",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <FiClock size={12} /> Arrived at{" "}
              <strong style={{ color: "white" }}>
                {todayAttendance
                  ? new Date(todayAttendance.checkInAt).toLocaleTimeString(
                      "en-US",
                      { hour: "numeric", minute: "2-digit", hour12: true },
                    )
                  : checkInTime}
              </strong>
            </p>
            <button
              onClick={() => setShowCheckout(true)}
              style={{
                width: "100%",
                height: 40,
                background: "rgba(255,255,255,0.15)",
                border: "1.5px solid rgba(255,255,255,0.3)",
                borderRadius: 11,
                color: "white",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              <FiMapPin size={13} /> Check Out for the Day
            </button>
          </div>
        ) : (
          <div
            style={{
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 18,
              padding: "14px 16px 14px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.7)",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: 20,
                }}
              >
                CHECKED OUT 🏁
              </span>
            </div>
            <p
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: 20,
                fontWeight: 800,
                color: "white",
                margin: "0 0 10px",
              }}
            >
              Checked Out
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { label: "Arrived", val: checkInTime },
                { label: "Departed", val: checkOutTime },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: 10,
                    padding: "8px 12px",
                  }}
                >
                  <p
                    style={{
                      fontSize: 10,
                      color: "rgba(255,255,255,0.5)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      margin: "0 0 2px",
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "white",
                      margin: 0,
                    }}
                  >
                    {item.val}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── SCROLLABLE CONTENT ─────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 20px" }}>
        {/* Quick stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 10,
            marginBottom: 20,
          }}
        >
          {[
            {
              val: classCount,
              label: "Classes Today",
              color: "#2563EB",
              bg: "#EFF6FF",
            },
            {
              val: doneCount,
              label: "Completed",
              color: "#10B981",
              bg: "#ECFDF5",
            },
            { val: 28, label: "Days On Time", color: "#F59E0B", bg: "#FEF3C7" },
          ].map((st) => (
            <div
              key={st.label}
              style={{
                background: st.bg,
                borderRadius: 14,
                padding: "12px 10px",
                textAlign: "center",
                border: "1px solid rgba(0,0,0,0.04)",
              }}
            >
              <p
                style={{
                  fontFamily: "Sora, sans-serif",
                  fontSize: 24,
                  fontWeight: 800,
                  color: st.color,
                  margin: 0,
                }}
              >
                {st.val}
              </p>
              <p
                style={{
                  fontSize: 10.5,
                  color: "#64748B",
                  margin: "2px 0 0",
                  lineHeight: 1.3,
                }}
              >
                {st.label}
              </p>
            </div>
          ))}
        </div>

        {/* Today's Schedule */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <h3
            style={{
              fontFamily: "Sora, sans-serif",
              fontSize: 16,
              fontWeight: 700,
              color: "#0F172A",
              margin: 0,
            }}
          >
            📅 Today's Schedule
          </h3>
          <button
            onClick={() => navigate("/teacher/schedule")}
            style={{
              fontSize: 13,
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

        {todayClasses.slice(0, 4).map((cls, idx) => {
          const state = classStates[idx] || "idle";
          return (
            <div
              key={idx}
              style={{
                background: "white",
                borderRadius: 16,
                padding: "14px 16px",
                marginBottom: 10,
                border: "1px solid #E2E8F0",
                display: "flex",
                alignItems: "center",
                gap: 12,
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ flexShrink: 0, textAlign: "center", minWidth: 44 }}>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#0F172A",
                    margin: 0,
                  }}
                >
                  {cls.start}
                </p>
                <div
                  style={{
                    width: 1,
                    height: 14,
                    background: "#E2E8F0",
                    margin: "3px auto",
                  }}
                />
                <p style={{ fontSize: 11, color: "#94A3B8", margin: 0 }}>
                  {cls.end}
                </p>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 2,
                  }}
                >
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#0F172A",
                      margin: 0,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {cls.sub}
                  </p>
                  {/* Combined class badge */}
                  {cls.meta?.includes("+") && (
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        padding: "2px 7px",
                        borderRadius: 20,
                        background: "#F5F3FF",
                        color: "#7C3AED",
                        border: "1px solid #DDD6FE",
                        flexShrink: 0,
                        whiteSpace: "nowrap",
                      }}
                    >
                      COMBINED
                    </span>
                  )}
                </div>
                <p
                  style={{
                    fontSize: 11.5,
                    color: "#64748B",
                    margin: 0,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  📍 {cls.meta}
                </p>
              </div>
              <button
                onClick={() => toggleClass(idx)}
                style={{
                  flexShrink: 0,
                  height: 32,
                  padding: "0 14px",
                  borderRadius: 8,
                  border: "none",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: state === "done" ? "default" : "pointer",
                  fontFamily: "DM Sans, sans-serif",
                  background:
                    state === "idle"
                      ? "#ECFDF5"
                      : state === "active"
                        ? "linear-gradient(135deg, #10B981, #059669)"
                        : "#F1F5F9",
                  color:
                    state === "idle"
                      ? "#10B981"
                      : state === "active"
                        ? "white"
                        : "#94A3B8",
                }}
              >
                {state === "idle"
                  ? "Start"
                  : state === "active"
                    ? "🔴 End"
                    : "Done ✓"}
              </button>
            </div>
          );
        })}

        {/* Recent Activity */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "20px 0 12px",
          }}
        >
          <h3
            style={{
              fontFamily: "Sora, sans-serif",
              fontSize: 16,
              fontWeight: 700,
              color: "#0F172A",
              margin: 0,
            }}
          >
            📋 Recent Activity
          </h3>
          <button
            onClick={() => navigate("/teacher/history")}
            style={{
              fontSize: 13,
              color: "#2563EB",
              fontWeight: 600,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            See history
          </button>
        </div>

        {recentHistory.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              color: "#94A3B8",
              fontSize: 13,
            }}
          >
            No class history yet this week
          </div>
        ) : (
          recentHistory.map((item, i) => (
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
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: item.bg,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FiClock size={16} color={item.color} />
              </div>
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
                  }}
                >
                  {item.meta} · {item.time}
                </p>
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: item.color,
                  background: item.bg,
                  padding: "3px 10px",
                  borderRadius: 20,
                  flexShrink: 0,
                }}
              >
                {item.status}
              </span>
            </div>
          ))
        )}
      </div>

      {/* ── FAB — Add Class ───────────────────────────────────────── */}
      <button
        onClick={() => navigate("/teacher/schedule")}
        style={{
          position: "fixed",
          bottom: 90,
          right: 20,
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #2563EB, #1E40AF)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(37,99,235,0.45)",
          zIndex: 40,
        }}
      >
        <svg
          width="22"
          height="22"
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
          strokeWidth="2.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>

      {/* ── NOTIFICATIONS PANEL ────────────────────────────── */}
      {showNotifs && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 50 }}
          onClick={() => setShowNotifs(false)}
        >
          <div
            style={{
              position: "absolute",
              top: 70,
              right: 16,
              width: 300,
              background: "white",
              borderRadius: 16,
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
              border: "1px solid #E2E8F0",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "14px 16px",
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
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#2563EB",
                    background: "#EFF6FF",
                    padding: "2px 8px",
                    borderRadius: 20,
                  }}
                >
                  {unreadCount} new
                </span>
              )}
            </div>
            <div style={{ maxHeight: 320, overflowY: "auto" }}>
              {notifications.length === 0 ? (
                <div
                  style={{
                    padding: "24px",
                    textAlign: "center",
                    color: "#94A3B8",
                    fontSize: 13,
                  }}
                >
                  No notifications yet
                </div>
              ) : (
                notifications.map((n, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "12px 16px",
                      borderBottom: "1px solid #F8FAFC",
                      background: n.read ? "white" : "#F0F9FF",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#0F172A",
                        margin: "0 0 3px",
                      }}
                    >
                      {n.title}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: "#64748B",
                        margin: "0 0 4px",
                        lineHeight: 1.5,
                      }}
                    >
                      {n.body}
                    </p>
                    <p style={{ fontSize: 10.5, color: "#94A3B8", margin: 0 }}>
                      {new Date(n.createdAt).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── CHECKOUT MODAL ─────────────────────────────────────── */}
      {showCheckout && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            zIndex: 50,
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setShowCheckout(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 420,
              background: "white",
              borderRadius: "28px 28px 0 0",
              padding: "28px 24px 40px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: 40,
                height: 4,
                background: "#E2E8F0",
                borderRadius: 4,
                margin: "0 auto 24px",
              }}
            />
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 44, marginBottom: 8 }}>🏁</div>
              <h3
                style={{
                  fontFamily: "Sora, sans-serif",
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#0F172A",
                  margin: "0 0 6px",
                }}
              >
                Check Out for the Day?
              </h3>
              <p style={{ fontSize: 13, color: "#64748B", margin: 0 }}>
                This will record your departure time and notify the admin.
              </p>
            </div>
            <div
              style={{
                background: "#F8FAFC",
                borderRadius: 14,
                padding: "14px 16px",
                marginBottom: 20,
              }}
            >
              {[
                { label: "Checked In", val: checkInTime },
                { label: "Check Out Time", val: timeStr() },
              ].map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "6px 0",
                    borderBottom: i === 0 ? "1px solid #E2E8F0" : "none",
                  }}
                >
                  <span style={{ fontSize: 13, color: "#64748B" }}>
                    {row.label}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: i === 1 ? "#2563EB" : "#0F172A",
                    }}
                  >
                    {row.val}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={confirmCheckOut}
              style={{
                width: "100%",
                height: 52,
                borderRadius: 14,
                border: "none",
                background: "linear-gradient(135deg, #334155, #0F172A)",
                color: "white",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                marginBottom: 10,
                fontFamily: "DM Sans, sans-serif",
                boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              }}
            >
              ✓ Confirm Check Out
            </button>
            <button
              onClick={() => setShowCheckout(false)}
              style={{
                width: "100%",
                height: 44,
                background: "transparent",
                border: "none",
                fontSize: 14,
                color: "#94A3B8",
                cursor: "pointer",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── PIN MODAL ──────────────────────────────────────────── */}
      {showPinModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            zIndex: 60,
            backdropFilter: "blur(6px)",
          }}
          onClick={() => setShowPinModal(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 480,
              background: "white",
              borderRadius: "28px 28px 0 0",
              padding: "28px 24px 44px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: 40,
                height: 4,
                background: "#E2E8F0",
                borderRadius: 4,
                margin: "0 auto 24px",
              }}
            />

            {/* Icon */}
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: pinModalType === "start" ? "#ECFDF5" : "#FEF2F2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <span style={{ fontSize: 28 }}>
                {pinModalType === "start" ? "▶" : "⏹"}
              </span>
            </div>

            <h3
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: 19,
                fontWeight: 800,
                color: "#0F172A",
                textAlign: "center",
                margin: "0 0 6px",
              }}
            >
              {pinModalType === "start" ? "Start Class PIN" : "End Class PIN"}
            </h3>
            <p
              style={{
                fontSize: 13,
                color: "#64748B",
                textAlign: "center",
                margin: "0 0 24px",
                lineHeight: 1.6,
              }}
            >
              {pinModalType === "start"
                ? "Ask your class captain for today's Start PIN for this room"
                : "Ask your class captain for today's End PIN for this room"}
            </p>

            {/* PIN input */}
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  color: "#64748B",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                Enter 4-Digit PIN
              </label>
              <input
                type="number"
                maxLength={4}
                value={pinValue}
                onChange={(e) => {
                  setPinValue(e.target.value.slice(0, 4));
                  setPinError("");
                }}
                placeholder="····"
                autoFocus
                style={{
                  width: "100%",
                  height: 64,
                  borderRadius: 16,
                  border: `2px solid ${pinError ? "#EF4444" : pinValue.length === 4 ? "#10B981" : "#E2E8F0"}`,
                  background: "#F8FAFC",
                  fontSize: 32,
                  color: "#0F172A",
                  textAlign: "center",
                  outline: "none",
                  fontFamily: "Sora, sans-serif",
                  fontWeight: 800,
                  letterSpacing: 12,
                  boxSizing: "border-box",
                  transition: "border 0.2s",
                }}
              />
              {pinError && (
                <p
                  style={{
                    fontSize: 12,
                    color: "#EF4444",
                    fontWeight: 600,
                    margin: "6px 0 0",
                    textAlign: "center",
                  }}
                >
                  {pinError}
                </p>
              )}
            </div>

            <button
              onClick={submitPin}
              disabled={pinLoading || pinValue.length < 4}
              style={{
                width: "100%",
                height: 54,
                borderRadius: 14,
                border: "none",
                background:
                  pinValue.length < 4
                    ? "#E2E8F0"
                    : pinModalType === "start"
                      ? "linear-gradient(135deg, #10B981, #059669)"
                      : "linear-gradient(135deg, #EF4444, #DC2626)",
                color: pinValue.length < 4 ? "#94A3B8" : "white",
                fontSize: 15,
                fontWeight: 700,
                cursor:
                  pinLoading || pinValue.length < 4 ? "not-allowed" : "pointer",
                fontFamily: "DM Sans, sans-serif",
                transition: "all 0.2s",
              }}
            >
              {pinLoading
                ? "Verifying..."
                : pinModalType === "start"
                  ? "Start Class"
                  : "End Class"}
            </button>

            <button
              onClick={() => setShowPinModal(false)}
              style={{
                width: "100%",
                height: 44,
                background: "transparent",
                border: "none",
                fontSize: 13,
                color: "#94A3B8",
                cursor: "pointer",
                marginTop: 8,
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
