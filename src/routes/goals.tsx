import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/app-layout";
import { GoalsPanel } from "@/components/goals/goals-panel";

export const Route = createFileRoute("/goals")({
    component: GoalsPage,
});

function GoalsPage() {
    return (
        <AppLayout title="Goals">
            <GoalsPanel />
        </AppLayout>
    );
}
