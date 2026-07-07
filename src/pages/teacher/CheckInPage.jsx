import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiClock, FiUser, FiCreditCard } from "react-icons/fi";
import { MdQrCodeScanner } from "react-icons/md";
import useAuthStore from "../../store/authStore";
import api from "../../services/api";
import Toast from "../../components/ui/Toast";
import {
  timeStr,
  shortDate,
  displayName,
  getCurrentPosition,
  isWithinSchool,
} from "../../utils/helpers";

// ── STYLES ────────────────────────────────────────────────────────
const S = {
  page: {
    minHeight: "100vh",
    width: "100%",
    maxWidth: 420,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    background:
      "linear-gradient(180deg, #0F172A 0%, #1E3A8A 60%, #2563EB 100%)",
    position: "relative",
    overflow: "hidden",
  },
  circle1: {
    position: "absolute",
    top: -80,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.04)",
    pointerEvents: "none",
  },
  circle2: {
    position: "absolute",
    bottom: -60,
    left: -60,
    width: 200,
    height: 200,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.03)",
    pointerEvents: "none",
  },
};

function formatTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatLateTime(minutes) {
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} late`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours} hour${hours !== 1 ? "s" : ""} late`;
  return `${hours}h ${mins}m late`;
}

export default function CheckInPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [time, setTime] = useState(timeStr());
  const [date, setDate] = useState(shortDate());
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState("");
  const [isLate, setIsLate] = useState(false);
  const [lateMinutes, setLateMinutes] = useState(0);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [qrScanning, setQrScanning] = useState(false);
  const [toast, setToast] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [checkInMethod, setCheckInMethod] = useState("");

  useEffect(() => {
    async function checkIfAlreadyCheckedIn() {
      try {
        const res = await api.get("/checkin/today");
        const attendance = res.data.data.attendance;
        if (attendance && !attendance.checkOutAt) {
          // Always use current time for display
          const currentTime = formatTime(new Date());
          sessionStorage.setItem("cp_checkin_time", currentTime);
          if (user?.staffType === "non-teaching") {
            navigate("/teacher/staff-home", { replace: true });
          } else {
            navigate("/teacher/home", { replace: true });
          }
        }
      } catch (err) {
        // No attendance record — stay on check-in page
      }
    }
    checkIfAlreadyCheckedIn();
  }, [navigate]);

  // Live clock
  useEffect(() => {
    const t = setInterval(() => {
      setTime(timeStr());
      setDate(shortDate());
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // ── GPS CHECK-IN ────────────────────────────────────────────────
  async function handleGpsCheckIn() {
    if (checkedIn) return;
    setGpsLoading(true);
    try {
      const pos = await getCurrentPosition();

      // Call real backend
      const token = localStorage.getItem("classpulse_token");
      const res = await api.post("/checkin", {
        method: "gps",
        lat: pos.lat,
        lng: pos.lng,
      });

      const { checkInTime: t, isLate: late, lateMinutes: mins } = res.data.data;
      // Always use current time at moment of check-in for display
      const currentTime = formatTime(new Date());
      sessionStorage.setItem("cp_checkin_time", currentTime);
      setCheckInTime(currentTime);
      setIsLate(late);
      setLateMinutes(mins);
      setCheckInMethod("GPS Location");
      setCheckedIn(true);
      setShowSuccess(true);
    } catch (err) {
      const message =
        err.response?.data?.message || "Check-in failed. Try again.";
      setToast({ message, type: "error" });
    } finally {
      setGpsLoading(false);
    }
  }

  // ── QR CHECK-IN ─────────────────────────────────────────────────
  async function handleQrCheckIn() {
    if (checkedIn) return;
    setQrScanning(true);
    try {
      await new Promise((r) => setTimeout(r, 2500)); // QR scan animation

      const res = await api.post("/checkin", {
        method: "qr",
        qrToken: "GATE_QR_GTC_AGIDINGBI", // will be real token when QR scanner is added
      });

      const { checkInTime: t, isLate: late, lateMinutes: mins } = res.data.data;
      // Always use current time at moment of check-in for display
      const currentTime = formatTime(new Date());
      sessionStorage.setItem("cp_checkin_time", currentTime);
      setCheckInTime(currentTime);
      setIsLate(late);
      setLateMinutes(mins);
      setCheckInMethod("QR Code Scan");
      setCheckedIn(true);
      setShowSuccess(true);
    } catch (err) {
      const message =
        err.response?.data?.message || "Check-in failed. Try again.";
      setToast({ message, type: "error" });
    } finally {
      setQrScanning(false);
    }
  }

  // ── GO TO DASHBOARD ─────────────────────────────────────────────
  function goToDashboard() {
    if (user?.staffType === "non-teaching") {
      navigate("/teacher/staff-home", { replace: true });
    } else {
      navigate("/teacher/home", { replace: true });
    }
  }

  const name = displayName(user) || "Teacher";

  // ════════════════════════════════════════════════════════════════
  // SUCCESS MODAL
  // ════════════════════════════════════════════════════════════════
  if (showSuccess) {
    return (
      <div
        style={{
          ...S.page,
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div style={S.circle1} />
        <div style={S.circle2} />

        {/* Success card */}
        <div
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 28,
            padding: "36px 28px",
            textAlign: "center",
            zIndex: 1,
          }}
        >
          {/* Checkmark circle */}
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              background: isLate
                ? "linear-gradient(135deg, #EF4444, #DC2626)"
                : "linear-gradient(135deg, #10B981, #059669)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: isLate
                ? "0 8px 32px rgba(239,68,68,0.4)"
                : "0 8px 32px rgba(16,185,129,0.4)",
            }}
          >
            <svg
              width="40"
              height="40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <div
            style={{
              display: "inline-block",
              background: isLate
                ? "rgba(245,158,11,0.2)"
                : "rgba(16,185,129,0.2)",
              border: `1px solid ${
                isLate ? "rgba(245,158,11,0.4)" : "rgba(16,185,129,0.4)"
              }`,
              borderRadius: 20,
              padding: "4px 14px",
              marginBottom: 16,
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: isLate ? "#FCD34D" : "#6EE7B7",
                fontWeight: 700,
              }}
            >
              {isLate ? `${formatLateTime(lateMinutes)} ⚠` : "ON TIME ✓"}
            </span>
          </div>

          <h2
            style={{
              fontFamily: "Sora, sans-serif",
              fontSize: 28,
              fontWeight: 800,
              color: "white",
              margin: "0 0 8px",
            }}
          >
            Checked In!
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: 14,
              margin: "0 0 24px",
            }}
          >
            {isLate
              ? `You are ${formatLateTime(lateMinutes)}. Please proceed to your class.`
              : `Welcome to G.T.C Agidingbi, ${user?.lastName || "Teacher"}`}
          </p>

          {/* Info rows */}
          {[
            { icon: <FiUser size={14} />, label: "Name", value: name },
            {
              icon: <FiCreditCard size={14} />,
              label: "Staff ID",
              value: user?.staffId || "—",
            },
            { icon: <FiClock size={14} />, label: "Time", value: checkInTime },
            {
              icon: <FiMapPin size={14} />,
              label: "Method",
              value: checkInMethod,
            },
          ].map((row) => (
            <div
              key={row.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 0",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span style={{ color: "rgba(255,255,255,0.5)", display: "flex" }}>
                {row.icon}
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.5)",
                  width: 60,
                }}
              >
                {row.label}
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: "white",
                  fontWeight: 600,
                  flex: 1,
                  textAlign: "right",
                }}
              >
                {row.value}
              </span>
            </div>
          ))}

          {/* CTA */}
          <button
            onClick={goToDashboard}
            style={{
              width: "100%",
              height: 56,
              borderRadius: 16,
              border: "none",
              background: isLate
                ? "linear-gradient(135deg, #EF4444, #B91C1C)"
                : "linear-gradient(135deg, #10B981, #059669)",
              color: "white",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              marginTop: 28,
              fontFamily: "DM Sans, sans-serif",
              boxShadow: isLate
                ? "0 4px 20px rgba(239,68,68,0.4)"
                : "0 4px 20px rgba(16,185,129,0.4)",
              letterSpacing: "0.5px",
            }}
          >
            Go to Dashboard →
          </button>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // QR SCANNING OVERLAY
  // ════════════════════════════════════════════════════════════════
  if (qrScanning) {
    return (
      <div
        style={{
          ...S.page,
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div style={S.circle1} />
        <div style={S.circle2} />
        <div style={{ zIndex: 1, textAlign: "center" }}>
          {/* Camera frame */}
          <div
            style={{
              width: 240,
              height: 240,
              borderRadius: 24,
              border: "2px solid #29ABE2",
              position: "relative",
              margin: "0 auto 24px",
              overflow: "hidden",
              background: "#0a0a1a",
            }}
          >
            {/* Corner brackets */}
            {[
              { top: 0, left: 0 },
              { top: 0, right: 0 },
              { bottom: 0, left: 0 },
              { bottom: 0, right: 0 },
            ].map((pos, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: 24,
                  height: 24,
                  ...pos,
                  borderTop: pos.top === 0 ? "3px solid #29ABE2" : "none",
                  borderBottom: pos.bottom === 0 ? "3px solid #29ABE2" : "none",
                  borderLeft: pos.left === 0 ? "3px solid #29ABE2" : "none",
                  borderRight: pos.right === 0 ? "3px solid #29ABE2" : "none",
                }}
              />
            ))}
            {/* Scan line animation */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                height: 2,
                background:
                  "linear-gradient(90deg, transparent, #29ABE2, transparent)",
                animation: "scanLine 1.5s ease-in-out infinite",
              }}
            />
            <MdQrCodeScanner
              size={80}
              color="rgba(41,171,226,0.3)"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
              }}
            />
          </div>
          <p
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            Scanning QR Code...
          </p>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
            Point your camera at the school gate QR code
          </p>
          <button
            onClick={() => setQrScanning(false)}
            style={{
              marginTop: 24,
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 12,
              color: "rgba(255,255,255,0.6)",
              fontSize: 13,
              padding: "10px 24px",
              cursor: "pointer",
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            Cancel
          </button>
        </div>
        <style>{`@keyframes scanLine { 0%{top:10%} 50%{top:85%} 100%{top:10%} }`}</style>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // MAIN CHECK-IN SCREEN
  // ════════════════════════════════════════════════════════════════
  return (
    <div style={S.page}>
      <div style={S.circle1} />
      <div style={S.circle2} />

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div style={{ padding: "32px 24px 24px", flexShrink: 0, zIndex: 1 }}>
        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: 13,
            margin: "0 0 4px",
          }}
        >
          Good morning,
        </p>
        <h1
          style={{
            fontFamily: "Sora, sans-serif",
            fontSize: 24,
            fontWeight: 800,
            color: "white",
            margin: "0 0 6px",
          }}
        >
          {name}
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FiClock size={13} color="rgba(255,255,255,0.5)" />
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
            {date}
          </span>
        </div>
      </div>

      {/* ── LIVE TIME CARD ──────────────────────────────────────── */}
      <div
        style={{
          margin: "0 24px 28px",
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 20,
          padding: "20px 24px",
          zIndex: 1,
        }}
      >
        <p
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 12,
            margin: "0 0 6px",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Current Time
        </p>
        <p
          style={{
            fontFamily: "Sora, sans-serif",
            fontSize: 40,
            fontWeight: 800,
            color: "white",
            margin: 0,
            letterSpacing: -1,
          }}
        >
          {time}
        </p>
        <p
          style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 4 }}
        >
          {date}
        </p>
      </div>

      {/* ── CHECK-IN LABEL ──────────────────────────────────────── */}
      <div style={{ padding: "0 24px 16px", zIndex: 1 }}>
        <h2
          style={{
            fontFamily: "Sora, sans-serif",
            fontSize: 18,
            fontWeight: 700,
            color: "white",
            margin: 0,
          }}
        >
          Mark Your Attendance
        </h2>
        <p
          style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 4 }}
        >
          Choose how you'd like to check in today
        </p>
      </div>

      {/* ── CHECK-IN OPTIONS ────────────────────────────────────── */}
      <div
        style={{
          padding: "0 24px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          zIndex: 1,
        }}
      >
        {/* QR Code */}
        <button
          onClick={handleQrCheckIn}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "18px 20px",
            borderRadius: 20,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(8px)",
            cursor: "pointer",
            transition: "all 0.2s",
            textAlign: "left",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "linear-gradient(135deg, #29ABE2, #1A8CBF)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 16px rgba(41,171,226,0.4)",
            }}
          >
            <MdQrCodeScanner size={26} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: 15,
                fontWeight: 700,
                color: "white",
                margin: 0,
              }}
            >
              Scan QR Code
            </p>
            <p
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.55)",
                marginTop: 3,
              }}
            >
              Scan the code at the school gate
            </p>
          </div>
          <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* GPS */}
        <button
          onClick={handleGpsCheckIn}
          disabled={gpsLoading}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "18px 20px",
            borderRadius: 20,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(8px)",
            cursor: gpsLoading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            textAlign: "left",
            opacity: gpsLoading ? 0.7 : 1,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "linear-gradient(135deg, #10B981, #059669)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 16px rgba(16,185,129,0.4)",
            }}
          >
            <FiMapPin size={22} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: 15,
                fontWeight: 700,
                color: "white",
                margin: 0,
              }}
            >
              {gpsLoading ? "Verifying location..." : "Manual Check-In (GPS)"}
            </p>
            <p
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.55)",
                marginTop: 3,
              }}
            >
              Verify your location at school premises
            </p>
          </div>
          {gpsLoading ? (
            <svg
              className="animate-spin"
              width="18"
              height="18"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="3"
              />
              <path
                fill="rgba(255,255,255,0.8)"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </button>
      </div>

      {/* ── FOOTER NOTE ─────────────────────────────────────────── */}
      <div
        style={{
          margin: "auto 24px 32px",
          marginTop: 28,
          background: "rgba(255,255,255,0.05)",
          borderRadius: 14,
          padding: "12px 16px",
          zIndex: 1,
        }}
      >
        <p
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.4)",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          Your check-in is verified against school premises location. Attendance
          is recorded in real time.
        </p>
      </div>

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
