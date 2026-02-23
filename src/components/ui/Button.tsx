"use client";

import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const variantStyles = {
  primary: "bg-accent text-base font-medium hover:bg-accent-light active:opacity-90",
  secondary: "bg-surface-2 text-text border border-border hover:border-accent/50 active:opacity-90",
  ghost: "bg-transparent text-text-muted hover:text-text hover:bg-surface active:opacity-90",
  danger: "bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20 active:opacity-90",
};

const sizeStyles = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-3 text-sm",
  lg: "px-6 py-4 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center gap-2 rounded-sm transition-all duration-200",
        "focus:outline-none focus-visible:ring-1 focus-visible:ring-accent",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
