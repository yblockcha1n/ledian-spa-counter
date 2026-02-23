"use client";

import type { Store } from "@/lib/types";

interface Props {
  value: Store | "";
  onChange: (store: Store) => void;
}

const stores = [
  {
    id: "azabu" as Store,
    name: "麻布十番",
    sub: "男性専用",
    hours: "7:00〜翌5:00",
  },
  {
    id: "ebisu" as Store,
    name: "恵比寿",
    sub: "男女両フロア",
    hours: "7:00〜翌5:00",
  },
  {
    id: "private" as Store,
    name: "PRIVATE",
    sub: "完全個室",
    hours: "24時間営業",
  },
];

export default function StoreSelector({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {stores.map((store) => {
        const isSelected = value === store.id;
        return (
          <button
            key={store.id}
            type="button"
            onClick={() => onChange(store.id)}
            className={[
              "flex items-center justify-between rounded-sm border p-4 text-left transition-all duration-200",
              isSelected
                ? "border-accent bg-accent/5 text-text"
                : "border-border bg-surface hover:border-accent/40 text-text-muted hover:text-text",
            ].join(" ")}
          >
            <div>
              <p
                className={[
                  "font-serif text-lg tracking-widest",
                  isSelected ? "text-accent" : "text-text",
                ].join(" ")}
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                {store.name}
              </p>
              <p className="text-xs mt-0.5">{store.sub}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-text-muted">{store.hours}</p>
              {isSelected && (
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-accent ml-auto" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
