import { useMemo } from "react";
import type { AnalyticsEntry } from "@/hooks/useAnalyticsData";

/* ── streak calculation ── */
export function calcStreak(entries: AnalyticsEntry[]): number {
    if (!entries.length) return 0;
    const days = new Set(entries.map((e) => e.date));
    const today = new Date();
    let streak = 0;
    for (let i = 0; i <= 365; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const key = d.toISOString().split("T")[0] ?? "";
        if (days.has(key)) {
            streak++;
        } else if (i > 0) {
            break;
        }
    }
    return streak;
}

/* ── week-over-week % change (by entry count) ── */
export function wowChange(entries: AnalyticsEntry[]): number | null {
    if (!entries.length) return null;
    const now = Date.now();
    const day = 86400000;
    const thisWeek = entries.filter(
        (e) => new Date(e.date).getTime() >= now - 7 * day
    ).length;
    const lastWeek = entries.filter((e) => {
        const t = new Date(e.date).getTime();
        return t >= now - 14 * day && t < now - 7 * day;
    }).length;
    if (lastWeek === 0) return null;
    return Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
}

/* ── top category this month ── */
export function topCategoryThisMonth(entries: AnalyticsEntry[]): {
    category: string;
    count: number;
} | null {
    const monthStart = new Date();
    monthStart.setDate(1);
    const key = monthStart.toISOString().split("T")[0];
    const recent = entries.filter((e) => e.date >= key);
    if (!recent.length) return null;
    const counts: Record<string, number> = {};
    recent.forEach((e) => {
        counts[e.category] = (counts[e.category] ?? 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const top = sorted[0];
    if (!top) return null;
    return { category: top[0], count: top[1] };
}

/* ── category counts for charts ── */
export function categoryCounts(
    entries: AnalyticsEntry[]
): { category: string; count: number }[] {
    const counts: Record<string, number> = {};
    entries.forEach((e) => {
        counts[e.category] = (counts[e.category] ?? 0) + 1;
    });
    return Object.entries(counts).map(([category, count]) => ({
        category,
        count,
    }));
}

/* ── daily series for line chart (last N days) ── */
export function dailySeries(
    entries: AnalyticsEntry[],
    days = 30
): { date: string;[cat: string]: number | string }[] {
    const now = Date.now();
    const cutoff = new Date(now - days * 86400000).toISOString().split("T")[0] ?? "";
    const filtered = entries.filter((e) => e.date >= cutoff);

    const map: Record<string, Record<string, number>> = {};
    filtered.forEach((e) => {
        const existing = map[e.date];
        if (!existing) map[e.date] = {};
        const row = map[e.date];
        if (row) row[e.category] = e.value;
    });

    return Object.entries(map)
        .sort(([a], [b]) => (a > b ? 1 : -1))
        .map(([date, cats]) => ({ date, ...cats }));
}

/* ── stats per category ── */
export function categoryStats(
    entries: AnalyticsEntry[]
): Record<
    string,
    { avg: number; min: number; max: number; count: number }
> {
    const groups: Record<string, number[]> = {};
    entries.forEach((e) => {
        if (!groups[e.category]) groups[e.category] = [];
        groups[e.category].push(e.value);
    });
    const result: Record<string, { avg: number; min: number; max: number; count: number }> = {};
    Object.entries(groups).forEach(([cat, vals]) => {
        if (!vals || vals.length === 0) return;
        result[cat] = {
            avg: Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10,
            min: Math.min(...vals),
            max: Math.max(...vals),
            count: vals.length,
        };
    });
    return result;
}

/* ── month-over-month change ── */
export function momChange(entries: AnalyticsEntry[]): number | null {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split("T")[0] ?? "";
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        .toISOString()
        .split("T")[0] ?? "";

    const thisMonth = entries.filter(
        (e) => e.date >= thisMonthStart
    ).length;
    const lastMonth = entries.filter(
        (e) => e.date >= lastMonthStart && e.date < thisMonthStart
    ).length;

    if (lastMonth === 0) return null;
    return Math.round(((thisMonth - lastMonth) / lastMonth) * 100);
}

export function useStats(entries: AnalyticsEntry[]) {
    return useMemo(
        () => ({
            streak: calcStreak(entries),
            wowChange: wowChange(entries),
            momChange: momChange(entries),
            topCategory: topCategoryThisMonth(entries),
            categoryCounts: categoryCounts(entries),
            categoryStats: categoryStats(entries),
        }),
        [entries]
    );
}
