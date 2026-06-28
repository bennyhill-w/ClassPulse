import { useState, useEffect } from "react";
import api from "../../services/api";
import { FiX, FiMail } from "react-icons/fi";
import {
  MdWarning,
  MdAccessTime,
  MdPersonOff,
  MdNotifications,
} from "react-icons/md";

const INITIAL_ALERTS = [
  {
    id: 1,
    type: "danger",
    icon: MdPersonOff,
    title: "Mrs. Bola Taiwo — Absent (No notification)",
    desc: "No check-in as of 10:00 AM. Technical Drawing class has no teacher. TCH-004",
    teacher: "Mrs. Bola Taiwo",
    time: "9:00 AM",
  },
  {
    id: 2,
    type: "warn",
    icon: MdAccessTime,
    title: "Mr. Emeka Okafor — Late Arrival",
    desc: "Checked in 20 minutes late at 8:20 AM. Physics class delayed. TCH-003",
    teacher: "Mr. Emeka Okafor",
    time: "8:20 AM",
  },
  {
    id: 3,
    type: "danger",
    icon: MdWarning,
    title: "Technical Drawing — Tech 2 Draughtsmanship unattended",
    desc: "Scheduled 11:00 AM–12:00 PM. Teacher absent. Admin action needed.",
    teacher: null,
    time: "11:00 AM",
  },
  {
    id: 4,
    type: "warn",
    icon: MdAccessTime,
    title: "Mr. Tunde Rahman — 5th consecutive late arrival",
    desc: "Pattern detected. Average late by 28 minutes. Recommend formal warning. TCH-008",
    teacher: "Mr. Tunde Rahman",
    time: "8:28 AM",
  },
  {
    id: 5,
    type: "warn",
    icon: MdNotifications,
    title: "3 teachers have 3+ absences this month",
    desc: "Emeka O., Bola T., Tunde R. require disciplinary follow-up.",
    teacher: null,
    time: "Today",
  },
];

const STYLE = {
  danger: { border: "#FECACA", bg: "#FEF2F2", icon: "#EF4444" },
  warn: { border: "#FDE68A", bg: "#FFFBF0", icon: "#F59E0B" },
};

