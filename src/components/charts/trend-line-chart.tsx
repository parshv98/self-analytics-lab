import { useMemo } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { dailySeries } from "@/lib/analytics";
import { getCategoryColor } from "@/lib/categories";
import { CATEGORIES } from "@/schemas/entry-schema";

interface TrendLineChartProps {
    days?: number;
    selectedCategories?: string[];
}

export function TrendLineChart({
    days = 30,
    selectedCategories,
}: TrendLineChartProps) {
    const { entries } = useAnalyticsData();
    const data = useMemo(() => dailySeries(entries, days), [entries, days]);

    // Find categories present in data
    const activeCategories = useMemo(() => {
        const cats = new Set<string>();
        data.forEach((row) =>
            Object.keys(row).forEach((k) => {
                if (k !== "date") cats.add(k);
            })
        );
        return selectedCategories
            ? [...cats].filter((c) => selectedCategories.includes(c))
            : [...cats];
    }, [data, selectedCategories]);

    if (data.length === 0) {
        return (
            <p className="text-sm text-muted-foreground text-center py-8">
                No data in the last {days} days.
            </p>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v: string) => v.slice(5)}
                />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip
                    contentStyle={{ fontSize: 12 }}
                    labelFormatter={(v: string) => `Date: ${v}`}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                {activeCategories.map((cat) => (
                    <Line
                        key={cat}
                        type="monotone"
                        dataKey={cat}
                        stroke={getCategoryColor(cat)}
                        strokeWidth={2}
                        dot={false}
                        connectNulls
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
}
