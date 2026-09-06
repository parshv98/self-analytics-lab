export const CATEGORY_COLORS: Record<string, string> = {
    Health: "#22c55e",
    Productivity: "#6366f1",
    Mood: "#f59e0b",
    Sleep: "#8b5cf6",
    Exercise: "#ef4444",
    Finance: "#14b8a6",
    Learning: "#3b82f6",
};

export function getCategoryColor(category: string): string {
    return CATEGORY_COLORS[category] ?? "#94a3b8";
}

export const CATEGORY_ICONS: Record<string, string> = {
    Health: "❤️",
    Productivity: "⚡",
    Mood: "😊",
    Sleep: "🌙",
    Exercise: "🏃",
    Finance: "💰",
    Learning: "📚",
};

export function getCategoryIcon(category: string): string {
    return CATEGORY_ICONS[category] ?? "📌";
}
