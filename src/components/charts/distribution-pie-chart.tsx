import { useMemo } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Legend,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { categoryCounts } from "@/lib/analytics";
import { getCategoryColor } from "@/lib/categories";

export function DistributionPieChart() {
    const { entries } = useAnalyticsData();
    const data = useMemo(() => {
        const counts = categoryCounts(entries);
        const total = counts.reduce((sum, c) => sum + c.count, 0);
        return counts.map((c) => ({
            name: c.category,
            value: Math.round((c.count / total) * 100),
            count: c.count,
        }));
    }, [entries]);

    if (data.length === 0) {
        return (
            <p className="text-sm text-muted-foreground text-center py-8">
                No entries yet to display.
            </p>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={280}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="45%"
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                    labelLine={false}
                >
                    {data.map((entry, idx) => (
                        <Cell key={idx} fill={getCategoryColor(entry.name)} />
                    ))}
                </Pie>
                <Tooltip
                    formatter={(value: number, name: string, props) =>
                        [`${props.payload.count} entries (${value}%)`, name]
                    }
                    contentStyle={{ fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
        </ResponsiveContainer>
    );
}
