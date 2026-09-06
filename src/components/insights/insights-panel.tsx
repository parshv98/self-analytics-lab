import { useMemo } from "react";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { categoryStats, wowChange, momChange } from "@/lib/analytics";
import { getCategoryColor, getCategoryIcon } from "@/lib/categories";
import { TrendLineChart } from "@/components/charts/trend-line-chart";
import { CategoryBarChart } from "@/components/charts/category-bar-chart";
import { DistributionPieChart } from "@/components/charts/distribution-pie-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

function TrendIcon({ value }: { value: number | null }) {
    if (value === null) return <Minus className="h-4 w-4 text-muted-foreground" />;
    if (value > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (value < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
}

export function InsightsPanel() {
    const { entries } = useAnalyticsData();
    const stats = useMemo(() => categoryStats(entries), [entries]);
    const wow = useMemo(() => wowChange(entries), [entries]);
    const mom = useMemo(() => momChange(entries), [entries]);

    const categories = Object.keys(stats);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Insights</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Analytics and trends across your data
                </p>
            </div>

            {/* Growth summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">
                            Week-over-Week
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-2">
                        <TrendIcon value={wow} />
                        <span
                            className={`text-2xl font-bold ${wow === null
                                ? "text-muted-foreground"
                                : wow > 0
                                    ? "text-green-500"
                                    : wow < 0
                                        ? "text-red-500"
                                        : "text-muted-foreground"
                                }`}
                        >
                            {wow === null ? "—" : `${wow > 0 ? "+" : ""}${wow}%`}
                        </span>
                        <span className="text-xs text-muted-foreground">vs last week</span>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">
                            Month-over-Month
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-2">
                        <TrendIcon value={mom} />
                        <span
                            className={`text-2xl font-bold ${mom === null
                                ? "text-muted-foreground"
                                : mom > 0
                                    ? "text-green-500"
                                    : mom < 0
                                        ? "text-red-500"
                                        : "text-muted-foreground"
                                }`}
                        >
                            {mom === null ? "—" : `${mom > 0 ? "+" : ""}${mom}%`}
                        </span>
                        <span className="text-xs text-muted-foreground">vs last month</span>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Trends Over Time (30 days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TrendLineChart days={30} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Category Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CategoryBarChart />
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <DistributionPieChart />
                </CardContent>
            </Card>

            {/* Per-category stats */}
            {categories.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-foreground mb-3">
                        Category Stats
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {categories.map((cat) => {
                            const s = stats[cat];
                            if (!s) return null;
                            return (
                                <Card key={cat} className="hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-2 flex flex-row items-center gap-2">
                                        <span
                                            className="h-3 w-3 rounded-full shrink-0"
                                            style={{ backgroundColor: getCategoryColor(cat) }}
                                        />
                                        <CardTitle className="text-sm">
                                            {getCategoryIcon(cat)} {cat}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                            <div className="text-muted-foreground">Entries</div>
                                            <div className="font-semibold">{s.count}</div>
                                            <div className="text-muted-foreground">Avg</div>
                                            <div className="font-semibold">{s.avg}</div>
                                            <div className="text-muted-foreground">Min</div>
                                            <div className="font-semibold">{s.min}</div>
                                            <div className="text-muted-foreground">Max</div>
                                            <div className="font-semibold">{s.max}</div>
                                        </dl>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
