import { useMemo } from "react";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { useStats } from "@/lib/analytics";
import { getCategoryColor, getCategoryIcon } from "@/lib/categories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import {
    Activity,
    Flame,
    TrendingUp,
    TrendingDown,
    Minus,
    Tag,
    ArrowRight,
} from "lucide-react";

function StatCard({
    icon,
    title,
    value,
    sub,
    accent,
}: {
    icon: React.ReactNode;
    title: string;
    value: string;
    sub?: string;
    accent?: string;
}) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <div
                    className="h-9 w-9 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: accent ? `${accent}20` : undefined }}
                >
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-foreground">{value}</div>
                {sub && (
                    <p className="text-xs text-muted-foreground mt-1">{sub}</p>
                )}
            </CardContent>
        </Card>
    );
}

export function DashboardHome() {
    const { entries, goals } = useAnalyticsData();
    const stats = useStats(entries);

    const recentEntries = useMemo(
        () =>
            [...entries]
                .sort((a, b) => (a.date > b.date ? -1 : 1))
                .slice(0, 5),
        [entries]
    );

    const wowDisplay = () => {
        if (stats.wowChange === null) return { label: "Not enough data", Icon: Minus, color: "text-muted-foreground" };
        if (stats.wowChange > 0) return { label: `+${stats.wowChange}% vs last week`, Icon: TrendingUp, color: "text-green-500" };
        if (stats.wowChange < 0) return { label: `${stats.wowChange}% vs last week`, Icon: TrendingDown, color: "text-red-500" };
        return { label: "Flat vs last week", Icon: Minus, color: "text-muted-foreground" };
    };

    const wow = wowDisplay();

    const streakColor =
        stats.streak >= 7 ? "text-green-500" :
            stats.streak >= 3 ? "text-yellow-500" :
                "text-muted-foreground";

    const topGoals = goals.slice(0, 3);

    return (
        <div className="space-y-6">
            {/* Page title */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Your personal analytics overview
                </p>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                    icon={<Activity className="h-5 w-5 text-blue-500" />}
                    title="Total Entries"
                    value={entries.length.toString()}
                    sub="All time logged events"
                    accent="#3b82f6"
                />

                <StatCard
                    icon={<Flame className={`h-5 w-5 ${streakColor}`} />}
                    title="Current Streak"
                    value={`${stats.streak} day${stats.streak !== 1 ? "s" : ""}`}
                    sub={stats.streak >= 7 ? "🔥 On fire!" : stats.streak > 0 ? "Keep it up!" : "Log today to start!"}
                    accent={stats.streak >= 7 ? "#22c55e" : "#f59e0b"}
                />

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Week Trend
                        </CardTitle>
                        <div className="h-9 w-9 rounded-lg flex items-center justify-center bg-muted">
                            <wow.Icon className={`h-5 w-5 ${wow.color}`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${wow.color}`}>
                            {stats.wowChange !== null
                                ? `${stats.wowChange > 0 ? "+" : ""}${stats.wowChange}%`
                                : "—"}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{wow.label}</p>
                    </CardContent>
                </Card>

                <StatCard
                    icon={<Tag className="h-5 w-5 text-purple-500" />}
                    title="Top Category"
                    value={stats.topCategory ? stats.topCategory.category : "—"}
                    sub={
                        stats.topCategory
                            ? `${stats.topCategory.count} entries this month`
                            : "No entries this month"
                    }
                    accent="#8b5cf6"
                />
            </div>

            {/* Goals & Recent Entries */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Goal progress */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base">Goal Progress</CardTitle>
                        <Link
                            to="/goals"
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                            View all <ArrowRight className="h-3 w-3" />
                        </Link>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {topGoals.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-6">
                                No goals yet.{" "}
                                <Link to="/goals" className="text-primary underline">
                                    Create one
                                </Link>
                            </p>
                        ) : (
                            topGoals.map((goal) => {
                                const pct = Math.min(
                                    Math.round((goal.currentValue / goal.target) * 100),
                                    100
                                );
                                const barColor =
                                    pct >= 75 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";
                                return (
                                    <div key={goal.id} className="space-y-1.5">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium text-foreground truncate max-w-[60%]">
                                                {getCategoryIcon(goal.category)} {goal.name}
                                            </span>
                                            <span className="text-muted-foreground text-xs ml-2 shrink-0">
                                                {goal.currentValue}/{goal.target} · {pct}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full transition-all"
                                                style={{ width: `${pct}%`, backgroundColor: barColor }}
                                            />
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </CardContent>
                </Card>

                {/* Recent entries */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base">Recent Entries</CardTitle>
                        <Link
                            to="/entries"
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                            View all <ArrowRight className="h-3 w-3" />
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {recentEntries.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-6">
                                No entries yet.{" "}
                                <Link to="/entries" className="text-primary underline">
                                    Log your first entry
                                </Link>
                            </p>
                        ) : (
                            <div className="divide-y divide-border">
                                {recentEntries.map((e) => (
                                    <div
                                        key={e.id}
                                        className="flex items-center justify-between py-2.5 gap-2"
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div
                                                className="h-2 w-2 rounded-full shrink-0"
                                                style={{ backgroundColor: getCategoryColor(e.category) }}
                                            />
                                            <span className="text-sm text-foreground truncate">
                                                {e.category}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <Badge variant="secondary" className="text-xs">
                                                {e.value}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">
                                                {e.date}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
