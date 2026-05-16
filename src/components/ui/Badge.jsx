export default function Badge({ children, variant = "blue", className = "" }) {
  const variants = {
    blue: "bg-primary/10 text-primary",
    green: "bg-green/10 text-green",
    orange: "bg-orange/10 text-orange",
    red: "bg-red/10 text-red",
    gray: "bg-border text-text3",
    navy: "bg-navy/10 text-navy",
    brand: "bg-brand/10 text-brand",
  };

  return (
    <span
      className={`
      inline-flex items-center px-2.5 py-1
      rounded-full text-xs font-bold
      ${variants[variant]}
      ${className}
    `}
    >
      {children}
    </span>
  );
}
