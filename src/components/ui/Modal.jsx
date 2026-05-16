import { useEffect } from "react";

export default function Modal({ isOpen, onClose, children, className = "" }) {
  // Close on backdrop click, prevent scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Sheet */}
      <div
        className={`
          relative w-full max-w-sm bg-surface
          rounded-t-3xl p-6 pb-10
          shadow-2xl z-10
          animate-slide-up
          ${className}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />
        {children}
      </div>
    </div>
  );
}
