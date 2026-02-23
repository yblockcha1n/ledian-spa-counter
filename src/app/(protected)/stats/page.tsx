"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import type { Visit } from "@/lib/types";
import { STORE_LABELS } from "@/lib/constants";

const C = {
  accent: "#c9a96e",
  accentLight: "#e8d5a8",
  muted: "#8a8580",
  border: "#2a2827",
  surface2: "#1e1e1e",
  text: "#f0ede8",
};

const STORE_COLORS = [C.accent, C.accentLight, C.muted];

// ---- data processors ----

function toMonthlyData(visits: Visit[]) {
  const map: Record<string, { month: string; count: number; amount: number }> = {};
  visits.forEach((v) => {
    const key = v.date.substring(0, 7);
    if (!map[key]) map[key] = { month: key, count: 0, amount: 0 };
    map[key].count++;
    map[key].amount += v.totalAmount;
  });
  return Object.values(map)
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-12)
    .map((d) => ({ ...d, month: d.month.replace(/^(\d{4})-(\d{2})$/, "$1/$2") }));
}

function toStoreData(visits: Visit[]) {
  return (["azabu", "ebisu", "private"] as const)
    .map((s) => ({ name: STORE_LABELS[s], value: visits.filter((v) => v.store === s).length }))
    .filter((d) => d.value > 0);
}

function toCumulativeData(visits: Visit[]) {
  const sorted = [...visits].sort((a, b) => a.date.localeCompare(b.date));
  let cum = 0;
  let cumAmt = 0;
  return sorted.map((v) => {
    cum++;
    cumAmt += v.totalAmount;
    return {
      date: v.date.replace(/^\d{4}-(\d{2})-(\d{2})$/, "$1/$2"),
      visits: cum,
      amount: cumAmt,
    };
  });
}

// ---- tooltip ----

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { dataKey: string; value: number; color?: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: C.surface2,
        border: `1px solid ${C.border}`,
        padding: "8px 12px",
        borderRadius: 2,
        fontSize: 12,
      }}
    >
      <p style={{ color: C.muted, fontSize: 10, marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => {
        const isAmount = p.dataKey === "amount";
        const display = isAmount ? `¥${p.value.toLocaleString()}` : `${p.value}${p.dataKey === "count" || p.dataKey === "visits" ? "回" : ""}`;
        return (
          <p key={i} style={{ color: p.color ?? C.accent }}>
            {display}
          </p>
        );
      })}
    </div>
  );
}

// ---- chart card ----

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-sm border border-border bg-surface overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <p className="text-xs text-text-muted uppercase tracking-wider">{title}</p>
      </div>
      <div className="px-2 pt-4 pb-3">{children}</div>
    </div>
  );
}

// ---- axis common props ----
const axisProps = {
  tick: { fill: C.muted, fontSize: 10 },
  axisLine: false as const,
  tickLine: false as const,
};

// ---- page ----

export default function StatsPage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/visits")
      .then((r) => r.json())
      .then((d) => { if (d.visits) setVisits(d.visits); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const monthly = toMonthlyData(visits);
  const store = toStoreData(visits);
  const cumulative = toCumulativeData(visits);

  return (
    <>
      {/* Sticky Header */}
      <header
        className="sticky z-50 bg-base border-b border-border"
        style={{ top: "env(safe-area-inset-top)" }}
      >
        <div className="max-w-lg mx-auto px-5 pt-5 pb-4">
          <p className="text-xs tracking-[0.3em] text-text-muted uppercase mb-1">Data</p>
          <h1
            className="text-3xl font-light tracking-[0.2em] text-text"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            ANALYTICS
          </h1>
          <div className="w-6 h-px bg-accent mt-2" />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 py-6">
        {loading ? (
          <div className="flex flex-col gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-52 rounded-sm bg-surface animate-pulse" />
            ))}
          </div>
        ) : visits.length === 0 ? (
          <div className="rounded-sm border border-border bg-surface p-12 text-center">
            <p className="text-text-muted text-sm">データがありません</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">

            {/* 月別来店回数 */}
            <ChartCard title="月別来店回数">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={monthly} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                  <XAxis dataKey="month" {...axisProps} />
                  <YAxis {...axisProps} allowDecimals={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: C.border }} />
                  <Bar dataKey="count" fill={C.accent} radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* 月別支出金額 */}
            <ChartCard title="月別支出金額">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={monthly} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                  <XAxis dataKey="month" {...axisProps} />
                  <YAxis
                    {...axisProps}
                    tickFormatter={(v: number) => `¥${(v / 1000).toFixed(0)}k`}
                    width={48}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: C.border }} />
                  <Bar dataKey="amount" fill={C.accent} radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* 店舗別内訳 */}
            <ChartCard title="店舗別内訳">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={store}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {store.map((_, i) => (
                      <Cell key={i} fill={STORE_COLORS[i % STORE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Custom legend */}
              <div className="flex justify-center flex-wrap gap-x-5 gap-y-1 mt-1 pb-1">
                {store.map((entry, i) => (
                  <div key={entry.name} className="flex items-center gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: STORE_COLORS[i % STORE_COLORS.length] }}
                    />
                    <span className="text-[11px] text-text-muted">{entry.name}</span>
                    <span className="text-[11px] text-text">{entry.value}回</span>
                  </div>
                ))}
              </div>
            </ChartCard>

            {/* 累計推移 */}
            <ChartCard title="累計来店回数">
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={cumulative} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                  <XAxis
                    dataKey="date"
                    {...axisProps}
                    interval="preserveStartEnd"
                  />
                  <YAxis {...axisProps} allowDecimals={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="visits"
                    stroke={C.accent}
                    strokeWidth={1.5}
                    dot={false}
                    activeDot={{ r: 4, fill: C.accent, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

          </div>
        )}
      </main>
    </>
  );
}
