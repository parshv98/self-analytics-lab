import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/app-layout";
import { DashboardHome } from "@/components/dashboard/dashboard-home";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <AppLayout title="Dashboard">
      <DashboardHome />
    </AppLayout>
  );
}
