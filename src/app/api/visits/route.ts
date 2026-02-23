import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { calculatePrice } from "@/lib/calculations";
import { mapVisit } from "@/lib/types";
import type { VisitFormData, VisitRow } from "@/lib/types";

function getUserId(req: NextRequest): string | null {
  const token = req.cookies.get("auth_token")?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  return payload?.userId ?? null;
}

// GET /api/visits — 来店一覧取得
export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "未認証" }, { status: 401 });

  const { data, error } = await supabase
    .from("visits")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ visits: (data as VisitRow[]).map(mapVisit) });
}

// POST /api/visits — 来店記録作成
export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "未認証" }, { status: 401 });

  const formData: VisitFormData = await req.json();
  const { total } = calculatePrice(formData);

  const { data, error } = await supabase
    .from("visits")
    .insert({
      user_id: userId,
      date: formData.date,
      store: formData.store,
      gender: formData.gender ?? null,
      course_id: formData.courseId,
      premium_seat: formData.premiumSeat,
      room_type: formData.roomType ?? null,
      is_weekend: formData.isWeekend ?? null,
      guest_count: formData.guestCount,
      extension_count: formData.extensionCount,
      drinks: formData.drinks,
      rentals: formData.rentals,
      total_amount: total,
      notes: formData.notes || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ visit: mapVisit(data as VisitRow) }, { status: 201 });
}
