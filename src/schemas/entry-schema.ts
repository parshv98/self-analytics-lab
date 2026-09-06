import { z } from "zod";

export const CATEGORIES = [
  "Health",
  "Productivity",
  "Mood",
  "Sleep",
  "Exercise",
  "Finance",
  "Learning",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const entrySchema = z.object({
  date: z.string().min(1, "Date is required"),
  category: z.enum(CATEGORIES, { required_error: "Category is required" }),
  value: z
    .number({ invalid_type_error: "Value must be a number" })
    .min(0, "Value must be at least 0")
    .max(100, "Value must be at most 100"),
  notes: z.string().max(500, "Notes too long (max 500 chars)").optional(),
});

export const goalSchema = z.object({
  name: z
    .string()
    .min(1, "Goal name is required")
    .max(100, "Name too long (max 100 chars)"),
  category: z.enum(CATEGORIES, { required_error: "Category is required" }),
  target: z
    .number({ invalid_type_error: "Target must be a number" })
    .min(1, "Target must be at least 1")
    .max(10000, "Target is too large"),
  startDate: z.string().min(1, "Start date is required"),
});

export type EntryFormValues = z.infer<typeof entrySchema>;
export type GoalFormValues = z.infer<typeof goalSchema>;
