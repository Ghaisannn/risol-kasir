import Link from "next/link";
import pool from "@/lib/db";
import { formatRupiah } from "@/lib/productVisual";
import AdminShell from "@/components/AdminShell";

export default async function RiwayatAdminPage() {
    const [rows] = await pool.query(
        `SELECT t.id, t.invoice_no, t.total, t.payment_method, t.created_at,
                u.name AS kasir_name,
                COUNT(ti.id) AS jumlah_item
         FROM transactions t
         JOIN users u ON u.id = t.user_id
         LEFT JOIN transaction_items ti ON ti.transaction_id = t.id
         GROUP BY t.id
         ORDER BY t.created_at DESC
         LIMIT 100`
    );

    return (
        <AdminShell title="Riwayat Transaksi">
            <div className="rounded-2xl border-2 border-sky bg-white">
                <div className="border-b-2 border-sky px-6 py-4">
                    <p className="font-display font-bold text-navy">Semua Transaksi</p>
                    <p className="text-sm text-muted">100 transaksi terakhir dari seluruh kasir.</p>
                </div>

                {rows.length === 0 && <p className="px-6 py-6 text-sm text-muted">Belum ada transaksi.</p>}

                {rows.map((t) => (
                    <Link
                        key={t.id}
                        href={"/kasir/struk/" + t.id}
                        className="flex items-center justify-between gap-3 border-b border-sky/60 px-6 py-4 transition hover:bg-sky/30 last:border-0"
                    >
                        <div>
                            <p className="font-semibold text-navy">{t.invoice_no}</p>
                            <p className="text-xs text-muted">
                                {new Date(t.created_at).toLocaleString("id-ID")} · Kasir: {t.kasir_name} · {t.jumlah_item} item · {t.payment_method === "tunai" ? "Tunai" : "QRIS"}
                            </p>
                        </div>
                        <p className="font-display font-bold text-orange">{formatRupiah(t.total)}</p>
                    </Link>
                ))}
            </div>
        </AdminShell>
    );
}