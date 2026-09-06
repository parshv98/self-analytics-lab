import { useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
    ResponsiveContainer,
} from "recharts";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { categoryCounts } from "@/lib/analytics";
import { getCategoryColor } from "@/lib/categories";

export function CategoryBarChart() {
    const { entries } = useAnalyticsData();
    const data = useMemo(() => categoryCounts(entries), [entries]);

    if (data.length === 0) {
        return (
            <p className="text-sm text-muted-foreground text-center py-8">
                No entries yet to display.
            </p>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} margin={{ top: 4, right: 16, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Entries">
                    {data.map((entry, idx) => (
                        <Cell key={idx} fill={getCategoryColor(entry.category)} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
