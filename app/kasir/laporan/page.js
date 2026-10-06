import { redirect } from "next/navigation";
import pool from "@/lib/db";
import { getSession } from "@/lib/auth";
import { formatRupiah } from "@/lib/productVisual";
import KasirShell from "@/components/KasirShell";

function todayStr() {
    return new Date().toISOString().slice(0, 10);
}

export default async function LaporanPage({ searchParams }) {
    const session = await getSession();
    if (!session) redirect("/login");

    const sp = await searchParams;
    const from = sp?.from || todayStr();
    const to = sp?.to || todayStr();

    const [rows] = await pool.query(
        `SELECT id, invoice_no, total, discount, payment_method, created_at
         FROM transactions
         WHERE user_id = ? AND DATE(created_at) BETWEEN ? AND ?
         ORDER BY created_at DESC`,
        [session.id, from, to]
    );

    const totalOmzet = rows.reduce((sum, r) => sum + r.total, 0);
    const totalTransaksi = rows.length;

    return (
        <KasirShell session={session} title="Laporan">
            <form method="GET" className="mb-6 flex flex-wrap items-end gap-3 rounded-2xl border-2 border-sky bg-white p-5">
                <div>
                    <label className="mb-1 block text-xs font-semibold text-muted">Dari Tanggal</label>
                    <input
                        type="date" name="from" defaultValue={from}
                        className="rounded-xl border-2 border-sky px-3 py-2 text-sm outline-none focus:border-royal"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-xs font-semibold text-muted">Sampai Tanggal</label>
                    <input
                        type="date" name="to" defaultValue={to}
                        className="rounded-xl border-2 border-sky px-3 py-2 text-sm outline-none focus:border-royal"
                    />
                </div>
                <button type="submit" className="rounded-xl bg-royal px-5 py-2.5 text-sm font-display font-semibold text-white transition hover:bg-navy">
                    Tampilkan
                </button>
            </form>

            <div className="mb-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border-2 border-sky bg-white p-5">
                    <p className="text-sm text-muted">Jumlah Transaksi</p>
                    <p className="font-display text-2xl font-bold text-royal">{totalTransaksi}</p>
                </div>
                <div className="rounded-2xl border-2 border-sky bg-white p-5">
                    <p className="text-sm text-muted">Total Omzet</p>
                    <p className="font-display text-2xl font-bold text-orange">{formatRupiah(totalOmzet)}</p>
                </div>
            </div>

            <div className="rounded-2xl border-2 border-sky bg-white">
                <div className="border-b-2 border-sky px-6 py-4">
                    <p className="font-display font-bold text-navy">Detail Transaksi</p>
                    <p className="text-sm text-muted">{from} s/d {to}</p>
                </div>

                {rows.length === 0 && <p className="px-6 py-6 text-sm text-muted">Tidak ada transaksi di rentang ini.</p>}

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b-2 border-sky text-xs uppercase text-muted">
                                <th className="px-6 py-3 font-semibold">Nota</th>
                                <th className="px-6 py-3 font-semibold">Tanggal</th>
                                <th className="px-6 py-3 font-semibold">Metode</th>
                                <th className="px-6 py-3 text-right font-semibold">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((t) => (
                                <tr key={t.id} className="border-b border-sky/60 last:border-0">
                                    <td className="px-6 py-3 font-semibold text-navy">{t.invoice_no}</td>
                                    <td className="px-6 py-3 text-muted">{new Date(t.created_at).toLocaleString("id-ID")}</td>
                                    <td className="px-6 py-3 text-muted">{t.payment_method === "tunai" ? "Tunai" : "QRIS"}</td>
                                    <td className="px-6 py-3 text-right font-semibold text-orange">{formatRupiah(t.total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </KasirShell>
    );
}