import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppLayoutProps {
    children: React.ReactNode;
    title: string;
}

export function AppLayout({ children, title }: AppLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen flex bg-background">
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar (mobile) */}
                <header className="h-16 flex items-center gap-3 border-b border-border px-4 lg:hidden bg-card">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    <h1 className="font-semibold text-foreground truncate">{title}</h1>
                </header>

                {/* Main content */}
                <main className="flex-1 overflow-auto p-4 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
