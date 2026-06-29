import { useEffect, useState } from "react";
import {
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiInfo,
  FiX,
} from "react-icons/fi";

const CONFIGS = {
  success: {
    icon: FiCheckCircle,
    bg: "#ECFDF5",
    border: "#6EE7B7",
    color: "#065F46",
    iconColor: "#10B981",
    bar: "#10B981",
  },
  error: {
    icon: FiXCircle,
    bg: "#FEF2F2",
    border: "#FECACA",
    color: "#7F1D1D",
    iconColor: "#EF4444",
    bar: "#EF4444",
  },
  warning: {
    icon: FiAlertTriangle,
    bg: "#FEF3C7",
    border: "#FDE68A",
    color: "#78350F",
    iconColor: "#F59E0B",
    bar: "#F59E0B",
  },
  default: {
    icon: FiInfo,
    bg: "#EFF6FF",
    border: "#BFDBFE",
    color: "#1E3A8A",
    iconColor: "#2563EB",
    bar: "#2563EB",
  },
};

export default function Toast({ message, type = "default", onClose }) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  const config = CONFIGS[type] || CONFIGS.default;
  const Icon = config.icon;

  useEffect(() => {
    // Slide in
    const showTimer = setTimeout(() => setVisible(true), 10);

    // Progress bar
    const start = Date.now();
    const duration = 3500;
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(pct);
      if (pct === 0) clearInterval(tick);
    }, 50);

    // Slide out and close
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 350);
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearInterval(tick);
    };
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 100,
        left: "50%",
        transform: `translateX(-50%) translateY(${visible ? "0" : "20px"})`,
        opacity: visible ? 1 : 0,
        transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
        zIndex: 1000,
        minWidth: 280,
        maxWidth: 360,
        background: config.bg,
        border: `1px solid ${config.border}`,
        borderRadius: 16,
        boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
        overflow: "hidden",
      }}
    >
      {/* Progress bar */}
      <div
        style={{
          height: 3,
          width: `${progress}%`,
          background: config.bar,
          transition: "width 0.05s linear",
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 14px",
        }}
      >
        <Icon size={20} color={config.iconColor} style={{ flexShrink: 0 }} />
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: config.color,
            margin: 0,
            flex: 1,
            lineHeight: 1.4,
          }}
        >
          {message}
        </p>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 350);
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: config.iconColor,
            display: "flex",
            flexShrink: 0,
            opacity: 0.6,
          }}
        >
          <FiX size={15} />
        </button>
      </div>
    </div>
  );
}
