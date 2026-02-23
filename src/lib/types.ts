export type Store = "azabu" | "ebisu" | "private";
export type Gender = "male" | "female";
export type RoomType = "standard" | "terrace" | "vip";

export interface Course {
  id: string;
  label: string;
  durationMin: number;
  priceExTax: number;
  priceInTax: number;
}

export interface DrinkItem {
  id: string;
  label: string;
  priceExTax: number;
  priceInTax: number;
}

export interface RentalItem {
  id: string;
  label: string;
  priceInTax: number;
  free?: boolean;
}

export interface DrinkOrder {
  drinkId: string;
  label: string;
  priceInTax: number;
  quantity: number;
}

export interface RentalOrder {
  rentalId: string;
  label: string;
  priceInTax: number;
  quantity: number;
}

export interface Visit {
  id: string;
  userId: string;
  date: string;
  store: Store;
  gender?: Gender;
  courseId: string;
  premiumSeat?: boolean;
  roomType?: RoomType;
  isWeekend?: boolean;
  guestCount: number;
  extensionCount: number;
  drinks: DrinkOrder[];
  rentals: RentalOrder[];
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Supabase から返る snake_case 生データ
export interface VisitRow {
  id: string;
  user_id: string;
  date: string;
  store: Store;
  gender?: Gender | null;
  course_id: string;
  premium_seat?: boolean | null;
  room_type?: RoomType | null;
  is_weekend?: boolean | null;
  guest_count: number;
  extension_count: number;
  drinks: DrinkOrder[];
  rentals: RentalOrder[];
  total_amount: number;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

// snake_case → camelCase 変換
export function mapVisit(row: VisitRow): Visit {
  return {
    id: row.id,
    userId: row.user_id,
    date: row.date,
    store: row.store,
    gender: row.gender ?? undefined,
    courseId: row.course_id,
    premiumSeat: row.premium_seat ?? false,
    roomType: row.room_type ?? undefined,
    isWeekend: row.is_weekend ?? undefined,
    guestCount: row.guest_count,
    extensionCount: row.extension_count,
    drinks: row.drinks,
    rentals: row.rentals,
    totalAmount: row.total_amount,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export interface VisitFormData {
  date: string;
  store: Store;
  gender?: Gender;
  courseId: string;
  premiumSeat: boolean;
  roomType?: RoomType;
  isWeekend?: boolean;
  guestCount: number;
  extensionCount: number;
  drinks: DrinkOrder[];
  rentals: RentalOrder[];
  notes: string;
}

export interface User {
  id: string;
  username: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
