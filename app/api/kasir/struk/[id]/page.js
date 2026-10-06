import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import pool from "@/lib/db";
import { getSession } from "@/lib/auth";
import { formatRupiah } from "@/lib/productVisual";

export default async function StrukPage({ params }) {
    const session = await getSession();
    if (!session) redirect("/login");

    const { id } = await params;

    const [txRows] = await pool.query(
        `SELECT t.*, u.name AS kasir_name, m.name AS member_name
         FROM transactions t
         JOIN users u ON u.id = t.user_id
         LEFT JOIN members m ON m.id = t.member_id
         WHERE t.id = ? LIMIT 1`,
        [id]
    );

    const transaction = txRows[0];
    if (!transaction) notFound();

    const [items] = await pool.query(
        "SELECT product_name, price, qty, subtotal FROM transaction_items WHERE transaction_id = ? ORDER BY id ASC",
        [id]
    );

    return (
        <div className="min-h-screen bg-cream px-4 py-10">
            <div className="mx-auto max-w-sm rounded-2xl border-2 border-sky bg-white p-6">
                <div className="mb-4 text-center">
                    <p className="font-display text-lg font-bold text-navy">Risol Mayo</p>
                    <p className="text-xs text-muted">{transaction.invoice_no}</p>
                </div>

                <div className="mb-4 space-y-1 border-y border-dashed border-sky py-3 text-sm">
                    <p>Kasir: {transaction.kasir_name}</p>
                    <p>Tanggal: {new Date(transaction.created_at).toLocaleString("id-ID")}</p>
                    {transaction.member_name && <p>Member: {transaction.member_name}</p>}
                </div>

                <div className="mb-4 space-y-2 text-sm">
                    {items.map((item, i) => (
                        <div key={i} className="flex justify-between gap-2">
                            <span>{item.qty}x {item.product_name}</span>
                            <span>{formatRupiah(item.subtotal)}</span>
                        </div>
                    ))}
                </div>

                <div className="space-y-1 border-t border-dashed border-sky pt-3 text-sm">
                    <div className="flex justify-between"><span>Subtotal</span><span>{formatRupiah(transaction.subtotal)}</span></div>
                    {transaction.discount > 0 && (
                        <div className="flex justify-between text-orange"><span>Diskon Member</span><span>-{formatRupiah(transaction.discount)}</span></div>
                    )}
                    <div className="flex justify-between font-display text-base font-bold text-navy"><span>Total</span><span>{formatRupiah(transaction.total)}</span></div>
                    <div className="flex justify-between"><span>Bayar ({transaction.payment_method === "tunai" ? "Tunai" : "QRIS"})</span><span>{formatRupiah(transaction.paid_amount)}</span></div>
                    <div className="flex justify-between"><span>Kembalian</span><span>{formatRupiah(transaction.change_amount)}</span></div>
                </div>

                <p className="mt-5 text-center text-xs text-muted">Terima kasih sudah berbelanja!</p>

                <Link href="/kasir" className="mt-6 block rounded-2xl bg-royal py-3 text-center font-display font-semibold text-white transition hover:bg-navy">
                    Transaksi Baru
                </Link>
            </div>
        </div>
    );
}