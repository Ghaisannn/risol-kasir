"use client";

import { useEffect, useState } from "react";
import { formatRupiah } from "@/lib/productVisual";

export default function KasirRingkasan() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch("/api/kasir/ringkasan")
            .then((res) => res.json())
            .then((d) => {
                if (d.success) setData(d);
            });
    }, []);

    return (
        <div className="mx-4 mb-4">
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-cream/40">Hari Ini</p>
            <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-white/5 px-3 py-2.5">
                    <p className="text-[11px] text-cream/50">Transaksi</p>
                    <p className="font-display text-lg font-bold text-amber">{data ? data.transaksi : "-"}</p>
                </div>
                <div className="rounded-xl bg-white/5 px-3 py-2.5">
                    <p className="text-[11px] text-cream/50">Omzet</p>
                    <p className="font-display text-sm font-bold text-amber">{data ? formatRupiah(data.omzet) : "-"}</p>
                </div>
            </div>
        </div>
    );
}