import Link from "next/link";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import { getSession } from "@/lib/auth";
import { formatRupiah } from "@/lib/productVisual";
import KasirShell from "@/components/KasirShell";

export default async function KasirDashboard() {
    const session = await getSession();
    if (!session) redirect("/login");

    const [[{ transaksiHariIni }]] = await pool.query(
        "SELECT COUNT(*) AS transaksiHariIni FROM transactions WHERE user_id = ? AND DATE(created_at) = CURDATE()",
        [session.id]
    );
    const [[{ omzetHariIni }]] = await pool.query(
        "SELECT COALESCE(SUM(total), 0) AS omzetHariIni FROM transactions WHERE user_id = ? AND DATE(created_at) = CURDATE()",
        [session.id]
    );
    const [[{ totalTransaksi }]] = await pool.query(
        "SELECT COUNT(*) AS totalTransaksi FROM transactions WHERE user_id = ?",
        [session.id]
    );
    const [recent] = await pool.query(
        "SELECT id, invoice_no, total, created_at FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 5",
        [session.id]
    );

    const stats = [
        { label: "Transaksi Hari Ini", value: transaksiHariIni },
        { label: "Omzet Hari Ini", value: formatRupiah(omzetHariIni) },
        { label: "Total Transaksi Saya", value: totalTransaksi },
    ];

    return (
        <KasirShell session={session} title="Dashboard">
            <div className="grid gap-4 sm:grid-cols-3">
                {stats.map((s) => (
                    <div key={s.label} className="rounded-2xl border-2 border-sky bg-white p-5">
                        <p className="text-sm text-muted">{s.label}</p>
                        <p className="font-display text-2xl font-bold text-royal">{s.value}</p>
                    </div>
                ))}
            </div>

            <div className="mt-6 rounded-2xl border-2 border-sky bg-white">
                <div className="flex items-center justify-between border-b-2 border-sky px-6 py-4">
                    <p className="font-display font-bold text-navy">Transaksi Terbaru</p>
                    <Link href="/kasir/riwayat" className="text-sm font-semibold text-royal hover:underline">
                        Lihat semua →
                    </Link>
                </div>

                {recent.length === 0 && <p className="px-6 py-6 text-sm text-muted">Belum ada transaksi.</p>}

                {recent.map((t) => (
                    <Link
                        key={t.id}
                        href={"/kasir/struk/" + t.id}
                        className="flex items-center justify-between border-b border-sky/60 px-6 py-4 transition hover:bg-sky/30 last:border-0"
                    >
                        <div>
                            <p className="font-semibold text-navy">{t.invoice_no}</p>
                            <p className="text-xs text-muted">{new Date(t.created_at).toLocaleString("id-ID")}</p>
                        </div>
                        <p className="font-display font-bold text-orange">{formatRupiah(t.total)}</p>
                    </Link>
                ))}
            </div>
        </KasirShell>
    );
}