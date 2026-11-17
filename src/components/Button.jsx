import { Link } from "react-router-dom";
import Icon from "./Icon";

const variants = {
  primary: {
    base: "bg-gold-500 text-ink-950",
    fill: "bg-ink-950",
    hoverText: "group-hover:text-cream-50",
  },
  dark: {
    base: "bg-ink-950 text-cream-50",
    fill: "bg-gold-500",
    hoverText: "group-hover:text-ink-950",
  },
  outline: {
    base: "bg-transparent text-ink-900 border border-ink-900/25",
    fill: "bg-ink-950",
    hoverText: "group-hover:text-cream-50",
  },
  "outline-light": {
    base: "bg-transparent text-cream-50 border border-cream-50/30",
    fill: "bg-gold-500",
    hoverText: "group-hover:text-ink-950",
  },
};

const sizes = {
  sm: "px-4 py-2 text-xs gap-2",
  md: "px-7 py-3.5 text-sm gap-2.5",
};

export default function Button({
  to,
  href,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  icon = "arrow-right",
  iconClassName = "",
  disabled = false,
  className = "",
  children,
}) {
  const v = variants[variant] ?? variants.primary;
  const classes = `btn-wipe group relative inline-flex items-center justify-center font-bold uppercase tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ${sizes[size]} ${v.base} ${className}`;

  const content = (
    <>
      <span className={`btn-fill ${v.fill}`} aria-hidden="true" />
      {icon && (
        <Icon
          name={icon}
          size={size === "sm" ? 14 : 16}
          className={`relative z-[1] shrink-0 transition-colors duration-150 ${v.hoverText} ${iconClassName}`}
        />
      )}
      <span className={`relative z-[1] transition-colors duration-500 delay-75 ${v.hoverText}`}>
        {children}
      </span>
    </>
  );

  if (to) {
    return (
      <Link to={to} onClick={onClick} className={classes}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} onClick={onClick} className={classes}>
        {content}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {content}
    </button>
  );
}
