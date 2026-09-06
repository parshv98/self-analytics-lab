import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/app-layout";
import { EntriesTable } from "@/components/entries/entries-table";

export const Route = createFileRoute("/entries")({
    component: EntriesPage,
});

function EntriesPage() {
    return (
        <AppLayout title="Entries">
            <EntriesTable />
        </AppLayout>
    );
}
