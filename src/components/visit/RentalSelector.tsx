"use client";

import type { Store, RentalOrder } from "@/lib/types";
import { AZABU_RENTALS, EBISU_RENTALS, PRIVATE_RENTALS } from "@/lib/constants";

interface Props {
  store: Store;
  rentals: RentalOrder[];
  onChange: (rentals: RentalOrder[]) => void;
}

export default function RentalSelector({ store, rentals, onChange }: Props) {
  const menu =
    store === "private" ? PRIVATE_RENTALS : store === "ebisu" ? EBISU_RENTALS : AZABU_RENTALS;

  function getQty(id: string): number {
    return rentals.find((r) => r.rentalId === id)?.quantity ?? 0;
  }

  function setQty(id: string, qty: number) {
    const item = menu.find((m) => m.id === id)!;
    const updated = rentals.filter((r) => r.rentalId !== id);
    if (qty > 0) {
      updated.push({ rentalId: id, label: item.label, priceInTax: item.priceInTax, quantity: qty });
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
              <p className="text-xs mt-0.5">
                {item.free ? (
                  <span className="text-text-muted">無料</span>
                ) : (
                  <span className="text-accent">¥{item.priceInTax.toLocaleString()}</span>
                )}
              </p>
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
