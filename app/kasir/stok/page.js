import { redirect } from "next/navigation";
import pool from "@/lib/db";
import { getSession } from "@/lib/auth";
import { formatRupiah } from "@/lib/productVisual";
import ProductBadge from "@/components/ProductBadge";
import KasirShell from "@/components/KasirShell";

export default async function StokKasirPage() {
    const session = await getSession();
    if (!session) redirect("/login");

    const [rows] = await pool.query(
        "SELECT id, name, price, stock FROM products WHERE is_active = 1 ORDER BY name ASC"
    );

    return (
        <KasirShell session={session} title="Stok Barang">
            <div className="rounded-2xl border-2 border-sky bg-white">
                <div className="border-b-2 border-sky px-6 py-4">
                    <p className="font-display font-bold text-navy">Stok Risol Saat Ini</p>
                    <p className="text-sm text-muted">Cek stok sebelum menawarkan ke pembeli.</p>
                </div>

                {rows.map((p) => (
                    <div key={p.id} className="flex items-center gap-4 border-b border-sky/60 px-6 py-4 last:border-0">
                        <ProductBadge name={p.name} size={48} />
                        <div className="flex-1">
                            <p className="font-semibold text-navy">{p.name}</p>
                            <p className="text-sm text-muted">{formatRupiah(p.price)}</p>
                        </div>
                        <span
                            className={
                                "rounded-full px-3 py-1 text-xs font-semibold " +
                                (p.stock <= 10 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700")
                            }
                        >
                            Stok {p.stock}
                        </span>
                    </div>
                ))}
            </div>
        </KasirShell>
    );
}