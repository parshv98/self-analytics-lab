import type { AnalyticsEntry } from "@/hooks/useAnalyticsData";

export function exportToCSV(entries: AnalyticsEntry[]): void {
    let csv = "Date,Category,Value,Notes\n";
    entries.forEach((e) => {
        const notes = (e.notes ?? "").replace(/"/g, '""');
        csv += `${e.date},${e.category},${e.value},"${notes}"\n`;
    });
    triggerDownload(csv, "text/csv", `analytics-entries-${today()}.csv`);
}

export function exportToJSON(data: object): void {
    const json = JSON.stringify(data, null, 2);
    triggerDownload(json, "application/json", `analytics-backup-${today()}.json`);
}

export function importFromJSON(
    file: File
): Promise<{ entries: AnalyticsEntry[]; goals: unknown[] }> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string);
                if (!data.entries || !Array.isArray(data.entries)) {
                    reject(new Error("Invalid file: expected an 'entries' array."));
                    return;
                }
                resolve(data);
            } catch {
                reject(new Error("Invalid JSON format."));
            }
        };
        reader.onerror = () => reject(new Error("File read failed."));
        reader.readAsText(file);
    });
}

function triggerDownload(content: string, type: string, filename: string): void {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function today(): string {
    return new Date().toISOString().split("T")[0] ?? "";
}