// Map alert type to icon
function getAlertIcon(type) {
  const iconMap = {
    danger: MdPersonOff,
    warn: MdAccessTime,
  };
  return iconMap[type] || MdNotifications;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msgId, setMsgId] = useState(null);
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    async function loadAlerts() {
      try {
        const res = await api.get("/admin/alerts");
        setAlerts(res.data.data.alerts);
      } catch (err) {
        console.error("Alerts error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAlerts();
  }, []);

  async function dismiss(id) {
    try {
      await api.patch(`/admin/alerts/${id}/resolve`);
      setAlerts((p) => p.filter((a) => a.id !== id));
      setToast("✅ Alert dismissed");
      setTimeout(() => setToast(""), 2500);
    } catch (err) {
      console.error("Dismiss error:", err);
    }
  }

  async function sendMsg() {
    if (!msg.trim()) return;
    const alert = alerts.find((a) => a.id === msgId);
    try {
      await api.post("/admin/message", {
        recipientId: alert?.teacherId,
        body: msg,
      });
      setSent(true);
      setTimeout(() => {
        setMsgId(null);
        setMsg("");
        setSent(false);
      }, 1500);
    } catch (err) {
      console.error("Send msg error:", err);
    }
  }

  const inp = {
    width: "100%",
    borderRadius: 10,
    border: "1.5px solid #E2E8F0",
    background: "#F8FAFC",
    fontSize: 13,
    color: "#0F172A",
    padding: "10px 12px",
    outline: "none",
    fontFamily: "DM Sans, sans-serif",
    resize: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
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
            Alerts
          </h2>
          <p style={{ fontSize: 13, color: "#94A3B8", margin: 0 }}>
            {alerts.length} active alert{alerts.length !== 1 ? "s" : ""}{" "}
            requiring attention
          </p>
        </div>
        {alerts.length > 0 && (
          <button
            onClick={() => setAlerts([])}
            style={{
              padding: "8px 16px",
              borderRadius: 10,
              border: "1px solid #E2E8F0",
              background: "white",
              fontSize: 12,
              fontWeight: 600,
              color: "#64748B",
              cursor: "pointer",
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            Dismiss All
          </button>
        )}
      </div>

      {alerts.length === 0 ? (
        <div
          style={{
            background: "white",
            borderRadius: 16,
            border: "1px solid #E2E8F0",
            padding: "60px 24px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
          <p
            style={{
              fontFamily: "Sora, sans-serif",
              fontSize: 16,
              fontWeight: 700,
              color: "#10B981",
              margin: "0 0 4px",
            }}
          >
            No Active Alerts
          </p>
          <p style={{ fontSize: 13, color: "#94A3B8", margin: 0 }}>
            All clear — no issues requiring attention right now
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {alerts.map((alert) => {
            const st = STYLE[alert.type];
            const Icon = getAlertIcon(alert.type);
            return (
              <div
                key={alert.id}
                style={{
                  background: st.bg,
                  border: `1px solid ${st.border}`,
                  borderRadius: 16,
                  padding: "16px 20px",
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 11,
                    background: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  }}
                >
                  <Icon size={20} color={st.icon} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#0F172A",
                      margin: "0 0 4px",
                    }}
                  >
                    {alert.title}
                  </p>
                  <p
                    style={{
                      fontSize: 12.5,
                      color: "#64748B",
                      margin: "0 0 12px",
                      lineHeight: 1.5,
                    }}
                  >
                    {alert.description}
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                      onClick={() => dismiss(alert.id)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 8,
                        border: "1px solid #E2E8F0",
                        background: "white",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#64748B",
                        cursor: "pointer",
                        fontFamily: "DM Sans, sans-serif",
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <FiX size={12} /> Dismiss
                    </button>
                    {alert.teacherId && (
                      <button
                        onClick={() => {
                          setMsgId(alert.id);
                          setMsg("");
                          setSent(false);
                        }}
                        style={{
                          padding: "6px 14px",
                          borderRadius: 8,
                          border: "none",
                          background: "#2563EB",
                          fontSize: 12,
                          fontWeight: 700,
                          color: "white",
                          cursor: "pointer",
                          fontFamily: "DM Sans, sans-serif",
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <FiMail size={12} /> Message Teacher
                      </button>
                    )}
                  </div>
                </div>
                <span style={{ fontSize: 11, color: "#94A3B8", flexShrink: 0 }}>
                  {alert.time}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Message Modal */}
      {msgId && (
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
          onClick={() => setMsgId(null)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 400,
              background: "white",
              borderRadius: 24,
              padding: "28px 24px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {sent ? (
              <div style={{ textAlign: "center", padding: "12px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 10 }}>✅</div>
                <p
                  style={{
                    fontFamily: "Sora, sans-serif",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#10B981",
                    margin: 0,
                  }}
                >
                  Message Sent!
                </p>
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "Sora, sans-serif",
                      fontSize: 17,
                      fontWeight: 700,
                      color: "#0F172A",
                      margin: 0,
                    }}
                  >
                    Message Teacher
                  </h3>
                  <button
                    onClick={() => setMsgId(null)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#94A3B8",
                    }}
                  >
                    <FiX size={18} />
                  </button>
                </div>
                <textarea
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Type your message to the teacher..."
                  rows={4}
                  style={inp}
                />
                <button
                  onClick={sendMsg}
                  disabled={!msg.trim()}
                  style={{
                    width: "100%",
                    height: 48,
                    borderRadius: 12,
                    border: "none",
                    background: msg.trim()
                      ? "linear-gradient(135deg, #2563EB, #1E40AF)"
                      : "#E2E8F0",
                    color: msg.trim() ? "white" : "#94A3B8",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: msg.trim() ? "pointer" : "not-allowed",
                    marginTop: 12,
                    fontFamily: "DM Sans, sans-serif",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <FiMail size={14} /> Send Message
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#10B981",
            color: "white",
            padding: "12px 24px",
            borderRadius: 16,
            fontSize: 13,
            fontWeight: 700,
            boxShadow: "0 4px 20px rgba(16,185,129,0.4)",
            zIndex: 300,
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
