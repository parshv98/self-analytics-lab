import { useRef } from "react";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { exportToCSV, exportToJSON, importFromJSON } from "@/lib/export";
import { seedDemoData } from "@/lib/demo-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Download, Upload, Trash2, RefreshCw, FileJson, FileSpreadsheet } from "lucide-react";

export function SettingsPage() {
    const { entries, goals, exportData, importData, clearAllData } =
        useAnalyticsData();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCSVExport = () => {
        exportToCSV(entries);
        toast.success("CSV exported!");
    };

    const handleJSONExport = () => {
        exportToJSON(exportData());
        toast.success("JSON backup saved!");
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const data = await importFromJSON(file);
            importData(data as Parameters<typeof importData>[0]);
            toast.success(
                `Imported ${data.entries.length} entries and ${(data as any).goals?.length ?? 0} goals.`
            );
        } catch (err: any) {
            toast.error(err.message ?? "Import failed.");
        }
        e.target.value = "";
    };

    const handleClear = () => {
        clearAllData();
        toast.success("All data cleared.");
    };

    const handleSeedDemo = () => {
        localStorage.removeItem("analytics_seeded");
        seedDemoData();
        // Reload so hooks re-read localStorage
        window.location.reload();
    };

    return (
        <div className="space-y-6 max-w-xl">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Settings</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Manage your data and preferences
                </p>
            </div>

            {/* Data summary */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Data Summary</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1 text-muted-foreground">
                    <p>
                        📊 <strong className="text-foreground">{entries.length}</strong>{" "}
                        entries logged
                    </p>
                    <p>
                        🎯 <strong className="text-foreground">{goals.length}</strong>{" "}
                        goals created
                    </p>
                    <p>
                        💾 All data stored locally in your browser (localStorage)
                    </p>
                </CardContent>
            </Card>

            {/* Export */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Export Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                        Download your entries as CSV or a full JSON backup.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Button variant="outline" onClick={handleCSVExport}>
                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                            Export CSV
                        </Button>
                        <Button variant="outline" onClick={handleJSONExport}>
                            <FileJson className="h-4 w-4 mr-2" />
                            Export JSON
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Import */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Import Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                        Restore from a previously exported JSON backup.
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={handleImport}
                    />
                    <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload className="h-4 w-4 mr-2" />
                        Import JSON
                    </Button>
                </CardContent>
            </Card>

            {/* Demo data */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Demo Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                        Re-seed the app with sample demo entries and goals.
                    </p>
                    <Button variant="outline" onClick={handleSeedDemo}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Re-seed Demo Data
                    </Button>
                </CardContent>
            </Card>

            {/* Danger zone */}
            <Card className="border-destructive/50">
                <CardHeader>
                    <CardTitle className="text-base text-destructive">
                        Danger Zone
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                        Permanently delete all entries and goals. This cannot be undone.
                    </p>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Clear All Data
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete all {entries.length} entries and{" "}
                                    {goals.length} goals. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    onClick={handleClear}
                                >
                                    Yes, delete everything
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>
        </div>
    );
}
