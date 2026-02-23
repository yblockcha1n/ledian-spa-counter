"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import type { Visit } from "@/lib/types";
import { STORE_LABELS } from "@/lib/constants";

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/visits")
      .then((r) => r.json())
      .then((data) => {
        if (data.visits) setVisits(data.visits);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (authLoading) return <LoadingScreen />;

  const totalAmount = visits.reduce((s, v) => s + v.totalAmount, 0);
  const avgAmount = visits.length > 0 ? Math.round(totalAmount / visits.length) : 0;

  const storeCount = {
    azabu: visits.filter((v) => v.store === "azabu").length,
    ebisu: visits.filter((v) => v.store === "ebisu").length,
    private: visits.filter((v) => v.store === "private").length,
  };

  return (
    <main className="max-w-lg mx-auto px-5 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs tracking-[0.3em] text-text-muted uppercase mb-1">Welcome back</p>
          <h1
            className="text-3xl font-light tracking-[0.2em] text-text"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            LEDIAN SPA
          </h1>
          <div className="w-6 h-px bg-accent mt-2" />
        </div>
        <button
          onClick={logout}
          className="text-xs text-text-muted hover:text-text transition-colors mt-1"
        >
          ログアウト
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="来店回数" value={`${visits.length}`} unit="回" />
        <StatCard label="合計金額" value={`¥${(totalAmount / 1000).toFixed(1)}k`} />
        <StatCard label="平均単価" value={`¥${avgAmount.toLocaleString()}`} />
      </div>

      {/* Store breakdown */}
      <div className="rounded-sm border border-border bg-surface mb-6">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-xs text-text-muted uppercase tracking-wider">店舗別来店数</p>
        </div>
        <div className="grid grid-cols-3 divide-x divide-border">
          {(["azabu", "ebisu", "private"] as const).map((store) => (
            <div key={store} className="px-4 py-3 text-center">
              <p className="text-xl text-text" style={{ fontFamily: "var(--font-cormorant)" }}>
                {storeCount[store]}
              </p>
              <p className="text-xs text-text-muted mt-0.5">{STORE_LABELS[store]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent visits */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-text-muted uppercase tracking-wider">来店履歴</p>
          <p className="text-xs text-text-muted">{visits.length}件</p>
        </div>

        {loading ? (
          <div className="flex flex-col gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 rounded-sm bg-surface animate-pulse" />
            ))}
          </div>
        ) : visits.length === 0 ? (
          <div className="rounded-sm border border-border bg-surface p-8 text-center">
            <p className="text-text-muted text-sm">まだ来店記録がありません</p>
            <Link
              href="/visit/new"
              className="mt-3 inline-block text-xs text-accent hover:text-accent-light transition-colors"
            >
              最初の来店を記録する →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {visits.map((visit) => (
              <VisitCard key={visit.id} visit={visit} onClick={() => router.push(`/visit/${visit.id}`)} />
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <Link
        href="/visit/new"
        className="fixed right-5 w-14 h-14 rounded-full bg-accent flex items-center justify-center shadow-lg hover:bg-accent-light transition-colors active:scale-95"
        style={{ bottom: "calc(4rem + env(safe-area-inset-bottom) + 1rem)" }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0d0d0d" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </Link>
    </main>
  );
}

function StatCard({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="rounded-sm border border-border bg-surface px-3 py-4 text-center">
      <p className="text-xl text-text" style={{ fontFamily: "var(--font-cormorant)" }}>
        {value}
        {unit && <span className="text-sm ml-0.5">{unit}</span>}
      </p>
      <p className="text-[10px] text-text-muted mt-1 tracking-wider uppercase">{label}</p>
    </div>
  );
}

function VisitCard({ visit, onClick }: { visit: Visit; onClick: () => void }) {
  const date = new Date(visit.date);
  const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const dayStr = dayNames[date.getDay()];

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between rounded-sm border border-border bg-surface px-4 py-3 text-left hover:border-accent/40 transition-colors active:opacity-80"
    >
      <div className="flex items-center gap-4">
        <div className="text-center w-16">
          <p className="text-xs text-text-muted">{dayStr}</p>
          <p className="text-sm text-text" style={{ fontFamily: "var(--font-cormorant)" }}>
            {dateStr}
          </p>
        </div>
        <div className="w-px h-8 bg-border" />
        <div>
          <p className="text-sm text-text">{STORE_LABELS[visit.store]}</p>
          {visit.notes && (
            <p className="text-xs text-text-muted mt-0.5 truncate max-w-32">{visit.notes}</p>
          )}
        </div>
      </div>
      <p className="text-sm text-accent" style={{ fontFamily: "var(--font-cormorant)" }}>
        ¥{visit.totalAmount.toLocaleString()}
      </p>
    </button>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base">
      <div className="w-px h-8 bg-accent animate-pulse" />
    </div>
  );
}
