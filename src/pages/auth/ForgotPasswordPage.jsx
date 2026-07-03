import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import api from "../../services/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/auth/forgot-password", { email });
      setSent(true);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
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
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />
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
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,255,255,0.3)",
            zIndex: 1,
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
            zIndex: 1,
          }}
        >
          Classpulse
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: 13,
            marginTop: 6,
            zIndex: 1,
          }}
        >
          Smart School Monitoring Made Simple
        </p>
      </div>

      <div
        style={{
          flex: 1,
          background: "white",
          borderRadius: "32px 32px 0 0",
          padding: "32px 24px 60px",
        }}
      >
        <Link
          to="/login"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#64748B",
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
            marginBottom: 24,
          }}
        >
          <FiArrowLeft size={15} /> Back to Login
        </Link>

        {sent ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "#ECFDF5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <FiMail size={32} color="#10B981" />
            </div>
            <h2
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: "#0F172A",
                margin: "0 0 8px",
              }}
            >
              Check Your Email
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "#64748B",
                lineHeight: 1.6,
                margin: "0 0 24px",
              }}
            >
              If that email is registered, we've sent a password reset link.
              Check your inbox and spam folder.
            </p>
            <Link
              to="/login"
              style={{
                display: "block",
                background: "linear-gradient(135deg, #2563EB, #1E40AF)",
                color: "white",
                padding: "14px",
                borderRadius: 14,
                textDecoration: "none",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              Back to Login
            </Link>
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
              Forgot Password?
            </h2>
            <p style={{ color: "#64748B", fontSize: 14, margin: "0 0 28px" }}>
              Enter your email and we'll send a reset link
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
                  Email Address
                </label>
                <div style={{ position: "relative" }}>
                  <FiMail
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
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="your@email.com"
                    style={{
                      width: "100%",
                      height: 52,
                      borderRadius: 12,
                      border: `1.5px solid ${error ? "#EF4444" : "#E2E8F0"}`,
                      background: "#F8FAFC",
                      fontSize: 13,
                      color: "#0F172A",
                      paddingLeft: 44,
                      paddingRight: 16,
                      outline: "none",
                      fontFamily: "DM Sans, sans-serif",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                {error && (
                  <p
                    style={{
                      fontSize: 11,
                      color: "#EF4444",
                      fontWeight: 600,
                      margin: "4px 0 0",
                    }}
                  >
                    {error}
                  </p>
                )}
              </div>

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
                {loading ? "Sending..." : "Send Reset Link →"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
