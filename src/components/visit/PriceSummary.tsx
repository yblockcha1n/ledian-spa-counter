"use client";

import type { VisitFormData } from "@/lib/types";
import { calculatePrice } from "@/lib/calculations";

interface Props {
  formData: VisitFormData;
}

export default function PriceSummary({ formData }: Props) {
  const breakdown = calculatePrice(formData);

  return (
    <div className="rounded-sm border border-border bg-surface overflow-hidden">
      <div className="p-4 border-b border-border">
        <p className="text-xs text-text-muted uppercase tracking-wider">料金内訳</p>
      </div>
      <div className="p-4 flex flex-col gap-3">
        {breakdown.lines.map((line, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-sm text-text-muted">{line.label}</span>
            <span className="text-sm text-text">¥{line.amount.toLocaleString()}</span>
          </div>
        ))}
        {breakdown.lines.length === 0 && (
          <p className="text-sm text-text-muted text-center py-2">選択なし</p>
        )}
      </div>
      <div className="p-4 border-t border-border bg-surface-2 flex items-center justify-between">
        <p className="text-sm text-text-muted">合計（税込）</p>
        <p
          className="text-2xl text-accent"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          ¥{breakdown.total.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
