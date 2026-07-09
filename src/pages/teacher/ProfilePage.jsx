import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMail,
  FiCreditCard,
  FiLock,
  FiBell,
  FiLogOut,
  FiEdit2,
  FiChevronRight,
  FiX,
  FiShield,
  FiBook,
  FiPhone,
  FiUser,
} from "react-icons/fi";
import { MdQrCode } from "react-icons/md";
import useAuthStore from "../../store/authStore";
import Toast from "../../components/ui/Toast";
import api from "../../services/api";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuthStore();

  const [toast, setToast] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [stats, setStats] = useState({ totalClasses: 0, totalSessions: 0 });
  const [pwLoading, setPwLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    trade: "",
    subjects: "",
    title: "",
  });

  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [pwError, setPwError] = useState("");

  // Sync editForm with real user data when modal opens
  useEffect(() => {
    if (showEdit && user) {
      setEditForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        trade: user.trade || "",
        subjects: user.subjects || "",
        title: user.title || "Mr.",
      });
    }
  }, [showEdit, user]);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await api.get("/teacher/class/history?filter=month");
        setStats({
          totalClasses: res.data.data.summary?.totalDone || 0,
          totalSessions: res.data.data.summary?.totalSessions || 0,
        });
      } catch {}
    }
    loadStats();
  }, []);

  // Load fresh profile from backend on mount
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await api.get("/teacher/profile");
        if (res.data.data.user) {
          updateUser(res.data.data.user);
        }
      } catch {}
    }
    loadProfile();
  }, []);

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  const name = user
    ? `${user.title || ""} ${user.firstName || ""} ${user.lastName || ""}`.trim()
    : "Teacher";
  const initls = user
    ? `${(user.firstName || "T")[0]}${(user.lastName || "C")[0]}`.toUpperCase()
    : "TC";
  const colors = [
    "#2563EB",
    "#7C3AED",
    "#059669",
    "#DC2626",
    "#0284C7",
    "#D97706",
  ];
  const avatarColor =
    colors[
      (initls.charCodeAt(0) + (initls.charCodeAt(1) || 0)) % colors.length
    ];

  async function saveEdit() {
    if (!editForm.firstName.trim() || !editForm.lastName.trim()) {
      setToast({ message: "Name fields cannot be empty", type: "error" });
      return;
    }
    setEditLoading(true);
    try {
      const res = await api.patch("/teacher/profile", editForm);
      updateUser({ ...user, ...res.data.data.user });
      setShowEdit(false);
      setToast({ message: "Profile updated successfully", type: "success" });
    } catch (err) {
      setToast({
        message: err.response?.data?.message || "Failed to update profile",
        type: "error",
      });
    } finally {
      setEditLoading(false);
    }
  }

  async function savePw() {
    if (!pwForm.current) {
      setPwError("Enter current password");
      return;
    }
    if (pwForm.newPw.length < 6) {
      setPwError("New password must be at least 6 characters");
      return;
    }
    if (pwForm.newPw !== pwForm.confirm) {
      setPwError("Passwords do not match");
      return;
    }
    setPwLoading(true);
    setPwError("");
    try {
      await api.patch("/auth/change-password", {
        currentPassword: pwForm.current,
        newPassword: pwForm.newPw,
      });
      setPwForm({ current: "", newPw: "", confirm: "" });
      setShowPw(false);
      setToast({ message: "Password changed successfully", type: "success" });
    } catch (err) {
      setPwError(err.response?.data?.message || "Failed to change password");
    } finally {
      setPwLoading(false);
    }
  }

  const inp = {
    width: "100%",
    height: 48,
    borderRadius: 12,
    border: "1.5px solid #E2E8F0",
    background: "#F8FAFC",
    fontSize: 13,
    color: "#0F172A",
    padding: "0 14px",
    outline: "none",
    fontFamily: "DM Sans, sans-serif",
    boxSizing: "border-box",
  };

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
      {/* ── HERO ─────────────────────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(135deg, #1E40AF, #2563EB)",
          padding: "28px 20px 32px",
          flexShrink: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -20,
            left: 60,
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 1,
            position: "relative",
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: avatarColor,
              border: "3px solid rgba(255,255,255,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 800,
              color: "white",
              fontFamily: "Sora, sans-serif",
              marginBottom: 12,
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            {initls}
          </div>
          <h2
            style={{
              fontFamily: "Sora, sans-serif",
              fontSize: 20,
              fontWeight: 700,
              color: "white",
              margin: "0 0 4px",
            }}
          >
            {name}
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: 13,
              margin: "0 0 4px",
            }}
          >
            {user?.staffId || "—"}
          </p>
          <p
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 12,
              margin: "0 0 16px",
            }}
          >
            {user?.trade || "Trade not set — tap Edit Profile"}
          </p>

          <div style={{ display: "flex", gap: 16 }}>
            {[
              { val: stats.totalClasses, label: "Classes" },
              { val: stats.totalSessions, label: "Sessions" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: "rgba(255,255,255,0.12)",
                  borderRadius: 12,
                  padding: "10px 20px",
                  textAlign: "center",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <p
                  style={{
                    fontFamily: "Sora, sans-serif",
                    fontSize: 22,
                    fontWeight: 800,
                    color: "white",
                    margin: 0,
                  }}
                >
                  {s.val}
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.65)",
                    margin: 0,
                  }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENT ──────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 32px" }}>
        {/* Info card */}
        <div
          style={{
            background: "white",
            borderRadius: 16,
            marginBottom: 12,
            border: "1px solid #E2E8F0",
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          {[
            {
              icon: <FiCreditCard size={15} />,
              label: "Staff ID",
              value: user?.staffId || "—",
            },
            {
              icon: <FiMail size={15} />,
              label: "Email",
              value: user?.email || "—",
            },
            {
              icon: <FiPhone size={15} />,
              label: "Phone",
              value: user?.phone || "Not set",
            },
            {
              icon: <FiBook size={15} />,
              label: "Trade",
              value: user?.trade || "Not set — edit profile to add",
            },
            {
              icon: <FiUser size={15} />,
              label: "Subjects",
              value: user?.subjects || "Not set — edit profile to add",
            },
          ].map((row, i, arr) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 16px",
                borderBottom: i < arr.length - 1 ? "1px solid #F8FAFC" : "none",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "#EFF6FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: "#2563EB",
                }}
              >
                {row.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: 10.5,
                    color: "#94A3B8",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    margin: "0 0 1px",
                  }}
                >
                  {row.label}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: row.value.includes("Not set")
                      ? "#94A3B8"
                      : "#0F172A",
                    fontWeight: 600,
                    margin: 0,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {row.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Menu */}
        <div
          style={{
            background: "white",
            borderRadius: 16,
            marginBottom: 12,
            border: "1px solid #E2E8F0",
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ padding: "10px 16px 6px" }}>
            <p
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                color: "#94A3B8",
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                margin: 0,
              }}
            >
              Account Settings
            </p>
          </div>
          {[
            {
              icon: <FiEdit2 size={15} />,
              label: "Edit Profile",
              sub: "Update your name, trade and contact",
              action: () => setShowEdit(true),
              color: "#2563EB",
              bg: "#EFF6FF",
            },
            {
              icon: <MdQrCode size={15} />,
              label: "My QR Code",
              sub: "Your personal identification code",
              action: () => setShowQr(true),
              color: "#7C3AED",
              bg: "#F5F3FF",
            },
            {
              icon: <FiLock size={15} />,
              label: "Change Password",
              sub: "Update your login password",
              action: () => setShowPw(true),
              color: "#059669",
              bg: "#ECFDF5",
            },
            {
              icon: <FiBell size={15} />,
              label: "Notification Prefs",
              sub: "Push notification settings",
              action: () =>
                setToast({
                  message: "Notification settings coming in next update",
                  type: "default",
                }),
              color: "#F59E0B",
              bg: "#FEF3C7",
            },
            {
              icon: <FiShield size={15} />,
              label: "Privacy & Security",
              sub: "Data and security settings",
              action: () =>
                setToast({
                  message: "Privacy settings coming in next update",
                  type: "default",
                }),
              color: "#64748B",
              bg: "#F1F5F9",
            },
          ].map((item, i) => (
            <button
              key={i}
              onClick={item.action}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "13px 16px",
                background: "none",
                border: "none",
                borderTop: "1px solid #F8FAFC",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: item.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: item.color,
                }}
              >
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#0F172A",
                    margin: 0,
                    fontFamily: "DM Sans, sans-serif",
                  }}
                >
                  {item.label}
                </p>
                <p
                  style={{ fontSize: 11, color: "#94A3B8", margin: "1px 0 0" }}
                >
                  {item.sub}
                </p>
              </div>
              <FiChevronRight size={15} color="#CBD5E1" />
            </button>
          ))}
        </div>

        {/* App info */}
        <div
          style={{
            background: "white",
            borderRadius: 16,
            marginBottom: 16,
            border: "1px solid #E2E8F0",
            padding: "14px 16px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontSize: 12, color: "#64748B", margin: 0 }}>
            Classpulse v1.0
          </p>
          <p style={{ fontSize: 12, color: "#94A3B8", margin: 0 }}>
            G.T.C Agidingbi, Lagos
          </p>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            height: 52,
            borderRadius: 14,
            border: "1.5px solid #FEE2E2",
            background: "#FEF2F2",
            color: "#EF4444",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontFamily: "DM Sans, sans-serif",
          }}
        >
          <FiLogOut size={16} /> Sign Out
        </button>
      </div>

      {/* ── EDIT PROFILE MODAL ─────────────────────────────── */}
      {showEdit && (
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
          onClick={() => setShowEdit(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 480,
              background: "white",
              borderRadius: "28px 28px 0 0",
              padding: "28px 24px 44px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: 40,
                height: 4,
                background: "#E2E8F0",
                borderRadius: 4,
                margin: "0 auto 20px",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h3
                style={{
                  fontFamily: "Sora, sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#0F172A",
                  margin: 0,
                }}
              >
                Edit Profile
              </h3>
              <button
                onClick={() => setShowEdit(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94A3B8",
                }}
              >
                <FiX size={20} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Title */}
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
                  Title
                </label>
                <select
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm((p) => ({ ...p, title: e.target.value }))
                  }
                  style={{ ...inp, appearance: "none" }}
                >
                  {["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              {[
                {
                  label: "First Name",
                  key: "firstName",
                  placeholder: "First name",
                },
                {
                  label: "Last Name",
                  key: "lastName",
                  placeholder: "Last name",
                },
                { label: "Email", key: "email", placeholder: "Email address" },
                {
                  label: "Phone Number",
                  key: "phone",
                  placeholder: "e.g. 080-XXXX-XXXX",
                },
                {
                  label: "Trade / Department",
                  key: "trade",
                  placeholder: "e.g. Computer Crafts",
                },
                {
                  label: "Subjects Taught",
                  key: "subjects",
                  placeholder: "e.g. ICT, Mathematics",
                },
              ].map((f) => (
                <div key={f.key}>
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
                    {f.label}
                  </label>
                  <input
                    value={editForm[f.key]}
                    onChange={(e) =>
                      setEditForm((p) => ({ ...p, [f.key]: e.target.value }))
                    }
                    placeholder={f.placeholder}
                    style={inp}
                  />
                </div>
              ))}
              <button
                onClick={saveEdit}
                disabled={editLoading}
                style={{
                  width: "100%",
                  height: 50,
                  borderRadius: 14,
                  border: "none",
                  background: editLoading
                    ? "#93C5FD"
                    : "linear-gradient(135deg, #2563EB, #1E40AF)",
                  color: "white",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: editLoading ? "not-allowed" : "pointer",
                  marginTop: 4,
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CHANGE PASSWORD MODAL ─────────────────────────── */}
      {showPw && (
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
          onClick={() => setShowPw(false)}
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
                margin: "0 auto 20px",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h3
                style={{
                  fontFamily: "Sora, sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#0F172A",
                  margin: 0,
                }}
              >
                Change Password
              </h3>
              <button
                onClick={() => setShowPw(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94A3B8",
                }}
              >
                <FiX size={20} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                {
                  label: "Current Password",
                  key: "current",
                  placeholder: "Enter current password",
                },
                {
                  label: "New Password",
                  key: "newPw",
                  placeholder: "Minimum 6 characters",
                },
                {
                  label: "Confirm Password",
                  key: "confirm",
                  placeholder: "Repeat new password",
                },
              ].map((f) => (
                <div key={f.key}>
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
                    {f.label}
                  </label>
                  <input
                    type="password"
                    value={pwForm[f.key]}
                    onChange={(e) => {
                      setPwForm((p) => ({ ...p, [f.key]: e.target.value }));
                      setPwError("");
                    }}
                    placeholder={f.placeholder}
                    style={inp}
                  />
                </div>
              ))}
              {pwError && (
                <p
                  style={{
                    fontSize: 12,
                    color: "#EF4444",
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  {pwError}
                </p>
              )}
              <button
                onClick={savePw}
                disabled={pwLoading}
                style={{
                  width: "100%",
                  height: 50,
                  borderRadius: 14,
                  border: "none",
                  background: pwLoading
                    ? "#93C5FD"
                    : "linear-gradient(135deg, #2563EB, #1E40AF)",
                  color: "white",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: pwLoading ? "not-allowed" : "pointer",
                  marginTop: 4,
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                {pwLoading ? "Changing..." : "Change Password"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── QR MODAL ─────────────────────────────────────────── */}
      {showQr && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            backdropFilter: "blur(4px)",
            padding: 24,
          }}
          onClick={() => setShowQr(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 320,
              background: "white",
              borderRadius: 24,
              padding: 28,
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: 18,
                fontWeight: 700,
                color: "#0F172A",
                margin: "0 0 4px",
              }}
            >
              My QR Code
            </h3>
            <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 20px" }}>
              Your personal identification code
            </p>
            <div
              style={{
                width: 160,
                height: 160,
                margin: "0 auto 16px",
                background: "#F1F5F9",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #E2E8F0",
              }}
            >
              <svg viewBox="0 0 100 100" width="130" height="130">
                {[0, 1, 2, 3, 4, 5, 6].map((r) =>
                  [0, 1, 2, 3, 4, 5, 6].map((c) => {
                    const inTL = r < 3 && c < 3,
                      inTR = r < 3 && c > 3,
                      inBL = r > 3 && c < 3;
                    const fill =
                      inTL || inTR || inBL
                        ? "#1E40AF"
                        : Math.random() > 0.5
                          ? "#1E40AF"
                          : "transparent";
                    return (
                      <rect
                        key={`${r}${c}`}
                        x={c * 14 + 1}
                        y={r * 14 + 1}
                        width="12"
                        height="12"
                        fill={fill}
                        rx="1"
                      />
                    );
                  }),
                )}
              </svg>
            </div>
            <p
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: 15,
                fontWeight: 700,
                color: "#0F172A",
                margin: "0 0 3px",
              }}
            >
              {name}
            </p>
            <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 20px" }}>
              {user?.staffId} · G.T.C Agidingbi
            </p>
            <button
              onClick={() => setShowQr(false)}
              style={{
                width: "100%",
                height: 46,
                borderRadius: 12,
                border: "none",
                background: "#EFF6FF",
                color: "#2563EB",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              Close
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
