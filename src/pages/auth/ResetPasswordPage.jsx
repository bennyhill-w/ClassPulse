import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import api from "../../services/api";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPw, setNewPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (newPw.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (newPw !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (!token) {
      setError("Invalid reset link");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/auth/reset-password", { token, newPassword: newPw });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const inp = (err) => ({
    width: "100%",
    height: 52,
    borderRadius: 12,
    border: `1.5px solid ${err ? "#EF4444" : "#E2E8F0"}`,
    background: "#F8FAFC",
    fontSize: 13,
    color: "#0F172A",
    paddingLeft: 44,
    paddingRight: 44,
    outline: "none",
    fontFamily: "DM Sans, sans-serif",
    boxSizing: "border-box",
  });

  if (!token) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F1F5F9",
          padding: 24,
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: 20,
            padding: 32,
            textAlign: "center",
            maxWidth: 360,
          }}
        >
          <h2
            style={{
              fontFamily: "Sora, sans-serif",
              color: "#EF4444",
              margin: "0 0 8px",
            }}
          >
            Invalid Link
          </h2>
          <p style={{ color: "#64748B", fontSize: 14, margin: "0 0 20px" }}>
            This reset link is invalid or has expired.
          </p>
          <Link
            to="/forgot-password"
            style={{ color: "#2563EB", fontWeight: 700 }}
          >
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        maxWidth: 420,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(160deg, #1E40AF 0%, #2563EB 45%, #3B82F6 100%)",
      }}
    >
      <div
        style={{
          padding: "56px 32px 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            background: "rgba(255,255,255,0.15)",
            borderRadius: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
            border: "1px solid rgba(255,255,255,0.3)",
          }}
        >
          <img
            src="/logo.png"
            alt="Classpulse"
            style={{ width: 52, height: 52, objectFit: "contain" }}
          />
        </div>
        <h1
          style={{
            fontFamily: "Sora, sans-serif",
            fontSize: 28,
            fontWeight: 800,
            color: "white",
            margin: 0,
          }}
        >
          Classpulse
        </h1>
      </div>

      <div
        style={{
          flex: 1,
          background: "white",
          borderRadius: "32px 32px 0 0",
          padding: "32px 24px 60px",
        }}
      >
        {success ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>✅</div>
            <h2
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: "#10B981",
                margin: "0 0 8px",
              }}
            >
              Password Reset!
            </h2>
            <p style={{ color: "#64748B", fontSize: 14, margin: "0 0 8px" }}>
              Your password has been changed successfully.
            </p>
            <p style={{ color: "#94A3B8", fontSize: 13 }}>
              Redirecting to login...
            </p>
          </div>
        ) : (
          <>
            <h2
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: "#0F172A",
                margin: "0 0 4px",
              }}
            >
              Set New Password
            </h2>
            <p style={{ color: "#64748B", fontSize: 14, margin: "0 0 28px" }}>
              Enter your new password below
            </p>

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              <div>
                <label
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    color: "#64748B",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  New Password
                </label>
                <div style={{ position: "relative" }}>
                  <FiLock
                    style={{
                      position: "absolute",
                      left: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#94A3B8",
                    }}
                    size={15}
                  />
                  <input
                    type={showPw ? "text" : "password"}
                    value={newPw}
                    onChange={(e) => {
                      setNewPw(e.target.value);
                      setError("");
                    }}
                    placeholder="Minimum 6 characters"
                    style={inp(error)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((p) => !p)}
                    style={{
                      position: "absolute",
                      right: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#94A3B8",
                    }}
                  >
                    {showPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    color: "#64748B",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Confirm Password
                </label>
                <div style={{ position: "relative" }}>
                  <FiLock
                    style={{
                      position: "absolute",
                      left: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#94A3B8",
                    }}
                    size={15}
                  />
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => {
                      setConfirm(e.target.value);
                      setError("");
                    }}
                    placeholder="Repeat new password"
                    style={inp(error)}
                  />
                </div>
              </div>

              {error && (
                <p
                  style={{
                    fontSize: 12,
                    color: "#EF4444",
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  height: 56,
                  borderRadius: 16,
                  border: "none",
                  background: loading
                    ? "#93C5FD"
                    : "linear-gradient(135deg, #2563EB, #1E40AF)",
                  color: "white",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "DM Sans, sans-serif",
                  marginTop: 8,
                  boxShadow: "0 4px 20px rgba(37,99,235,0.35)",
                }}
              >
                {loading ? "Resetting..." : "Reset Password →"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
