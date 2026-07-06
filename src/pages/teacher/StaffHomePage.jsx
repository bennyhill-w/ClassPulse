import { useState, useEffect } from "react";
import { FiClock, FiMapPin, FiLogOut, FiCheck } from "react-icons/fi";
import useAuthStore from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Toast from "../../components/ui/Toast";
import { greeting, displayName } from "../../utils/helpers";

export default function StaffHomePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [time, setTime] = useState("");
  const [attendance, setAttendance] = useState(null);
  const [toast, setToast] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);

  const name = displayName(user) || "Staff";

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      );
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    async function loadAttendance() {
      try {
        const res = await api.get("/checkin/today");
        if (res.data.data.attendance) {
          setAttendance(res.data.data.attendance);
          if (res.data.data.attendance.checkOutAt) {
            setCheckedOut(true);
          }
        }
      } catch (err) {
        // ignore
      }
    }
    loadAttendance();
  }, []);

  async function confirmCheckOut() {
    try {
      await api.post("/checkin/checkout");
      setCheckedOut(true);
      setShowCheckout(false);
      setToast({
        message: "✅ Checked out. See you tomorrow!",
        type: "success",
      });
    } catch (err) {
      setToast({
        message: err.response?.data?.message || "Checkout failed",
        type: "error",
      });
      setShowCheckout(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #0F1F47 0%, #1E3A8A 60%, #2563EB 100%)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      <div
        style={{
          padding: "32px 24px 24px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: 14,
              margin: "0 0 4px",
            }}
          >
            {greeting()}
          </p>
          <h1
            style={{
              fontFamily: "Sora, sans-serif",
              fontSize: 26,
              fontWeight: 800,
              color: "white",
              margin: 0,
            }}
          >
            {name}
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 13,
              margin: "6px 0 0",
            }}
          >
            Non-Teaching Staff · G.T.C Agidingbi
          </p>
        </div>

        <div
          style={{
            width: "100%",
            maxWidth: 340,
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 24,
            padding: 24,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: checkedOut
                ? "rgba(100,116,139,0.3)"
                : "rgba(16,185,129,0.25)",
              border: `2px solid ${checkedOut ? "#94A3B8" : "#10B981"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            {checkedOut ? (
              <FiLogOut size={28} color="#94A3B8" />
            ) : (
              <FiCheck size={28} color="#10B981" />
            )}
          </div>

          <h2
            style={{
              fontFamily: "Sora, sans-serif",
              fontSize: 20,
              fontWeight: 700,
              color: "white",
              margin: "0 0 6px",
            }}
          >
            {checkedOut ? "Checked Out" : "Checked In"}
          </h2>

          {attendance && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 20,
                marginTop: 12,
              }}
            >
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,0.4)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    margin: "0 0 2px",
                  }}
                >
                  Arrived
                </p>
                <p
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "white",
                    margin: 0,
                  }}
                >
                  {formatTime(attendance.checkInAt)}
                </p>
              </div>
              {checkedOut && attendance.checkOutAt && (
                <div style={{ textAlign: "center" }}>
                  <p
                    style={{
                      fontSize: 10,
                      color: "rgba(255,255,255,0.4)",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      margin: "0 0 2px",
                    }}
                  >
                    Departed
                  </p>
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "white",
                      margin: 0,
                    }}
                  >
                    {formatTime(attendance.checkOutAt)}
                  </p>
                </div>
              )}
            </div>
          )}

          {attendance && (
            <div style={{ marginTop: 12 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "4px 14px",
                  borderRadius: 20,
                  background: attendance.isLate
                    ? "rgba(245,158,11,0.2)"
                    : "rgba(16,185,129,0.2)",
                  color: attendance.isLate ? "#FCD34D" : "#6EE7B7",
                  border: `1px solid ${
                    attendance.isLate
                      ? "rgba(245,158,11,0.3)"
                      : "rgba(16,185,129,0.3)"
                  }`,
                }}
              >
                {attendance.isLate ? "Late ⚠" : "On Time ✓"}
              </span>
            </div>
          )}
        </div>

        {!checkedOut && (
          <button
            onClick={() => setShowCheckout(true)}
            style={{
              width: "100%",
              maxWidth: 340,
              height: 56,
              borderRadius: 16,
              border: "1.5px solid rgba(255,255,255,0.25)",
              background: "rgba(255,255,255,0.1)",
              color: "white",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            <FiMapPin size={16} /> Check Out for the Day
          </button>
        )}

        <button
          onClick={handleLogout}
          style={{
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.4)",
            fontSize: 13,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "DM Sans, sans-serif",
          }}
        >
          <FiLogOut size={14} /> Sign Out
        </button>
      </div>

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
              maxWidth: 480,
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
                Your departure will be recorded.
              </p>
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
