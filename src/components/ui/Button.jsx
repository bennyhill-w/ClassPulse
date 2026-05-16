export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  type = "button",
  className = "",
}) {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-dark",
    secondary: "bg-surface text-primary border border-border hover:bg-bg",
    danger: "bg-red text-white shadow-lg shadow-red/25 hover:opacity-90",
    ghost: "bg-transparent text-text3 hover:bg-border",
    navy: "bg-navy text-white shadow-lg hover:opacity-90",
    brand: "bg-brand text-white shadow-lg shadow-brand/30 hover:opacity-90",
    green: "bg-green text-white shadow-lg shadow-green/30 hover:opacity-90",
  };

  const sizes = {
    sm: "h-9  px-4  text-sm",
    md: "h-12 px-6  text-sm",
    lg: "h-14 px-8  text-base",
    xl: "h-16 px-10 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${base}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
