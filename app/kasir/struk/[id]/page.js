import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import pool from "@/lib/db";
import { getSession } from "@/lib/auth";
import { formatRupiah } from "@/lib/productVisual";
import PrintButton from "@/components/PrintButton";
import KasirShell from "@/components/KasirShell";

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
        <KasirShell session={session} title="Struk Transaksi">
            <div className="mx-auto max-w-sm">
                <PrintButton />

                <div id="struk-cetak" className="rounded-2xl border-2 border-sky bg-white p-6 font-mono text-[13px] leading-relaxed">
                    <div className="mb-3 text-center">
                        <p className="font-display text-base font-bold text-navy">RISOL MAYO</p>
                        <p className="text-[11px] text-muted">{transaction.invoice_no}</p>
                    </div>

                    <div className="mb-3 space-y-0.5 border-y border-dashed border-ink/30 py-2 text-[11px]">
                        <p>Kasir : {transaction.kasir_name}</p>
                        <p>Tgl   : {new Date(transaction.created_at).toLocaleString("id-ID")}</p>
                        {transaction.member_name && <p>Member: {transaction.member_name}</p>}
                    </div>

                    <div className="mb-3 space-y-1.5">
                        {items.map((item, i) => (
                            <div key={i}>
                                <p>{item.product_name}</p>
                                <div className="flex justify-between text-[11px] text-muted">
                                    <span>{item.qty} x {formatRupiah(item.price)}</span>
                                    <span className="text-ink">{formatRupiah(item.subtotal)}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-1 border-t border-dashed border-ink/30 pt-2">
                        <div className="flex justify-between"><span>Subtotal</span><span>{formatRupiah(transaction.subtotal)}</span></div>
                        {transaction.discount > 0 && (
                            <div className="flex justify-between"><span>Diskon</span><span>-{formatRupiah(transaction.discount)}</span></div>
                        )}
                        <div className="flex justify-between border-t border-dashed border-ink/30 pt-1 font-bold">
                            <span>TOTAL</span><span>{formatRupiah(transaction.total)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>{transaction.payment_method === "tunai" ? "Tunai" : "QRIS"}</span>
                            <span>{formatRupiah(transaction.paid_amount)}</span>
                        </div>
                        <div className="flex justify-between"><span>Kembali</span><span>{formatRupiah(transaction.change_amount)}</span></div>
                    </div>

                    <p className="mt-4 text-center text-[11px]">Terima kasih :)</p>
                </div>

                <Link
                    href="/kasir"
                    className="no-print mt-4 block rounded-2xl bg-royal py-3 text-center font-display font-semibold text-white transition hover:bg-navy"
                >
                    Transaksi Baru
                </Link>
            </div>
        </KasirShell>
    );
}