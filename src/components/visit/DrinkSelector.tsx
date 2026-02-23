"use client";

import type { Store, DrinkOrder } from "@/lib/types";
import { AZABU_EBISU_DRINKS, PRIVATE_DRINKS } from "@/lib/constants";

interface Props {
  store: Store;
  drinks: DrinkOrder[];
  onChange: (drinks: DrinkOrder[]) => void;
}

export default function DrinkSelector({ store, drinks, onChange }: Props) {
  const menu = store === "private" ? PRIVATE_DRINKS : AZABU_EBISU_DRINKS;

  function getQty(id: string): number {
    return drinks.find((d) => d.drinkId === id)?.quantity ?? 0;
  }

  function setQty(id: string, qty: number) {
    const item = menu.find((m) => m.id === id)!;
    const updated = drinks.filter((d) => d.drinkId !== id);
    if (qty > 0) {
      updated.push({ drinkId: id, label: item.label, priceInTax: item.priceInTax, quantity: qty });
    }
    onChange(updated);
  }

  return (
    <div className="flex flex-col gap-2">
      {menu.map((item) => {
        const qty = getQty(item.id);
        return (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-sm border border-border bg-surface p-4"
          >
            <div>
              <p className="text-sm text-text">{item.label}</p>
              <p className="text-xs text-accent mt-0.5">¥{item.priceInTax.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQty(item.id, Math.max(0, qty - 1))}
                disabled={qty === 0}
                className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-text-muted hover:border-accent/50 hover:text-text disabled:opacity-30 transition-colors"
              >
                −
              </button>
              <span className="w-4 text-center text-sm text-text">{qty}</span>
              <button
                type="button"
                onClick={() => setQty(item.id, qty + 1)}
                className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-text-muted hover:border-accent/50 hover:text-text transition-colors"
              >
                +
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
