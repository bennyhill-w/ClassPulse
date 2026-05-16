import { useEffect, useState } from "react";

export default function Toast({ message, type = "default", onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const types = {
    default: "bg-navy text-white",
    success: "bg-green text-white",
    error: "bg-red text-white",
    warning: "bg-orange text-white",
  };

  return (
    <div
      className={`
      fixed bottom-24 left-1/2 -translate-x-1/2 z-50
      px-5 py-3 rounded-2xl shadow-xl
      text-sm font-semibold text-center
      transition-all duration-300
      ${types[type]}
      ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
    `}
    >
      {message}
    </div>
  );
}
