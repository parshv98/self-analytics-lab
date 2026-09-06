import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/app-layout";
import { SettingsPage } from "@/components/settings/settings-page";

export const Route = createFileRoute("/settings")({
    component: SettingsRoute,
});

function SettingsRoute() {
    return (
        <AppLayout title="Settings">
            <SettingsPage />
        </AppLayout>
    );
}
