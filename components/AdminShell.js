"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LogoutButton from "@/components/LogoutButton";
import BrandMark from "@/components/BrandMark";

const menu = [
    { href: "/admin", label: "Dashboard", icon: "dashboard" },
    { href: "/admin/petugas", label: "Petugas", icon: "users" },
    { href: "/admin/stok", label: "Stok & Harga", icon: "box" },
    { href: "/admin/riwayat", label: "Riwayat Transaksi", icon: "clock" },
    { href: "/admin/laporan", label: "Laporan", icon: "report" },
];

function NavIcon({ name }) {
    const common = {
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: "h-5 w-5",
    };

    if (name === "dashboard") {
        return (
            <svg {...common}>
                <rect x="3" y="3" width="7" height="9" rx="2" />
                <rect x="14" y="3" width="7" height="5" rx="2" />
                <rect x="14" y="12" width="7" height="9" rx="2" />
                <rect x="3" y="16" width="7" height="5" rx="2" />
            </svg>
        );
    }
    if (name === "users") {
        return (
            <svg {...common}>
                <circle cx="9" cy="8" r="3" />
                <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
                <circle cx="17" cy="8" r="2.3" />
                <path d="M15 14.2c2.3.4 4 2.4 4 5.8" />
            </svg>
        );
    }
    if (name === "clock") {
        return (
            <svg {...common}>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3.5 2" />
            </svg>
        );
    }
    if (name === "report") {
        return (
            <svg {...common}>
                <rect x="5" y="3" width="14" height="18" rx="2" />
                <path d="M9 8h6M9 12h6M9 16h4" />
            </svg>
        );
    }
    return (
        <svg {...common}>
            <path d="M21 8l-9-5-9 5 9 5 9-5z" />
            <path d="M3 8v8l9 5 9-5V8" />
            <path d="M12 13v8" />
        </svg>
    );
}

function SidebarContent({ pathname, onNavigate }) {
    return (
        <>
            <div className="flex items-center gap-3 px-6 py-6">
                <BrandMark size={44} tone="amber" />
                <div>
                    <p className="font-display text-sm font-bold text-cream">Risol Mayo</p>
                    <p className="text-xs text-cream/60">Admin Panel</p>
                </div>
            </div>

            <nav className="flex-1 space-y-1 px-4">
                <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-cream/40">Menu</p>
                {menu.map((item) => {
                    const active = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onNavigate}
                            className={
                                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition " +
                                (active ? "bg-amber text-navy" : "text-cream/70 hover:bg-white/10 hover:text-cream")
                            }
                        >
                            <NavIcon name={item.icon} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-white/10 px-4 py-4">
                <LogoutButton className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-white/15 px-4 py-2.5 text-sm font-display font-semibold text-cream/80 transition hover:bg-white/10" />
            </div>
        </>
    );
}

export default function AdminShell({ title, children }) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <div className="min-h-screen bg-cream lg:flex">
            <aside className="hidden w-64 shrink-0 flex-col bg-navy lg:flex">
                <SidebarContent pathname={pathname} onNavigate={() => {}} />
            </aside>

            {open && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
                    <aside className="relative flex h-full w-72 flex-col bg-navy">
                        <SidebarContent pathname={pathname} onNavigate={() => setOpen(false)} />
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
                        <p className="font-display text-xs font-semibold text-orange">Admin</p>
                        <h1 className="font-display text-xl font-bold text-navy">{title}</h1>
                    </div>
                </header>
                <main className="px-4 py-6 lg:px-8">{children}</main>
            </div>
        </div>
    );
}