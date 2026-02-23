"use client";

import type { Gender } from "@/lib/types";

interface Props {
  value?: Gender;
  onChange: (v: Gender) => void;
}

export default function GenderSelector({ value, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {(["male", "female"] as Gender[]).map((g) => (
        <button
          key={g}
          type="button"
          onClick={() => onChange(g)}
          className={[
            "flex-1 py-3 rounded-sm border text-sm transition-all duration-200",
            value === g
              ? "border-accent bg-accent/5 text-accent"
              : "border-border bg-surface text-text-muted hover:border-accent/40",
          ].join(" ")}
        >
          {g === "male" ? "男性" : "女性"}
        </button>
      ))}
    </div>
  );
}
