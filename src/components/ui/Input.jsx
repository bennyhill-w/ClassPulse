export default function Input({
  label,
  icon,
  error,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  required,
  className = "",
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-bold uppercase tracking-wider text-text3">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text3 text-lg">
            {icon}
          </span>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`
            w-full h-12 rounded-xl border border-border bg-bg
            text-sm text-text placeholder:text-text3
            outline-none transition-all duration-200
            focus:border-primary focus:ring-2 focus:ring-primary/10
            ${icon ? 'pl-11 pr-4' : 'px-4'}
            ${error ? "border-red focus:border-red focus:ring-red/10" : ""}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red font-medium">{error}</p>}
    </div>
  );
}
