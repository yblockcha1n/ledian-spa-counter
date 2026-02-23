import type { VisitFormData } from "./types";
import {
  AZABU_COURSES,
  AZABU_PREMIUM_SEAT,
  EBISU_MALE_COURSES,
  EBISU_FEMALE_COURSES,
  PRIVATE_ROOMS,
  PRIVATE_EXTRA_GUEST_PRICE,
} from "./constants";

export interface PriceBreakdown {
  baseCourse: number;
  premiumSeat: number;
  extraGuests: number;
  extensions: number;
  drinks: number;
  rentals: number;
  total: number;
  lines: { label: string; amount: number }[];
}

export function calculatePrice(data: VisitFormData): PriceBreakdown {
  const lines: { label: string; amount: number }[] = [];
  let baseCourse = 0;
  let premiumSeat = 0;
  let extraGuests = 0;
  let extensions = 0;

  if (data.store === "azabu") {
    const course = AZABU_COURSES.find((c) => c.id === data.courseId);
    if (course) {
      baseCourse = course.priceInTax;
      lines.push({ label: `麻布十番 ${course.label}`, amount: baseCourse });
    }
    if (data.premiumSeat) {
      premiumSeat = AZABU_PREMIUM_SEAT.priceInTax;
      lines.push({ label: "プレミアム指定席", amount: premiumSeat });
    }
  } else if (data.store === "ebisu") {
    const courses = data.gender === "female" ? EBISU_FEMALE_COURSES : EBISU_MALE_COURSES;
    const course = courses.find((c) => c.id === data.courseId);
    if (course) {
      baseCourse = course.priceInTax;
      lines.push({ label: `恵比寿 ${course.label}（${data.gender === "female" ? "女性" : "男性"}）`, amount: baseCourse });
    }
  } else if (data.store === "private" && data.roomType) {
    const room = PRIVATE_ROOMS[data.roomType];
    baseCourse = data.isWeekend ? room.weekendPrice : room.weekdayPrice;
    lines.push({ label: `${room.label}（${data.isWeekend ? "土日祝" : "平日"} 120分）`, amount: baseCourse });

    const guestCount = data.guestCount || 1;
    if (guestCount >= room.extraGuestFrom) {
      const extraCount = guestCount - (room.extraGuestFrom - 1);
      extraGuests = extraCount * PRIVATE_EXTRA_GUEST_PRICE;
      lines.push({ label: `追加人数 ${extraCount}名 × ¥1,100`, amount: extraGuests });
    }

    if (data.extensionCount > 0) {
      extensions = data.extensionCount * room.extensionPer15min;
      lines.push({ label: `延長 ${data.extensionCount}回 × ¥${room.extensionPer15min.toLocaleString()}（15分）`, amount: extensions });
    }
  }

  const drinks = data.drinks.reduce((sum, d) => sum + d.priceInTax * d.quantity, 0);
  if (drinks > 0) {
    data.drinks.forEach((d) => {
      if (d.quantity > 0) {
        lines.push({ label: `${d.label} × ${d.quantity}`, amount: d.priceInTax * d.quantity });
      }
    });
  }

  const rentals = data.rentals.reduce((sum, r) => sum + r.priceInTax * r.quantity, 0);
  if (rentals > 0) {
    data.rentals.forEach((r) => {
      if (r.quantity > 0 && r.priceInTax > 0) {
        lines.push({ label: `${r.label} × ${r.quantity}`, amount: r.priceInTax * r.quantity });
      }
    });
  }

  const total = baseCourse + premiumSeat + extraGuests + extensions + drinks + rentals;

  return { baseCourse, premiumSeat, extraGuests, extensions, drinks, rentals, total, lines };
}
