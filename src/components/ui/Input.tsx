import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

const inputBase =
  "w-full bg-surface border border-border rounded-sm px-4 py-3 text-text text-sm placeholder:text-text-muted focus:outline-none focus:border-accent/70 transition-colors duration-200";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs text-text-muted uppercase tracking-wider">{label}</label>
      )}
      <input className={`${inputBase} ${error ? "border-danger/60" : ""} ${className}`} {...props} />
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = "", ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs text-text-muted uppercase tracking-wider">{label}</label>
      )}
      <textarea
        className={`${inputBase} resize-none ${error ? "border-danger/60" : ""} ${className}`}
        rows={3}
        {...props}
      />
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
}
