import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { FiCreditCard, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import Toast from "../../components/ui/Toast";
import useAuthStore from "../../store/authStore";
import { isValidEmail } from "../../utils/helpers";
import api from "../../services/api";

function FormInput({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon,
  rightIcon,
  onRightIconClick,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && (
        <label
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.8px",
            color: "#64748B",
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: "relative" }}>
        {icon && (
          <span
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94A3B8",
              display: "flex",
              alignItems: "center",
            }}
          >
            {icon}
          </span>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            width: "100%",
            height: 52,
            borderRadius: 12,
            border: error ? "1.5px solid #EF4444" : "1.5px solid #E2E8F0",
            background: "#F8FAFC",
            fontSize: 14,
            color: "#0F172A",
            paddingLeft: icon ? 44 : 16,
            paddingRight: rightIcon ? 44 : 16,
            outline: "none",
            fontFamily: "DM Sans, sans-serif",
            transition: "border 0.2s",
          }}
          onFocus={(e) => (e.target.style.border = "1.5px solid #2563EB")}
          onBlur={(e) =>
            (e.target.style.border = error
              ? "1.5px solid #EF4444"
              : "1.5px solid #E2E8F0")
          }
        />
        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            style={{
              position: "absolute",
              right: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94A3B8",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            {rightIcon}
          </button>
        )}
      </div>
      {error && (
        <p
          style={{ fontSize: 11, color: "#EF4444", fontWeight: 600, margin: 0 }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [form, setForm] = useState({ staffId: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [toast, setToast] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  }

  function validate() {
    const errs = {};
    if (!form.staffId.trim()) errs.staffId = "Staff ID or email is required";
    if (!form.password) errs.password = "Password is required";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/login", {
        identifier: form.staffId,
        password: form.password,
      });

      const { user, token } = res.data.data;

      // Save to Zustand store and localStorage
      login(user, token);

      // Redirect based on role
      if (user.role === "admin") {
        navigate("/admin/overview", { replace: true });
      } else {
        navigate("/teacher/checkin", { replace: true });
      }
    } catch (err) {
      const message = err.response?.data?.message || "Login failed. Try again.";
      setToast({ message, type: "error" });
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
      {/* ── HERO ─────────────────────────────────────────────── */}
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
            background: "rgba(255,255,255,0.06)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -30,
            left: -40,
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
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
            backdropFilter: "blur(8px)",
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

      {/* ── FORM CARD ────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          background: "white",
          borderRadius: "32px 32px 0 0",
          padding: "32px 24px 60px",
          overflowY: "auto",
        }}
      >
        <h2
          style={{
            fontFamily: "Sora, sans-serif",
            fontSize: 22,
            fontWeight: 700,
            color: "#0F172A",
            margin: 0,
          }}
        >
          Welcome Back
        </h2>
        <p
          style={{
            color: "#64748B",
            fontSize: 14,
            marginTop: 4,
            marginBottom: 28,
          }}
        >
          Sign in to your teacher account
        </p>

        {/* Google Button */}
        <div style={{ marginBottom: 20 }}>
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const res = await api.post("/auth/google", {
                  credential: credentialResponse.credential,
                });
                login(res.data.data.user, res.data.data.token);
                navigate(
                  res.data.data.user.role === "admin"
                    ? "/admin/overview"
                    : "/teacher/checkin",
                );
              } catch {
                setToast({
                  message: "Google sign-in failed. Try again.",
                  type: "error",
                });
              }
            }}
            onError={() =>
              setToast({ message: "Google sign-in cancelled.", type: "error" })
            }
            text="continue_with"
            shape="rectangular"
            theme="outline"
            size="large"
            style={{ width: "100%" }}
          />
        </div>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <div style={{ flex: 1, height: 1, background: "#E2E8F0" }} />
          <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>
            or sign in with email
          </span>
          <div style={{ flex: 1, height: 1, background: "#E2E8F0" }} />
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <FormInput
            label="Staff ID or Email"
            name="staffId"
            placeholder="e.g. TCH-001 or your email"
            value={form.staffId}
            onChange={handleChange}
            error={errors.staffId}
            icon={<FiCreditCard size={15} />}
          />

          <FormInput
            label="Password"
            name="password"
            type={showPw ? "text" : "password"}
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            icon={<FiLock size={15} />}
            rightIcon={showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            onRightIconClick={() => setShowPw((p) => !p)}
          />

          {/* Forgot password */}
          <div style={{ textAlign: "right", marginTop: -8 }}>
            <Link
              to="/forgot-password"
              style={{
                fontSize: 13,
                color: "#2563EB",
                fontWeight: 600,
                textDecoration: "none",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
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
              letterSpacing: "1px",
              textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: 8,
              fontFamily: "DM Sans, sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: "0 4px 20px rgba(37,99,235,0.35)",
            }}
          >
            {loading ? "Signing In..." : "Sign In →"}
          </button>

          <p
            style={{
              textAlign: "center",
              fontSize: 13,
              color: "#64748B",
              marginTop: 4,
            }}
          >
            New teacher?{" "}
            <Link
              to="/signup"
              style={{
                color: "#2563EB",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Create Account
            </Link>
          </p>
        </form>
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
