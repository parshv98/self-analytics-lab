import { useState, useMemo } from "react";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { EntryForm } from "@/components/forms/entry-form";
import { getCategoryColor, getCategoryIcon } from "@/lib/categories";
import { CATEGORIES } from "@/schemas/entry-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Search, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import type { AnalyticsEntry } from "@/hooks/useAnalyticsData";

const PAGE_SIZE = 20;

const TIME_RANGES = [
    { label: "Last 7 days", days: 7 },
    { label: "Last 30 days", days: 30 },
    { label: "Last 90 days", days: 90 },
    { label: "All time", days: 0 },
];

export function EntriesTable() {
    const { entries, deleteEntry } = useAnalyticsData();
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [timeRange, setTimeRange] = useState(30);
    const [editEntry, setEditEntry] = useState<AnalyticsEntry | null>(null);
    const [newOpen, setNewOpen] = useState(false);
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        const cutoff =
            timeRange > 0
                ? new Date(Date.now() - timeRange * 86400000)
                    .toISOString()
                    .split("T")[0]
                : "";

        return [...entries]
            .filter((e) => (cutoff ? e.date >= cutoff : true))
            .filter((e) =>
                categoryFilter === "all" ? true : e.category === categoryFilter
            )
            .filter((e) =>
                search
                    ? e.notes?.toLowerCase().includes(search.toLowerCase()) ||
                    e.category.toLowerCase().includes(search.toLowerCase())
                    : true
            )
            .sort((a, b) => (a.date > b.date ? -1 : 1));
    }, [entries, search, categoryFilter, timeRange]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleDelete = (entry: AnalyticsEntry) => {
        if (confirm("Delete this entry?")) {
            deleteEntry(entry.id);
            toast.success("Entry deleted.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Entries</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        {filtered.length} entries
                    </p>
                </div>
                <Dialog open={newOpen} onOpenChange={setNewOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            New Entry
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Log New Entry</DialogTitle>
                        </DialogHeader>
                        <EntryForm onDone={() => setNewOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-4">
                    <div className="flex flex-wrap gap-3">
                        <div className="relative flex-1 min-w-[160px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search notes or category..."
                                className="pl-9"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                            />
                        </div>
                        <Select
                            value={categoryFilter}
                            onValueChange={(v) => {
                                setCategoryFilter(v);
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All categories</SelectItem>
                                {CATEGORIES.map((c) => (
                                    <SelectItem key={c} value={c}>
                                        {getCategoryIcon(c)} {c}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="flex gap-1">
                            {TIME_RANGES.map(({ label, days }) => (
                                <Button
                                    key={days}
                                    variant={timeRange === days ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => {
                                        setTimeRange(days);
                                        setPage(1);
                                    }}
                                >
                                    {label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            {paginated.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                    <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">No entries found</p>
                    <p className="text-sm mt-1">Adjust filters or log your first entry.</p>
                </div>
            ) : (
                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Date
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Category
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                        Value
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">
                                        Notes
                                    </th>
                                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {paginated.map((entry) => (
                                    <tr key={entry.id} className="hover:bg-muted/40 transition-colors">
                                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                                            {entry.date}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="h-2.5 w-2.5 rounded-full shrink-0"
                                                    style={{
                                                        backgroundColor: getCategoryColor(entry.category),
                                                    }}
                                                />
                                                {entry.category}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant="secondary">{entry.value}</Badge>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground max-w-xs truncate hidden md:table-cell">
                                            {entry.notes ?? "—"}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex gap-1 justify-end">
                                                <Dialog
                                                    open={editEntry?.id === entry.id}
                                                    onOpenChange={(open) =>
                                                        !open && setEditEntry(null)
                                                    }
                                                >
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7"
                                                            onClick={() => setEditEntry(entry)}
                                                        >
                                                            <Pencil className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Edit Entry</DialogTitle>
                                                        </DialogHeader>
                                                        {editEntry && (
                                                            <EntryForm
                                                                existing={editEntry}
                                                                onDone={() => setEditEntry(null)}
                                                            />
                                                        )}
                                                    </DialogContent>
                                                </Dialog>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-destructive hover:text-destructive"
                                                    onClick={() => handleDelete(entry)}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                            <span className="text-xs text-muted-foreground">
                                Page {page} of {totalPages}
                            </span>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page === 1}
                                    onClick={() => setPage((p) => p - 1)}
                                >
                                    Prev
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page === totalPages}
                                    onClick={() => setPage((p) => p + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
            )}

            {/* Edit dialog kept separate to allow it to persist */}
        </div>
    );
}
