import Link from "next/link";
import SalesChart from "@/components/SalesChart";
import AdminShell from "@/components/AdminShell";
import ProductBadge from "@/components/ProductBadge";
import pool from "@/lib/db";

export default async function AdminDashboard() {
    const [[{ kasirAktif }]] = await pool.query(
        "SELECT COUNT(*) AS kasirAktif FROM users WHERE role = 'petugas' AND is_active = 1"
    );
    const [[{ totalMenu }]] = await pool.query("SELECT COUNT(*) AS totalMenu FROM products WHERE is_active = 1");
    const [[{ transaksiHariIni }]] = await pool.query(
        "SELECT COUNT(*) AS transaksiHariIni FROM transactions WHERE DATE(created_at) = CURDATE()"
    );
    const [[{ omzetHariIni }]] = await pool.query(
        "SELECT COALESCE(SUM(total), 0) AS omzetHariIni FROM transactions WHERE DATE(created_at) = CURDATE()"
    );
    const [stokMenipis] = await pool.query(
        "SELECT id, name, stock FROM products WHERE is_active = 1 AND stock <= 10 ORDER BY stock ASC"
    );

    const stats = [
        { label: "Kasir Aktif", value: kasirAktif, color: "text-royal" },
        { label: "Menu Risol", value: totalMenu, color: "text-orange" },
        { label: "Transaksi Hari Ini", value: transaksiHariIni, color: "text-royal" },
        { label: "Omzet Hari Ini", value: "Rp " + Number(omzetHariIni).toLocaleString("id-ID"), color: "text-orange" },
    ];

    return (
        <AdminShell title="Dashboard">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((s) => (
                    <div key={s.label} className="rounded-2xl border-2 border-sky bg-white p-5">
                        <p className="text-sm text-muted">{s.label}</p>
                        <p className={"font-display text-2xl font-bold " + s.color}>{s.value}</p>
                    </div>
                ))}
            </div>

            <SalesChart />

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
                <div className="rounded-2xl border-2 border-sky bg-white p-6 lg:col-span-2">
                    <div className="mb-4 flex items-center justify-between">
                        <p className="font-display font-bold text-navy">Stok Menipis</p>
                        <Link href="/admin/stok" className="text-sm font-semibold text-royal hover:underline">
                            Kelola stok →
                        </Link>
                    </div>

                    {stokMenipis.length === 0 && (
                        <p className="text-sm text-muted">Semua stok masih aman (di atas 10 pcs).</p>
                    )}

                    <div className="space-y-3">
                        {stokMenipis.map((p) => (
                            <div key={p.id} className="flex items-center gap-3">
                                <ProductBadge name={p.name} size={40} />
                                <p className="flex-1 text-sm font-semibold text-navy">{p.name}</p>
                                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                                    Sisa {p.stock}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border-2 border-sky bg-white p-6">
                    <p className="mb-4 font-display font-bold text-navy">Aksi Cepat</p>
                    <div className="space-y-2">
                        <Link
                            href="/admin/petugas"
                            className="block rounded-xl bg-sky px-4 py-3 text-sm font-semibold text-royal transition hover:bg-royal hover:text-white"
                        >
                            + Daftarkan Kasir Baru
                        </Link>
                        <Link
                            href="/admin/stok"
                            className="block rounded-xl bg-sky px-4 py-3 text-sm font-semibold text-royal transition hover:bg-royal hover:text-white"
                        >
                            Update Stok & Harga
                        </Link>
                    </div>
                </div>
            </div>
        </AdminShell>
    );
}