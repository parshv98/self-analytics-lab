import type { AnalyticsEntry, AnalyticsGoal } from "@/hooks/useAnalyticsData";

function daysAgo(n: number): string {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().split("T")[0] ?? "";
}

let _id = 1;
const uid = () => `demo-${_id++}`;

export const DEMO_ENTRIES: AnalyticsEntry[] = [
    { id: uid(), date: daysAgo(27), category: "Sleep", value: 6.5, notes: "Stayed up late watching TV" },
    { id: uid(), date: daysAgo(26), category: "Productivity", value: 70, notes: "Focused morning session" },
    { id: uid(), date: daysAgo(25), category: "Mood", value: 75 },
    { id: uid(), date: daysAgo(24), category: "Exercise", value: 45, notes: "Morning run 5km" },
    { id: uid(), date: daysAgo(23), category: "Health", value: 80 },
    { id: uid(), date: daysAgo(22), category: "Sleep", value: 7.5, notes: "Good rest" },
    { id: uid(), date: daysAgo(21), category: "Finance", value: 65, notes: "Tracked spending" },
    { id: uid(), date: daysAgo(20), category: "Learning", value: 60, notes: "Read for 1 hour" },
    { id: uid(), date: daysAgo(19), category: "Productivity", value: 55, notes: "Meetings day" },
    { id: uid(), date: daysAgo(18), category: "Mood", value: 60 },
    { id: uid(), date: daysAgo(17), category: "Exercise", value: 30, notes: "Short yoga session" },
    { id: uid(), date: daysAgo(16), category: "Sleep", value: 8, notes: "Excellent sleep" },
    { id: uid(), date: daysAgo(15), category: "Health", value: 85 },
    { id: uid(), date: daysAgo(14), category: "Productivity", value: 90, notes: "Deep work day, great output" },
    { id: uid(), date: daysAgo(13), category: "Finance", value: 72, notes: "Saved 10% of income" },
    { id: uid(), date: daysAgo(12), category: "Learning", value: 80, notes: "Finished a course module" },
    { id: uid(), date: daysAgo(11), category: "Mood", value: 85, notes: "Feeling motivated" },
    { id: uid(), date: daysAgo(10), category: "Exercise", value: 60, notes: "45m gym session" },
    { id: uid(), date: daysAgo(9), category: "Sleep", value: 7, notes: "Woke up once" },
    { id: uid(), date: daysAgo(8), category: "Health", value: 78 },
    { id: uid(), date: daysAgo(7), category: "Productivity", value: 82, notes: "Shipped new feature" },
    { id: uid(), date: daysAgo(6), category: "Mood", value: 90, notes: "Very happy day" },
    { id: uid(), date: daysAgo(5), category: "Learning", value: 70, notes: "Read 40 pages" },
    { id: uid(), date: daysAgo(4), category: "Exercise", value: 75, notes: "10km run, personal best!" },
    { id: uid(), date: daysAgo(3), category: "Sleep", value: 7.5, notes: "Dream-filled night" },
    { id: uid(), date: daysAgo(2), category: "Finance", value: 80, notes: "Invested monthly amount" },
    { id: uid(), date: daysAgo(1), category: "Productivity", value: 88, notes: "Clear todos list" },
    { id: uid(), date: daysAgo(0), category: "Health", value: 82, notes: "Vitamins + hydration" },
];

export const DEMO_GOALS: AnalyticsGoal[] = [
    {
        id: "goal-1",
        name: "Sleep 7+ hours nightly",
        category: "Sleep",
        target: 20,
        currentValue: 0, // computed
        startDate: daysAgo(30),
    },
    {
        id: "goal-2",
        name: "Exercise 30 sessions",
        category: "Exercise",
        target: 30,
        currentValue: 0,
        startDate: daysAgo(30),
    },
    {
        id: "goal-3",
        name: "Productive score avg 80+",
        category: "Productivity",
        target: 80,
        currentValue: 0,
        startDate: daysAgo(30),
    },
    {
        id: "goal-4",
        name: "Learning: 20 sessions",
        category: "Learning",
        target: 20,
        currentValue: 0,
        startDate: daysAgo(30),
    },
];

export function seedDemoData(): void {
    if (typeof window === "undefined") return; // SSR guard
    const alreadySeeded = localStorage.getItem("analytics_seeded");
    if (alreadySeeded) return;

    localStorage.setItem("analytics_entries", JSON.stringify(DEMO_ENTRIES));
    localStorage.setItem("analytics_goals", JSON.stringify(DEMO_GOALS));
    localStorage.setItem("analytics_seeded", "true");
}
