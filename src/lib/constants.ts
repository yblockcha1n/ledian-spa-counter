import type { Course, DrinkItem, RentalItem } from "./types";

// ── 麻布十番 コース ───────────────────────────────────────
export const AZABU_COURSES: Course[] = [
  { id: "azabu_45", label: "45分", durationMin: 45, priceExTax: 1500, priceInTax: 1650 },
  { id: "azabu_60", label: "60分", durationMin: 60, priceExTax: 1800, priceInTax: 1980 },
  { id: "azabu_90", label: "90分", durationMin: 90, priceExTax: 2400, priceInTax: 2640 },
  { id: "azabu_120", label: "120分", durationMin: 120, priceExTax: 2900, priceInTax: 3190 },
];

export const AZABU_PREMIUM_SEAT = { priceExTax: 1000, priceInTax: 1100 };

// ── 恵比寿 コース（男性） ────────────────────────────────
export const EBISU_MALE_COURSES: Course[] = [
  { id: "ebisu_m_45", label: "45分", durationMin: 45, priceExTax: 1500, priceInTax: 1650 },
  { id: "ebisu_m_60", label: "60分", durationMin: 60, priceExTax: 1800, priceInTax: 1980 },
  { id: "ebisu_m_90", label: "90分", durationMin: 90, priceExTax: 2400, priceInTax: 2640 },
  { id: "ebisu_m_120", label: "120分", durationMin: 120, priceExTax: 2900, priceInTax: 3190 },
];

// ── 恵比寿 コース（女性）+15分サービス ──────────────────
export const EBISU_FEMALE_COURSES: Course[] = [
  { id: "ebisu_f_60", label: "60分（実質75分）", durationMin: 75, priceExTax: 1300, priceInTax: 1430 },
  { id: "ebisu_f_75", label: "75分（実質90分）", durationMin: 90, priceExTax: 1500, priceInTax: 1650 },
  { id: "ebisu_f_105", label: "105分（実質120分）", durationMin: 120, priceExTax: 1900, priceInTax: 2090 },
  { id: "ebisu_f_135", label: "135分（実質150分）", durationMin: 150, priceExTax: 2400, priceInTax: 2640 },
];

// ── PRIVATE 部屋タイプ ────────────────────────────────────
export const PRIVATE_ROOMS = {
  standard: {
    id: "standard",
    label: "スタンダードルーム",
    capacity: "1〜3名",
    weekdayPrice: 15400,
    weekendPrice: 18700,
    extensionPer15min: 2200,
    extraGuestFrom: 3,
  },
  terrace: {
    id: "terrace",
    label: "テラスルーム",
    capacity: "1〜4名",
    weekdayPrice: 17600,
    weekendPrice: 20900,
    extensionPer15min: 2420,
    extraGuestFrom: 3,
  },
  vip: {
    id: "vip",
    label: "VIPルーム",
    capacity: "1〜8名",
    weekdayPrice: 32780,
    weekendPrice: 38500,
    extensionPer15min: 4400,
    extraGuestFrom: 5,
  },
} as const;

export const PRIVATE_EXTRA_GUEST_PRICE = 1100;

// ── ドリンク ──────────────────────────────────────────────
export const AZABU_EBISU_DRINKS: DrinkItem[] = [
  { id: "water", label: "ミネラルウォーター", priceExTax: 200, priceInTax: 220 },
  { id: "match", label: "マッチ", priceExTax: 250, priceInTax: 275 },
  { id: "ion_water", label: "イオンウォーター", priceExTax: 250, priceInTax: 275 },
];

export const PRIVATE_DRINKS: DrinkItem[] = [
  { id: "sauna_drink", label: "サウナドリンク", priceExTax: 500, priceInTax: 550 },
  { id: "p_water", label: "ミネラルウォーター", priceExTax: 350, priceInTax: 385 },
  { id: "alcohol", label: "アルコール", priceExTax: 500, priceInTax: 550 },
  { id: "non_alcohol", label: "ノンアルコール", priceExTax: 500, priceInTax: 550 },
];

// ── レンタル ──────────────────────────────────────────────
export const AZABU_RENTALS: RentalItem[] = [
  { id: "swimwear", label: "水着", priceInTax: 0, free: true },
  { id: "sauna_hat", label: "サウナハット", priceInTax: 330 },
];

export const EBISU_RENTALS: RentalItem[] = [
  { id: "swimwear", label: "水着", priceInTax: 0, free: true },
  { id: "sauna_hat", label: "サウナハット", priceInTax: 330 },
];

export const PRIVATE_RENTALS: RentalItem[] = [
  { id: "swimwear", label: "水着", priceInTax: 0, free: true },
  { id: "sauna_hat", label: "サウナハット", priceInTax: 0, free: true },
  { id: "gown", label: "ガウン（バスローブ）", priceInTax: 0, free: true },
  { id: "towel", label: "タオル", priceInTax: 0, free: true },
];

// ── 店舗ラベル ────────────────────────────────────────────
export const STORE_LABELS = {
  azabu: "麻布十番",
  ebisu: "恵比寿",
  private: "PRIVATE",
} as const;
