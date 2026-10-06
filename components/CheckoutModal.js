"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatRupiah } from "@/lib/productVisual";

const DISCOUNT_RATE = 0.05;

export default function CheckoutModal({ cart, subtotal, onClose, onSuccess }) {
    const router = useRouter();

    const [phone, setPhone] = useState("");
    const [searching, setSearching] = useState(false);
    const [member, setMember] = useState(null);
    const [memberError, setMemberError] = useState("");
    const [showRegister, setShowRegister] = useState(false);
    const [newMemberName, setNewMemberName] = useState("");

    const [paymentMethod, setPaymentMethod] = useState("tunai");
    const [cashReceived, setCashReceived] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const discount = member ? Math.round(subtotal * DISCOUNT_RATE) : 0;
    const total = subtotal - discount;
    const cashNumber = Number(cashReceived) || 0;
    const change = cashNumber - total;

    const searchMember = async () => {
        if (!phone.trim()) return;
        setSearching(true);
        setMemberError("");
        setShowRegister(false);

        const res = await fetch("/api/kasir/member?phone=" + encodeURIComponent(phone.trim()));
        const data = await res.json();
        setSearching(false);

        if (data.success && data.member) {
            setMember(data.member);
        } else {
            setMember(null);
            setMemberError("Member tidak ditemukan.");
            setShowRegister(true);
        }
    };

    const registerMember = async () => {
        if (!newMemberName.trim() || !phone.trim()) return;
        setSearching(true);

        const res = await fetch("/api/kasir/member", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newMemberName.trim(), phone: phone.trim() }),
        });
        const data = await res.json();
        setSearching(false);

        if (data.success) {
            setMember(data.member);
            setShowRegister(false);
            setMemberError("");
        } else {
            setMemberError(data.message || "Gagal mendaftarkan member.");
        }
    };

    const removeMember = () => {
        setMember(null);
        setPhone("");
        setShowRegister(false);
        setMemberError("");
    };

    const handleSubmit = async () => {
        setError("");

        if (paymentMethod === "tunai" && cashNumber < total) {
            setError("Uang diterima kurang dari total belanja.");
            return;
        }

        setSubmitting(true);

        const res = await fetch("/api/kasir/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                items: cart.map((item) => ({ id: item.id, qty: item.qty })),
                member_id: member?.id || null,
                payment_method: paymentMethod,
                paid_amount: paymentMethod === "tunai" ? cashNumber : total,
            }),
        });

        const data = await res.json();
        setSubmitting(false);

        if (!data.success) {
            setError(data.message || "Checkout gagal.");
            return;
        }

        onSuccess();
        router.push("/kasir/struk/" + data.transaction_id);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
            <div className="absolute inset-0 bg-ink/50" onClick={onClose} />

            <div className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl">
                <div className="mb-5 flex items-center justify-between">
                    <p className="font-display text-lg font-bold text-navy">Pembayaran</p>
                    <button onClick={onClose} className="text-sm font-semibold text-muted">Tutup</button>
                </div>

                <div className="mb-5">
                    <p className="mb-2 text-sm font-semibold text-navy">Member (opsional)</p>

                    {!member && (
                        <div className="flex gap-2">
                            <input
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Nomor HP member"
                                className="flex-1 rounded-xl border-2 border-sky px-3 py-2.5 text-sm outline-none focus:border-royal"
                            />
                            <button
                                onClick={searchMember}
                                disabled={searching}
                                className="rounded-xl bg-sky px-4 text-sm font-semibold text-royal transition hover:bg-royal hover:text-white disabled:opacity-60"
                            >
                                {searching ? "..." : "Cari"}
                            </button>
                        </div>
                    )}

                    {memberError && <p className="mt-2 text-sm text-red-600">{memberError}</p>}

                    {showRegister && !member && (
                        <div className="mt-3 rounded-xl border-2 border-dashed border-sky p-3">
                            <p className="mb-2 text-xs text-muted">Daftarkan sebagai member baru?</p>
                            <input
                                value={newMemberName}
                                onChange={(e) => setNewMemberName(e.target.value)}
                                placeholder="Nama pembeli"
                                className="mb-2 w-full rounded-xl border-2 border-sky px-3 py-2 text-sm outline-none focus:border-royal"
                            />
                            <button
                                onClick={registerMember}
                                disabled={searching}
                                className="w-full rounded-xl bg-royal py-2 text-sm font-display font-semibold text-white transition hover:bg-navy disabled:opacity-60"
                            >
                                Daftarkan & Pakai
                            </button>
                        </div>
                    )}

                    {member && (
                        <div className="flex items-center justify-between rounded-xl bg-sky/60 px-4 py-3">
                            <div>
                                <p className="text-sm font-semibold text-navy">{member.name}</p>
                                <p className="text-xs text-muted">{member.phone} · diskon 5%</p>
                            </div>
                            <button onClick={removeMember} className="text-xs font-semibold text-red-500">Hapus</button>
                        </div>
                    )}
                </div>

                <div className="mb-5 space-y-1 rounded-xl bg-cream px-4 py-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted">Subtotal</span>
                        <span>{formatRupiah(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between text-orange">
                            <span>Diskon Member</span>
                            <span>-{formatRupiah(discount)}</span>
                        </div>
                    )}
                    <div className="flex justify-between border-t border-sky pt-1 font-display text-base font-bold text-navy">
                        <span>Total</span>
                        <span>{formatRupiah(total)}</span>
                    </div>
                </div>

                <p className="mb-2 text-sm font-semibold text-navy">Metode Pembayaran</p>
                <div className="mb-4 grid grid-cols-2 gap-3">
                    <button
                        onClick={() => setPaymentMethod("tunai")}
                        className={"rounded-xl border-2 py-2.5 text-sm font-display font-semibold transition " + (paymentMethod === "tunai" ? "border-royal bg-royal text-white" : "border-sky text-navy")}
                    >
                        Tunai
                    </button>
                    <button
                        onClick={() => setPaymentMethod("qris")}
                        className={"rounded-xl border-2 py-2.5 text-sm font-display font-semibold transition " + (paymentMethod === "qris" ? "border-royal bg-royal text-white" : "border-sky text-navy")}
                    >
                        QRIS
                    </button>
                </div>

                {paymentMethod === "tunai" && (
                    <div className="mb-4">
                        <label className="mb-1 block text-sm font-semibold text-navy">Uang Diterima</label>
                        <input
                            type="number"
                            value={cashReceived}
                            onChange={(e) => setCashReceived(e.target.value)}
                            placeholder="0"
                            className="w-full rounded-xl border-2 border-sky px-4 py-3 text-lg font-semibold outline-none focus:border-royal"
                        />
                        {cashNumber > 0 && (
                            <p className={"mt-2 text-sm font-semibold " + (change >= 0 ? "text-orange" : "text-red-600")}>
                                {change >= 0 ? "Kembalian: " + formatRupiah(change) : "Kurang: " + formatRupiah(-change)}
                            </p>
                        )}
                    </div>
                )}

                {paymentMethod === "qris" && (
                    <div className="mb-4 rounded-xl border-2 border-dashed border-sky p-4 text-center text-sm text-muted">
                        Pastikan pembeli sudah menyelesaikan pembayaran QRIS sebelum konfirmasi.
                    </div>
                )}

                {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

                <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full rounded-2xl bg-royal py-3.5 font-display text-lg font-semibold text-white transition hover:bg-navy disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {submitting ? "Memproses..." : "Konfirmasi Pembayaran"}
                </button>
            </div>
        </div>
    );
}