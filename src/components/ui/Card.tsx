import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

export default function Card({ elevated = false, className = "", children, ...props }: CardProps) {
  return (
    <div
      className={[
        "rounded-sm border border-border p-5",
        elevated ? "bg-surface-2" : "bg-surface",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
