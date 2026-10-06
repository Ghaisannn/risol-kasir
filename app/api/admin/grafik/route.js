import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
    const session = await getSession();
    if (!session || session.role !== "admin") {
        return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 403 });
    }

    const [rows] = await pool.query(
        `SELECT DATE(created_at) AS tanggal, COUNT(*) AS jumlah, SUM(total) AS omzet
         FROM transactions
         WHERE created_at >= CURDATE() - INTERVAL 6 DAY
         GROUP BY DATE(created_at)`
    );

    const rowMap = new Map(rows.map((r) => [r.tanggal, r]));
    const hasil = [];

    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        const found = rowMap.get(key);

        hasil.push({
            tanggal: d.toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
            omzet: found ? Number(found.omzet) : 0,
            jumlah: found ? Number(found.jumlah) : 0,
        });
    }

    return NextResponse.json({ success: true, data: hasil });
}