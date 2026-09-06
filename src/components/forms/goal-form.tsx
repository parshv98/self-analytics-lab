import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { goalSchema, CATEGORIES, type GoalFormValues } from "@/schemas/entry-schema";
import { getCategoryIcon } from "@/lib/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { AnalyticsGoal } from "@/hooks/useAnalyticsData";

interface GoalFormProps {
    existing?: AnalyticsGoal;
    onDone?: () => void;
}

export function GoalForm({ existing, onDone }: GoalFormProps) {
    const { addGoal, updateGoal } = useAnalyticsData();
    const today = new Date().toISOString().split("T")[0];

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<GoalFormValues>({
        resolver: zodResolver(goalSchema),
        defaultValues: {
            name: existing?.name ?? "",
            ...(existing?.category ? { category: existing.category as GoalFormValues["category"] } : {}),
            ...(existing?.target != null ? { target: existing.target } : {}),
            startDate: existing?.startDate ?? today,
        } as Partial<GoalFormValues>,
    });

    const selectedCategory = watch("category");

    const onSubmit = (data: GoalFormValues) => {
        if (existing) {
            updateGoal(existing.id, data);
            toast.success("Goal updated!");
        } else {
            addGoal(data);
            toast.success("Goal created! 🎯");
        }
        onDone?.();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
                <Label htmlFor="goal-name">Goal Name</Label>
                <Input id="goal-name" placeholder="e.g. Sleep 8 hours" {...register("name")} />
                {errors.name && (
                    <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <Label>Category</Label>
                <Select
                    value={selectedCategory}
                    onValueChange={(v) =>
                        setValue("category", v as GoalFormValues["category"], {
                            shouldValidate: true,
                        })
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        {CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                                {getCategoryIcon(cat)} {cat}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.category && (
                    <p className="text-xs text-destructive">{errors.category.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <Label htmlFor="goal-target">Target (# of entries)</Label>
                <Input
                    id="goal-target"
                    type="number"
                    min={1}
                    placeholder="e.g. 20"
                    {...register("target", { valueAsNumber: true })}
                />
                {errors.target && (
                    <p className="text-xs text-destructive">{errors.target.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <Label htmlFor="goal-start">Start Date</Label>
                <Input id="goal-start" type="date" {...register("startDate")} />
                {errors.startDate && (
                    <p className="text-xs text-destructive">{errors.startDate.message}</p>
                )}
            </div>

            <Button type="submit" className="w-full">
                {existing ? "Update Goal" : "Create Goal"}
            </Button>
        </form>
    );
}
