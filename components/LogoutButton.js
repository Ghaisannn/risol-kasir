"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton({ className = "" }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        await fetch("/api/logout", { method: "POST" });
        router.push("/login");
        router.refresh();
    };

    return (
        <button onClick={handleLogout} disabled={loading} className={className}>
            {loading ? "Keluar..." : "Keluar"}
        </button>
    );
}