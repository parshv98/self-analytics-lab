import { Link, useRouterState } from "@tanstack/react-router";
import {
    LayoutDashboard,
    ClipboardList,
    Target,
    Lightbulb,
    Settings,
    BarChart3,
    X,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

const navLinks = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/entries", label: "Entries", icon: ClipboardList },
    { to: "/goals", label: "Goals", icon: Target },
    { to: "/insights", label: "Insights", icon: Lightbulb },
    { to: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
    const router = useRouterState();
    const pathname = router.location.pathname;

    return (
        <>
            {/* Mobile backdrop */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar panel */}
            <aside
                className={cn(
                    "fixed top-0 left-0 z-50 h-full w-64 flex flex-col border-r border-border bg-card transition-transform duration-300 lg:static lg:translate-x-0 lg:z-auto",
                    open ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Header */}
                <div className="flex h-16 items-center justify-between px-4 border-b border-border">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                            <BarChart3 className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-foreground text-sm">
                            Self Analytics
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1 rounded hover:bg-muted"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Nav links */}
                <nav className="flex-1 overflow-y-auto py-4 px-2">
                    <div className="space-y-1">
                        {navLinks.map(({ to, label, icon: Icon }) => {
                            const isActive = pathname === to;
                            return (
                                <Link
                                    key={to}
                                    to={to}
                                    onClick={onClose}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    <Icon className="h-4 w-4 shrink-0" />
                                    {label}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Footer with theme toggle */}
                <div className="border-t border-border p-3 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                        v1.0 · Offline Ready
                    </span>
                    <ThemeToggle />
                </div>
            </aside>
        </>
    );
}
