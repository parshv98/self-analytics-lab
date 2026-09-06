import { useState, useCallback, useEffect } from "react";

export interface AnalyticsEntry {
    id: string;
    date: string; // ISO date string "YYYY-MM-DD"
    category: string;
    value: number;
    notes?: string;
}

export interface AnalyticsGoal {
    id: string;
    name: string;
    category: string;
    target: number;
    currentValue: number;
    startDate: string; // ISO date string
}

const ENTRIES_KEY = "analytics_entries";
const GOALS_KEY = "analytics_goals";

function readStorage<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
        return fallback;
    }
}

function writeStorage<T>(key: string, value: T): void {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
        console.error("localStorage quota exceeded:", err);
    }
}

function uuid(): string {
    return (
        Math.random().toString(36).slice(2, 10) +
        "-" +
        Date.now().toString(36)
    );
}

export function useAnalyticsData() {
    const [entries, setEntries] = useState<AnalyticsEntry[]>(() =>
        readStorage<AnalyticsEntry[]>(ENTRIES_KEY, [])
    );
    const [goals, setGoals] = useState<AnalyticsGoal[]>(() =>
        readStorage<AnalyticsGoal[]>(GOALS_KEY, [])
    );

    // Keep goals' currentValue in sync with entries
    const computedGoals = useCallback(
        (rawGoals: AnalyticsGoal[], rawEntries: AnalyticsEntry[]): AnalyticsGoal[] => {
            return rawGoals.map((goal) => {
                const relevant = rawEntries.filter(
                    (e) =>
                        e.category === goal.category && e.date >= goal.startDate
                );
                return {
                    ...goal,
                    currentValue: relevant.length,
                };
            });
        },
        []
    );

    const derivedGoals = computedGoals(goals, entries);

    // Listen for storage changes from other tabs
    useEffect(() => {
        const handler = () => {
            setEntries(readStorage<AnalyticsEntry[]>(ENTRIES_KEY, []));
            setGoals(readStorage<AnalyticsGoal[]>(GOALS_KEY, []));
        };
        window.addEventListener("storage", handler);
        return () => window.removeEventListener("storage", handler);
    }, []);

    /* ── Entry CRUD ── */

    const addEntry = useCallback(
        (entry: Omit<AnalyticsEntry, "id">) => {
            const newEntry: AnalyticsEntry = { ...entry, id: uuid() };
            setEntries((prev) => {
                const updated = [...prev, newEntry];
                writeStorage(ENTRIES_KEY, updated);
                return updated;
            });
        },
        []
    );

    const updateEntry = useCallback(
        (id: string, patch: Partial<Omit<AnalyticsEntry, "id">>) => {
            setEntries((prev) => {
                const updated = prev.map((e) =>
                    e.id === id ? { ...e, ...patch } : e
                );
                writeStorage(ENTRIES_KEY, updated);
                return updated;
            });
        },
        []
    );

    const deleteEntry = useCallback((id: string) => {
        setEntries((prev) => {
            const updated = prev.filter((e) => e.id !== id);
            writeStorage(ENTRIES_KEY, updated);
            return updated;
        });
    }, []);

    /* ── Goal CRUD ── */

    const addGoal = useCallback(
        (goal: Omit<AnalyticsGoal, "id" | "currentValue">) => {
            const newGoal: AnalyticsGoal = { ...goal, id: uuid(), currentValue: 0 };
            setGoals((prev) => {
                const updated = [...prev, newGoal];
                writeStorage(GOALS_KEY, updated);
                return updated;
            });
        },
        []
    );

    const updateGoal = useCallback(
        (id: string, patch: Partial<Omit<AnalyticsGoal, "id">>) => {
            setGoals((prev) => {
                const updated = prev.map((g) =>
                    g.id === id ? { ...g, ...patch } : g
                );
                writeStorage(GOALS_KEY, updated);
                return updated;
            });
        },
        []
    );

    const deleteGoal = useCallback((id: string) => {
        setGoals((prev) => {
            const updated = prev.filter((g) => g.id !== id);
            writeStorage(GOALS_KEY, updated);
            return updated;
        });
    }, []);

    /* ── Export / Import ── */

    const exportData = useCallback(() => {
        return { entries, goals, exportedAt: new Date().toISOString() };
    }, [entries, goals]);

    const importData = useCallback(
        (data: { entries: AnalyticsEntry[]; goals: AnalyticsGoal[] }) => {
            writeStorage(ENTRIES_KEY, data.entries);
            writeStorage(GOALS_KEY, data.goals);
            setEntries(data.entries);
            setGoals(data.goals);
        },
        []
    );

    const clearAllData = useCallback(() => {
        localStorage.removeItem(ENTRIES_KEY);
        localStorage.removeItem(GOALS_KEY);
        localStorage.removeItem("analytics_seeded");
        setEntries([]);
        setGoals([]);
    }, []);

    return {
        entries,
        goals: derivedGoals,
        addEntry,
        updateEntry,
        deleteEntry,
        addGoal,
        updateGoal,
        deleteGoal,
        exportData,
        importData,
        clearAllData,
    };
}
