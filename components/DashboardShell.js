"use client";

import { useState } from "react";
import SidebarPanel from "@/components/SidebarPanel";

export default function DashboardShell({ title, menu, panelLabel, extra, children }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="min-h-screen bg-cream lg:flex">
            <aside className="hidden w-64 shrink-0 flex-col bg-navy lg:flex">
                <SidebarPanel menu={menu} panelLabel={panelLabel} extra={extra} />
            </aside>

            {open && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
                    <aside className="relative flex h-full w-72 flex-col bg-navy">
                        <SidebarPanel menu={menu} panelLabel={panelLabel} extra={extra} onNavigate={() => setOpen(false)} />
                    </aside>
                </div>
            )}

            <div className="flex-1">
                <header className="sticky top-0 z-20 flex items-center gap-3 border-b-2 border-sky bg-white/95 px-4 py-4 backdrop-blur lg:px-8">
                    <button
                        onClick={() => setOpen(true)}
                        className="rounded-lg p-2 text-navy lg:hidden"
                        aria-label="Buka menu"
                    >
                        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M4 7h16M4 12h16M4 17h16" />
                        </svg>
                    </button>
                    <div>
                        <p className="font-display text-xs font-semibold text-orange">Risol Mayo</p>
                        <h1 className="font-display text-xl font-bold text-navy">{title}</h1>
                    </div>
                </header>
                <main className="px-4 py-6 lg:px-8">{children}</main>
            </div>
        </div>
    );
}