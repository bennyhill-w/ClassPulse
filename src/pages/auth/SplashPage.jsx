import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export default function SplashPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initialising...");

  useEffect(() => {
    const steps = [
      { text: "Loading Classpulse...", pct: 20 },
      { text: "Connecting to server...", pct: 50 },
      { text: "Verifying session...", pct: 80 },
      { text: "Almost ready...", pct: 95 },
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setStatusText(steps[i].text);
        setProgress(steps[i].pct);
        i++;
      }
    }, 500);

    const timer = setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setStatusText("Ready!");
      setTimeout(() => {
        // Re-read directly from localStorage — don't trust React state alone
        const token = localStorage.getItem("classpulse_token");
        const userStr = localStorage.getItem("classpulse_user");

        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            if (user.role === "admin")
              navigate("/admin/overview", { replace: true });
            else navigate("/teacher/checkin", { replace: true });
          } catch {
            navigate("/login", { replace: true });
          }
        } else {
          navigate("/login", { replace: true });
        }
      }, 400);
    }, 2400);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [navigate, isAuthenticated, user]);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background:
          "linear-gradient(160deg, #0F1F47 0%, #1E3A8A 60%, #2563EB 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      {/* ── ANIMATED BACKGROUND CIRCLES ────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: "rgba(41,171,226,0.08)",
          animation: "float 6s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -80,
          left: -80,
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
          animation: "float 8s ease-in-out infinite reverse",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "40%",
          right: -40,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: "rgba(41,171,226,0.06)",
          animation: "float 5s ease-in-out infinite",
        }}
      />

      {/* ── TOP BRAND BAR ──────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: "linear-gradient(90deg, #29ABE2, #2563EB, #29ABE2)",
          backgroundSize: "200% 100%",
          animation: "shimmer 2s linear infinite",
        }}
      />

      {/* ── MAIN CONTENT ───────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 1,
          padding: "0 40px",
          animation: "fadeUp 0.8s ease forwards",
        }}
      >
        {/* Logo with glow */}
        <div
          style={{
            width: 100,
            height: 100,
            background: "white",
            borderRadius: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
            boxShadow:
              "0 0 0 1px rgba(41,171,226,0.3), 0 0 0 8px rgba(41,171,226,0.1), 0 20px 60px rgba(0,0,0,0.4)",
            animation: "pulse 2s ease-in-out infinite",
          }}
        >
          <img
            src="/logo.png"
            alt="Classpulse"
            style={{ width: 68, height: 68, objectFit: "contain" }}
          />
        </div>

        {/* App name */}
        <h1
          style={{
            fontFamily: "Sora, sans-serif",
            fontSize: 42,
            fontWeight: 800,
            margin: "0 0 8px",
            letterSpacing: -1,
          }}
        >
          <span style={{ color: "#29ABE2" }}>Class</span>
          <span style={{ color: "white" }}>pulse</span>
        </h1>

        {/* Tagline */}
        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: 14,
            margin: "0 0 8px",
            letterSpacing: 0.5,
          }}
        >
          Smart Attendance, Simplified
        </p>

        {/* School badge */}
        <div
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 30,
            padding: "6px 18px",
            marginBottom: 48,
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: 12,
              fontWeight: 600,
              margin: 0,
              letterSpacing: 0.3,
            }}
          >
            G.T.C Agidingbi · Ikeja, Lagos
          </p>
        </div>

        {/* Progress bar */}
        <div style={{ width: 200, marginBottom: 14 }}>
          <div
            style={{
              width: "100%",
              height: 3,
              background: "rgba(255,255,255,0.12)",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg, #29ABE2, #2563EB)",
                borderRadius: 3,
                transition: "width 0.4s ease",
                boxShadow: "0 0 8px rgba(41,171,226,0.6)",
              }}
            />
          </div>
        </div>

        {/* Status text */}
        <p
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: 12,
            margin: 0,
            letterSpacing: 0.5,
          }}
        >
          {statusText}
        </p>
      </div>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <p
        style={{
          position: "absolute",
          bottom: 24,
          color: "rgba(255,255,255,0.2)",
          fontSize: 11,
          letterSpacing: 0.5,
        }}
      >
        Powered by Classpulse · v1.0
      </p>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 1px rgba(41,171,226,0.3), 0 0 0 8px rgba(41,171,226,0.1), 0 20px 60px rgba(0,0,0,0.4); }
          50% { box-shadow: 0 0 0 1px rgba(41,171,226,0.5), 0 0 0 14px rgba(41,171,226,0.15), 0 20px 60px rgba(0,0,0,0.4); }
        }
      `}</style>
    </div>
  );
}
