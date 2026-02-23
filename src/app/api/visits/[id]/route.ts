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

// GET /api/visits/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "未認証" }, { status: 401 });

  const { id } = await params;
  const { data, error } = await supabase
    .from("visits")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error || !data) return NextResponse.json({ error: "見つかりません" }, { status: 404 });

  return NextResponse.json({ visit: mapVisit(data as VisitRow) });
}

// PUT /api/visits/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "未認証" }, { status: 401 });

  const { id } = await params;
  const formData: VisitFormData = await req.json();
  const { total } = calculatePrice(formData);

  const { data, error } = await supabase
    .from("visits")
    .update({
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
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error || !data) return NextResponse.json({ error: error?.message ?? "更新失敗" }, { status: 500 });

  return NextResponse.json({ visit: mapVisit(data as VisitRow) });
}

// DELETE /api/visits/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "未認証" }, { status: 401 });

  const { id } = await params;
  const { error } = await supabase
    .from("visits")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
