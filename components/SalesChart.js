"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatRupiah } from "@/lib/productVisual";

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload || payload.length === 0) return null;

    return (
        <div className="rounded-xl border-2 border-sky bg-white px-4 py-2.5 shadow-lg">
            <p className="mb-1 text-xs font-semibold text-navy">{label}</p>
            <p className="text-sm font-bold text-orange">{formatRupiah(payload[0].value)}</p>
            <p className="text-xs text-muted">{payload[0].payload.jumlah} transaksi</p>
        </div>
    );
}

export default function SalesChart() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/grafik")
            .then((res) => res.json())
            .then((d) => {
                if (d.success) setData(d.data);
                setLoading(false);
            });
    }, []);

    const totalOmzet = data.reduce((sum, d) => sum + d.omzet, 0);

    return (
        <div className="rounded-2xl border-2 border-sky bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <p className="font-display font-bold text-navy">Tren Penjualan</p>
                    <p className="text-sm text-muted">7 hari terakhir</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-muted">Total Omzet</p>
                    <p className="font-display text-lg font-bold text-orange">{formatRupiah(totalOmzet)}</p>
                </div>
            </div>

            {loading && <p className="py-10 text-center text-sm text-muted">Memuat grafik...</p>}

            {!loading && (
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e8efff" />
                            <XAxis dataKey="tanggal" tick={{ fontSize: 12, fill: "#6b7699" }} axisLine={{ stroke: "#e8efff" }} tickLine={false} />
                            <YAxis
                                tick={{ fontSize: 11, fill: "#6b7699" }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(v) => (v >= 1000 ? v / 1000 + "k" : v)}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="omzet"
                                stroke="#f58a1f"
                                strokeWidth={3}
                                dot={{ fill: "#1f4fd1", r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}