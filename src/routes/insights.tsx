import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/app-layout";
import { InsightsPanel } from "@/components/insights/insights-panel";

export const Route = createFileRoute("/insights")({
    component: InsightsPage,
});

function InsightsPage() {
    return (
        <AppLayout title="Insights">
            <InsightsPanel />
        </AppLayout>
    );
}
