"use client";

import type { Store, Gender, RoomType } from "@/lib/types";
import {
  AZABU_COURSES,
  AZABU_PREMIUM_SEAT,
  EBISU_MALE_COURSES,
  EBISU_FEMALE_COURSES,
  PRIVATE_ROOMS,
} from "@/lib/constants";

interface Props {
  store: Store;
  gender?: Gender;
  courseId: string;
  premiumSeat: boolean;
  roomType?: RoomType;
  isWeekend?: boolean;
  onCourseChange: (id: string) => void;
  onPremiumSeatChange: (v: boolean) => void;
  onRoomTypeChange: (v: RoomType) => void;
  onWeekendChange: (v: boolean) => void;
}

export default function CourseSelector({
  store,
  gender,
  courseId,
  premiumSeat,
  roomType,
  isWeekend,
  onCourseChange,
  onPremiumSeatChange,
  onRoomTypeChange,
  onWeekendChange,
}: Props) {
  if (store === "azabu") {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          {AZABU_COURSES.map((c) => (
            <CourseOption
              key={c.id}
              id={c.id}
              label={c.label}
              price={c.priceInTax}
              selected={courseId === c.id}
              onClick={() => onCourseChange(c.id)}
            />
          ))}
        </div>
        <div
          className={[
            "flex items-center justify-between rounded-sm border p-4 cursor-pointer transition-all duration-200",
            premiumSeat
              ? "border-accent bg-accent/5"
              : "border-border bg-surface hover:border-accent/40",
          ].join(" ")}
          onClick={() => onPremiumSeatChange(!premiumSeat)}
        >
          <div>
            <p className="text-sm text-text">プレミアム指定席</p>
            <p className="text-xs text-text-muted mt-0.5">サウナハットレンタル無料・シートパックorアイマスク付き</p>
          </div>
          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            <span className="text-sm text-accent">+¥{AZABU_PREMIUM_SEAT.priceInTax.toLocaleString()}</span>
            <div
              className={[
                "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                premiumSeat ? "bg-accent border-accent" : "border-border",
              ].join(" ")}
            >
              {premiumSeat && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4l3 3L9 1" stroke="#0d0d0d" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (store === "ebisu") {
    const courses = gender === "female" ? EBISU_FEMALE_COURSES : EBISU_MALE_COURSES;
    return (
      <div className="flex flex-col gap-2">
        {courses.map((c) => (
          <CourseOption
            key={c.id}
            id={c.id}
            label={c.label}
            price={c.priceInTax}
            selected={courseId === c.id}
            onClick={() => onCourseChange(c.id)}
          />
        ))}
      </div>
    );
  }

  if (store === "private") {
    return (
      <div className="flex flex-col gap-4">
        {/* 平日/土日祝 */}
        <div className="flex gap-2">
          {(["weekday", "weekend"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onWeekendChange(type === "weekend")}
              className={[
                "flex-1 py-3 rounded-sm border text-sm transition-all duration-200",
                (type === "weekend") === isWeekend
                  ? "border-accent bg-accent/5 text-accent"
                  : "border-border bg-surface text-text-muted hover:border-accent/40",
              ].join(" ")}
            >
              {type === "weekday" ? "平日" : "土日祝"}
            </button>
          ))}
        </div>

        {/* 部屋タイプ */}
        <div className="flex flex-col gap-2">
          {Object.values(PRIVATE_ROOMS).map((room) => {
            const price = isWeekend ? room.weekendPrice : room.weekdayPrice;
            return (
              <button
                key={room.id}
                type="button"
                onClick={() => onRoomTypeChange(room.id as RoomType)}
                className={[
                  "flex items-center justify-between rounded-sm border p-4 text-left transition-all duration-200",
                  roomType === room.id
                    ? "border-accent bg-accent/5"
                    : "border-border bg-surface hover:border-accent/40",
                ].join(" ")}
              >
                <div>
                  <p className={["text-sm", roomType === room.id ? "text-accent" : "text-text"].join(" ")}>
                    {room.label}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">{room.capacity}（120分）</p>
                </div>
                <p className="text-sm text-accent">¥{price.toLocaleString()}</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}

function CourseOption({
  id,
  label,
  price,
  selected,
  onClick,
}: {
  id: string;
  label: string;
  price: number;
  selected: boolean;
  onClick: () => void;
}) {
  void id;
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex items-center justify-between rounded-sm border p-4 text-left transition-all duration-200",
        selected ? "border-accent bg-accent/5" : "border-border bg-surface hover:border-accent/40",
      ].join(" ")}
    >
      <p className={["text-sm", selected ? "text-accent" : "text-text"].join(" ")}>{label}</p>
      <p className="text-sm text-accent">¥{price.toLocaleString()}</p>
    </button>
  );
}
