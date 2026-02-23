"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StoreSelector from "@/components/visit/StoreSelector";
import GenderSelector from "@/components/visit/GenderSelector";
import CourseSelector from "@/components/visit/CourseSelector";
import DrinkSelector from "@/components/visit/DrinkSelector";
import RentalSelector from "@/components/visit/RentalSelector";
import ExtensionSelector from "@/components/visit/ExtensionSelector";
import GuestCountSelector from "@/components/visit/GuestCountSelector";
import PriceSummary from "@/components/visit/PriceSummary";
import Button from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import type { VisitFormData, Store, Gender, RoomType } from "@/lib/types";

const today = () => new Date().toISOString().split("T")[0];

const STEPS = ["店舗", "コース", "オプション", "追加", "確認"] as const;

const defaultForm = (): VisitFormData => ({
  date: today(),
  store: "azabu",
  gender: undefined,
  courseId: "",
  premiumSeat: false,
  roomType: undefined,
  isWeekend: undefined,
  guestCount: 1,
  extensionCount: 0,
  drinks: [],
  rentals: [],
  notes: "",
});

export default function NewVisitPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<VisitFormData>(defaultForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof VisitFormData>(key: K, value: VisitFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleStoreChange(store: Store) {
    setForm((prev) => ({
      ...prev,
      store,
      courseId: "",
      gender: undefined,
      premiumSeat: false,
      roomType: undefined,
      isWeekend: undefined,
      guestCount: 1,
      extensionCount: 0,
      drinks: [],
      rentals: [],
    }));
  }

  function canProceed(): boolean {
    if (step === 0) return true;
    if (step === 1) {
      if (form.store === "ebisu" && !form.gender) return false;
      if (form.store === "private") return !!form.roomType && form.isWeekend !== undefined;
      return !!form.courseId;
    }
    return true;
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "保存に失敗しました");
        return;
      }
      router.push(`/visit/${data.visit.id}`);
    } catch {
      setError("サーバーに接続できません");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto px-5 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => (step === 0 ? router.back() : setStep(step - 1))}
          className="text-text-muted hover:text-text transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <p className="text-xs text-text-muted uppercase tracking-wider">
            来店記録 — Step {step + 1} / {STEPS.length}
          </p>
          <h2
            className="text-xl text-text tracking-wider"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            {STEPS[step]}
          </h2>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex gap-1 mb-6">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={[
              "h-0.5 flex-1 transition-colors duration-300",
              i <= step ? "bg-accent" : "bg-border",
            ].join(" ")}
          />
        ))}
      </div>

      {/* Step content */}
      <div className="min-h-[400px]">
        {step === 0 && (
          <div className="flex flex-col gap-6">
            {/* Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-text-muted uppercase tracking-wider">日付</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
                className="w-full bg-surface border border-border rounded-sm px-4 py-3 text-text text-sm focus:outline-none focus:border-accent/70 transition-colors"
              />
            </div>
            {/* Store */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-text-muted uppercase tracking-wider">店舗</label>
              <StoreSelector value={form.store} onChange={handleStoreChange} />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-4">
            {/* 恵比寿のみ性別選択 */}
            {form.store === "ebisu" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-muted uppercase tracking-wider">フロア</label>
                <GenderSelector
                  value={form.gender}
                  onChange={(g: Gender) => {
                    update("gender", g);
                    update("courseId", "");
                  }}
                />
              </div>
            )}
            {/* コース選択 */}
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
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            {form.store === "private" && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-text-muted uppercase tracking-wider">利用人数</label>
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
            {form.store !== "private" && (
              <div className="rounded-sm border border-border bg-surface p-6 text-center">
                <p className="text-sm text-text-muted">
                  {form.store === "azabu" ? "麻布十番" : "恵比寿"}はオプション設定不要です
                </p>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-text-muted uppercase tracking-wider">ドリンク</label>
              <DrinkSelector
                store={form.store}
                drinks={form.drinks}
                onChange={(v) => update("drinks", v)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-text-muted uppercase tracking-wider">レンタル</label>
              <RentalSelector
                store={form.store}
                rentals={form.rentals}
                onChange={(v) => update("rentals", v)}
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-4">
            <PriceSummary formData={form} />
            <Textarea
              label="メモ（任意）"
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="感想・体調など..."
            />
            {error && <p className="text-xs text-danger text-center">{error}</p>}
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="mt-8 flex gap-3">
        {step < STEPS.length - 1 ? (
          <Button
            fullWidth
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
          >
            次へ
          </Button>
        ) : (
          <Button fullWidth onClick={handleSave} disabled={saving}>
            {saving ? "保存中..." : "来店を記録する"}
          </Button>
        )}
      </div>
    </div>
  );
}
