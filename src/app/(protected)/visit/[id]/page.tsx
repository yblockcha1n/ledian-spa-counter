"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import StoreSelector from "@/components/visit/StoreSelector";
import GenderSelector from "@/components/visit/GenderSelector";
import CourseSelector from "@/components/visit/CourseSelector";
import DrinkSelector from "@/components/visit/DrinkSelector";
import RentalSelector from "@/components/visit/RentalSelector";
import ExtensionSelector from "@/components/visit/ExtensionSelector";
import GuestCountSelector from "@/components/visit/GuestCountSelector";
import PriceSummary from "@/components/visit/PriceSummary";
import { Textarea } from "@/components/ui/Input";
import type { Visit, VisitFormData, Store, Gender, RoomType } from "@/lib/types";
import { STORE_LABELS } from "@/lib/constants";
import { calculatePrice } from "@/lib/calculations";

function visitToForm(v: Visit): VisitFormData {
  return {
    date: v.date,
    store: v.store,
    gender: v.gender,
    courseId: v.courseId,
    premiumSeat: v.premiumSeat ?? false,
    roomType: v.roomType,
    isWeekend: v.isWeekend,
    guestCount: v.guestCount,
    extensionCount: v.extensionCount,
    drinks: v.drinks,
    rentals: v.rentals,
    notes: v.notes ?? "",
  };
}

export default function VisitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [visit, setVisit] = useState<Visit | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<VisitFormData | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/visits/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.visit) {
          setVisit(data.visit);
          setForm(visitToForm(data.visit));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  function update<K extends keyof VisitFormData>(key: K, value: VisitFormData[K]) {
    setForm((prev) => prev ? { ...prev, [key]: value } : prev);
  }

  async function handleSave() {
    if (!form) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/visits/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "更新失敗"); return; }
      setVisit(data.visit);
      setEditing(false);
    } catch {
      setError("サーバーに接続できません");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await fetch(`/api/visits/${id}`, { method: "DELETE" });
      router.push("/");
    } catch {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base">
        <div className="w-px h-8 bg-accent animate-pulse" />
      </div>
    );
  }

  if (!visit || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base">
        <p className="text-text-muted text-sm">記録が見つかりません</p>
      </div>
    );
  }

  const date = new Date(visit.date);
  const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
  const breakdown = calculatePrice(form);

  return (
    <div className="max-w-lg mx-auto px-5 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => (editing ? setEditing(false) : router.back())}
            className="text-text-muted hover:text-text transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider">
              {editing ? "編集中" : "来店詳細"}
            </p>
            <h2
              className="text-xl text-text tracking-wider"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              {STORE_LABELS[visit.store]}
            </h2>
          </div>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-text-muted hover:text-accent transition-colors"
          >
            編集
          </button>
        )}
      </div>

      {!editing ? (
        /* 詳細表示 */
        <div className="flex flex-col gap-4">
          {/* Date & amount */}
          <div className="rounded-sm border border-border bg-surface p-5">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-text-muted">{dateStr}（{dayNames[date.getDay()]}）</p>
                <p
                  className="text-4xl text-accent mt-1"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  ¥{visit.totalAmount.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-text-muted uppercase tracking-wider">{STORE_LABELS[visit.store]}</p>
                {visit.gender && (
                  <p className="text-xs text-text-muted mt-0.5">
                    {visit.gender === "male" ? "男性" : "女性"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="rounded-sm border border-border bg-surface overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-xs text-text-muted uppercase tracking-wider">内訳</p>
            </div>
            <div className="p-4 flex flex-col gap-2.5">
              {breakdown.lines.map((line, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-sm text-text-muted">{line.label}</span>
                  <span className="text-sm text-text">¥{line.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {visit.notes && (
            <div className="rounded-sm border border-border bg-surface p-4">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-2">メモ</p>
              <p className="text-sm text-text whitespace-pre-wrap">{visit.notes}</p>
            </div>
          )}

          {/* Delete */}
          <div className="mt-4">
            {!confirmDelete ? (
              <Button variant="ghost" fullWidth onClick={() => setConfirmDelete(true)}>
                この記録を削除する
              </Button>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-text-muted text-center">本当に削除しますか？</p>
                <div className="flex gap-2">
                  <Button variant="secondary" fullWidth onClick={() => setConfirmDelete(false)}>
                    キャンセル
                  </Button>
                  <Button variant="danger" fullWidth onClick={handleDelete} disabled={deleting}>
                    {deleting ? "削除中..." : "削除する"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* 編集フォーム */
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-text-muted uppercase tracking-wider">日付</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
              className="w-full bg-surface border border-border rounded-sm px-4 py-3 text-text text-sm focus:outline-none focus:border-accent/70 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-text-muted uppercase tracking-wider">店舗</label>
            <StoreSelector
              value={form.store}
              onChange={(store: Store) => setForm((prev) => prev ? {
                ...prev, store, courseId: "", gender: undefined, premiumSeat: false,
                roomType: undefined, isWeekend: undefined, guestCount: 1, extensionCount: 0, drinks: [], rentals: []
              } : prev)}
            />
          </div>

          {form.store === "ebisu" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-text-muted uppercase tracking-wider">フロア</label>
              <GenderSelector
                value={form.gender}
                onChange={(g: Gender) => { update("gender", g); update("courseId", ""); }}
              />
            </div>
          )}

          {(form.store !== "ebisu" || form.gender) && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-text-muted uppercase tracking-wider">コース</label>
              <CourseSelector
                store={form.store}
                gender={form.gender}
                courseId={form.courseId}
                premiumSeat={form.premiumSeat}
                roomType={form.roomType}
                isWeekend={form.isWeekend}
                onCourseChange={(id) => update("courseId", id)}
                onPremiumSeatChange={(v) => update("premiumSeat", v)}
                onRoomTypeChange={(v: RoomType) => update("roomType", v)}
                onWeekendChange={(v) => update("isWeekend", v)}
              />
            </div>
          )}

          {form.store === "private" && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-muted uppercase tracking-wider">人数</label>
                <GuestCountSelector
                  roomType={form.roomType}
                  count={form.guestCount}
                  onChange={(v) => update("guestCount", v)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-muted uppercase tracking-wider">延長</label>
                <ExtensionSelector
                  roomType={form.roomType}
                  count={form.extensionCount}
                  onChange={(v) => update("extensionCount", v)}
                />
              </div>
            </>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-text-muted uppercase tracking-wider">ドリンク</label>
            <DrinkSelector store={form.store} drinks={form.drinks} onChange={(v) => update("drinks", v)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-text-muted uppercase tracking-wider">レンタル</label>
            <RentalSelector store={form.store} rentals={form.rentals} onChange={(v) => update("rentals", v)} />
          </div>

          <PriceSummary formData={form} />

          <Textarea
            label="メモ"
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
          />

          {error && <p className="text-xs text-danger text-center">{error}</p>}

          <Button fullWidth onClick={handleSave} disabled={saving}>
            {saving ? "保存中..." : "更新する"}
          </Button>
        </div>
      )}
    </div>
  );
}
