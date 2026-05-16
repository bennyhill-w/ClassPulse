export default function Card({ children, className = "", onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-surface rounded-2xl border border-border
        shadow-sm shadow-black/5
        ${onClick ? "cursor-pointer active:scale-98 transition-transform" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
