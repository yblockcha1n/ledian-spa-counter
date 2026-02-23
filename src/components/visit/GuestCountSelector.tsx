"use client";

import type { RoomType } from "@/lib/types";
import { PRIVATE_ROOMS, PRIVATE_EXTRA_GUEST_PRICE } from "@/lib/constants";

interface Props {
  roomType?: RoomType;
  count: number;
  onChange: (count: number) => void;
}

export default function GuestCountSelector({ roomType, count, onChange }: Props) {
  if (!roomType) return null;
  const room = PRIVATE_ROOMS[roomType];
  const maxGuests = roomType === "vip" ? 8 : roomType === "terrace" ? 4 : 3;
  const extraFrom = room.extraGuestFrom;
  const extraGuests = count >= extraFrom ? count - (extraFrom - 1) : 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between rounded-sm border border-border bg-surface p-4">
        <div>
          <p className="text-sm text-text">利用人数</p>
          <p className="text-xs text-text-muted mt-0.5">{room.capacity}まで</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onChange(Math.max(1, count - 1))}
            disabled={count <= 1}
            className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-text-muted hover:border-accent/50 hover:text-text disabled:opacity-30 transition-colors"
          >
            −
          </button>
          <span className="w-6 text-center text-sm text-text">{count}</span>
          <button
            type="button"
            onClick={() => onChange(Math.min(maxGuests, count + 1))}
            disabled={count >= maxGuests}
            className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-text-muted hover:border-accent/50 hover:text-text disabled:opacity-30 transition-colors"
          >
            +
          </button>
        </div>
      </div>
      {extraGuests > 0 && (
        <p className="text-xs text-text-muted text-right">
          追加料金: {extraGuests}名 × ¥{PRIVATE_EXTRA_GUEST_PRICE.toLocaleString()} ={" "}
          <span className="text-accent">¥{(extraGuests * PRIVATE_EXTRA_GUEST_PRICE).toLocaleString()}</span>
        </p>
      )}
    </div>
  );
}
