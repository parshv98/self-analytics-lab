import { useState } from "react";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { GoalForm } from "@/components/forms/goal-form";
import { getCategoryColor, getCategoryIcon } from "@/lib/categories";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Trophy } from "lucide-react";
import { toast } from "sonner";
import type { AnalyticsGoal } from "@/hooks/useAnalyticsData";

function GoalCard({ goal }: { goal: AnalyticsGoal }) {
    const { deleteGoal } = useAnalyticsData();
    const [editOpen, setEditOpen] = useState(false);
    const pct = Math.min(
        Math.round((goal.currentValue / goal.target) * 100),
        100
    );
    const barColor =
        pct >= 75 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";

    const handleDelete = () => {
        if (confirm(`Delete goal "${goal.name}"?`)) {
            deleteGoal(goal.id);
            toast.success("Goal deleted.");
        }
    };

    return (
        <Card>
            <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xl">{getCategoryIcon(goal.category)}</span>
                    <div className="min-w-0">
                        <CardTitle className="text-sm font-semibold truncate">
                            {goal.name}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">{goal.category}</p>
                    </div>
                </div>
                <div className="flex gap-1 shrink-0">
                    <Dialog open={editOpen} onOpenChange={setEditOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Pencil className="h-3.5 w-3.5" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Goal</DialogTitle>
                            </DialogHeader>
                            <GoalForm existing={goal} onDone={() => setEditOpen(false)} />
                        </DialogContent>
                    </Dialog>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={handleDelete}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                        {goal.currentValue} / {goal.target} entries
                    </span>
                    <span className="font-semibold" style={{ color: barColor }}>
                        {pct}%
                    </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                        className="h-2.5 rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: barColor }}
                    />
                </div>
                <p className="text-xs text-muted-foreground">
                    Since {goal.startDate}
                </p>
                {pct >= 100 && (
                    <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                        <Trophy className="h-3.5 w-3.5" /> Goal achieved! 🎉
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export function GoalsPanel() {
    const { goals } = useAnalyticsData();
    const [newOpen, setNewOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Goals</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Track your personal targets
                    </p>
                </div>
                <Dialog open={newOpen} onOpenChange={setNewOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            New Goal
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Goal</DialogTitle>
                        </DialogHeader>
                        <GoalForm onDone={() => setNewOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            {goals.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                    <Trophy className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">No goals yet</p>
                    <p className="text-sm mt-1">Create your first goal to start tracking!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {goals.map((goal) => (
                        <GoalCard key={goal.id} goal={goal} />
                    ))}
                </div>
            )}
        </div>
    );
}
