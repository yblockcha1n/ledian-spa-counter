"use client";

import type { RoomType } from "@/lib/types";
import { PRIVATE_ROOMS } from "@/lib/constants";

interface Props {
  roomType?: RoomType;
  count: number;
  onChange: (count: number) => void;
}

export default function ExtensionSelector({ roomType, count, onChange }: Props) {
  if (!roomType) return null;
  const room = PRIVATE_ROOMS[roomType];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between rounded-sm border border-border bg-surface p-4">
        <div>
          <p className="text-sm text-text">延長（15分単位）</p>
          <p className="text-xs text-accent mt-0.5">¥{room.extensionPer15min.toLocaleString()} / 15分</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onChange(Math.max(0, count - 1))}
            disabled={count === 0}
            className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-text-muted hover:border-accent/50 hover:text-text disabled:opacity-30 transition-colors"
          >
            −
          </button>
          <span className="w-8 text-center text-sm text-text">
            {count > 0 ? `${count * 15}分` : "0"}
          </span>
          <button
            type="button"
            onClick={() => onChange(count + 1)}
            className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-text-muted hover:border-accent/50 hover:text-text transition-colors"
          >
            +
          </button>
        </div>
      </div>
      {count > 0 && (
        <p className="text-xs text-text-muted text-right">
          小計: ¥{(count * room.extensionPer15min).toLocaleString()}
        </p>
      )}
    </div>
  );
}
