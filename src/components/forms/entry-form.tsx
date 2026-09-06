import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { entrySchema, CATEGORIES, type EntryFormValues } from "@/schemas/entry-schema";
import { getCategoryIcon } from "@/lib/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { AnalyticsEntry } from "@/hooks/useAnalyticsData";

interface EntryFormProps {
    existing?: AnalyticsEntry;
    onDone?: () => void;
}

export function EntryForm({ existing, onDone }: EntryFormProps) {
    const { addEntry, updateEntry } = useAnalyticsData();
    const today = new Date().toISOString().split("T")[0];

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<EntryFormValues>({
        resolver: zodResolver(entrySchema),
        defaultValues: {
            date: existing?.date ?? today,
            category: existing?.category as EntryFormValues["category"],
            value: existing?.value,
            notes: existing?.notes ?? "",
        },
    });

    const selectedCategory = watch("category");

    const onSubmit = (data: EntryFormValues) => {
        if (existing) {
            updateEntry(existing.id, data);
            toast.success("Entry updated!");
        } else {
            addEntry(data);
            toast.success("Entry logged! 🎉");
            reset({ date: today, notes: "" });
        }
        onDone?.();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Quick category buttons */}
            <div>
                <Label className="text-sm mb-2 block">Quick category</Label>
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setValue("category", cat, { shouldValidate: true })}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${selectedCategory === cat
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-muted border-border text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {getCategoryIcon(cat)} {cat}
                        </button>
                    ))}
                </div>
                {errors.category && (
                    <p className="text-xs text-destructive mt-1">{errors.category.message}</p>
                )}
            </div>

            {/* Date */}
            <div className="space-y-1">
                <Label htmlFor="entry-date">Date</Label>
                <Input
                    id="entry-date"
                    type="date"
                    max={today}
                    {...register("date")}
                />
                {errors.date && (
                    <p className="text-xs text-destructive">{errors.date.message}</p>
                )}
            </div>

            {/* Category (select for accessibility) */}
            <div className="space-y-1">
                <Label>Category</Label>
                <Select
                    value={selectedCategory}
                    onValueChange={(v) =>
                        setValue("category", v as EntryFormValues["category"], {
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

            {/* Value */}
            <div className="space-y-1">
                <Label htmlFor="entry-value">Value (0–100)</Label>
                <Input
                    id="entry-value"
                    type="number"
                    min={0}
                    max={100}
                    step={0.5}
                    placeholder="e.g. 75"
                    {...register("value", { valueAsNumber: true })}
                />
                {errors.value && (
                    <p className="text-xs text-destructive">{errors.value.message}</p>
                )}
            </div>

            {/* Notes */}
            <div className="space-y-1">
                <Label htmlFor="entry-notes">Notes (optional)</Label>
                <Textarea
                    id="entry-notes"
                    placeholder="Optional observations..."
                    rows={3}
                    {...register("notes")}
                />
                {errors.notes && (
                    <p className="text-xs text-destructive">{errors.notes.message}</p>
                )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {existing ? "Update Entry" : "Log Entry"}
            </Button>
        </form>
    );
}
