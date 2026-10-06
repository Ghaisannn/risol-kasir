"use client";

import { useEffect, useState } from "react";
import KasirShell from "@/components/KasirShell";
import ProductBadge from "@/components/ProductBadge";
import CheckoutModal from "@/components/CheckoutModal";
import { formatRupiah } from "@/lib/productVisual";

export default function KasirApp({ session }) {
    const [produk, setProduk] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [cart, setCart] = useState([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [checkoutOpen, setCheckoutOpen] = useState(false);

    useEffect(() => {
        fetch("/api/kasir/produk")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setProduk(data.produk);
                } else {
                    setLoadError(data.message || "Gagal memuat menu.");
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoadError("Gagal terhubung ke server.");
                setLoading(false);
            });
    }, []);

    const qtyInCart = (id) => cart.find((item) => item.id === id)?.qty || 0;

    const addToCart = (p) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === p.id);
            if (existing) {
                if (existing.qty >= p.stock) return prev;
                return prev.map((item) => (item.id === p.id ? { ...item, qty: item.qty + 1 } : item));
            }
            if (p.stock < 1) return prev;
            return [...prev, { id: p.id, name: p.name, price: p.price, stock: p.stock, qty: 1 }];
        });
    };

    const decreaseQty = (id) => {
        setCart((prev) =>
            prev.map((item) => (item.id === id ? { ...item, qty: item.qty - 1 } : item)).filter((item) => item.qty > 0)
        );
    };

    const removeFromCart = (id) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const totalItem = cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    const openCheckout = () => {
        setCartOpen(false);
        setCheckoutOpen(true);
    };

    const handleCheckoutSuccess = () => {
        setCart([]);
        setCheckoutOpen(false);
    };

    return (
        <KasirShell session={session} title="Kasir (POS)">
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                <div>
                    <p className="mb-4 font-display text-lg font-bold text-navy">Pilih Menu</p>

                    {loading && <p className="text-muted">Memuat menu...</p>}
                    {!loading && loadError && <p className="text-red-600">{loadError}</p>}

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {produk.map((p) => {
                            const inCart = qtyInCart(p.id);
                            const habis = p.stock < 1;

                            return (
                                <button
                                    key={p.id}
                                    onClick={() => addToCart(p)}
                                    disabled={habis || inCart >= p.stock}
                                    className="flex flex-col items-center gap-2 rounded-2xl border-2 border-sky bg-white p-3 text-center transition hover:border-royal disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <ProductBadge name={p.name} size={72} />
                                    <p className="text-sm font-semibold leading-snug text-navy">{p.name}</p>
                                    <p className="font-display text-sm font-bold text-orange">{formatRupiah(p.price)}</p>
                                    <p className="text-xs text-muted">{habis ? "Stok habis" : "Stok " + p.stock}</p>
                                    {inCart > 0 && (
                                        <span className="rounded-full bg-royal px-2.5 py-0.5 text-xs font-semibold text-white">
                                            {inCart} di keranjang
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <aside className="hidden rounded-2xl border-2 border-sky bg-white p-5 lg:block lg:h-fit lg:sticky lg:top-20">
                    <CartContent
                        cart={cart}
                        subtotal={subtotal}
                        onIncrease={(id) => addToCart({ id, ...cart.find((c) => c.id === id) })}
                        onDecrease={decreaseQty}
                        onRemove={removeFromCart}
                        onCheckout={openCheckout}
                    />
                </aside>
            </div>

            {totalItem > 0 && (
                <button
                    onClick={() => setCartOpen(true)}
                    className="fixed inset-x-4 bottom-4 z-30 flex items-center justify-between rounded-2xl bg-royal px-5 py-4 text-white shadow-xl shadow-royal/30 lg:hidden"
                >
                    <span className="font-display font-semibold">{totalItem} item</span>
                    <span className="font-display font-bold">{formatRupiah(subtotal)}</span>
                    <span className="font-display text-sm">Lihat →</span>
                </button>
            )}

            {cartOpen && (
                <div className="fixed inset-0 z-40 flex items-end lg:hidden">
                    <div className="absolute inset-0 bg-ink/40" onClick={() => setCartOpen(false)} />
                    <div className="relative w-full rounded-t-3xl bg-white p-5 shadow-2xl">
                        <div className="mb-3 flex items-center justify-between">
                            <p className="font-display font-bold text-navy">Keranjang</p>
                            <button onClick={() => setCartOpen(false)} className="text-sm font-semibold text-muted">Tutup</button>
                        </div>
                        <CartContent
                            cart={cart}
                            subtotal={subtotal}
                            onIncrease={(id) => addToCart({ id, ...cart.find((c) => c.id === id) })}
                            onDecrease={decreaseQty}
                            onRemove={removeFromCart}
                            onCheckout={openCheckout}
                        />
                    </div>
                </div>
            )}

            {checkoutOpen && (
                <CheckoutModal
                    cart={cart}
                    subtotal={subtotal}
                    onClose={() => setCheckoutOpen(false)}
                    onSuccess={handleCheckoutSuccess}
                />
            )}
        </KasirShell>
    );
}

function CartContent({ cart, subtotal, onIncrease, onDecrease, onRemove, onCheckout }) {
    return (
        <>
            <p className="mb-4 font-display font-bold text-navy">Keranjang</p>

            {cart.length === 0 && <p className="text-sm text-muted">Belum ada barang dipilih.</p>}

            <div className="max-h-[50vh] space-y-3 overflow-y-auto lg:max-h-[55vh]">
                {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-navy">{item.name}</p>
                            <p className="text-xs text-muted">{formatRupiah(item.price)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => onDecrease(item.id)} className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-sky text-navy">−</button>
                            <span className="w-5 text-center text-sm font-semibold">{item.qty}</span>
                            <button onClick={() => onIncrease(item.id)} disabled={item.qty >= item.stock} className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-sky text-navy disabled:opacity-40">+</button>
                        </div>
                        <button onClick={() => onRemove(item.id)} className="text-muted hover:text-red-500" aria-label="Hapus">
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t-2 border-sky pt-4">
                <p className="font-display font-semibold text-navy">Subtotal</p>
                <p className="font-display text-lg font-bold text-orange">{formatRupiah(subtotal)}</p>
            </div>

            <button
                onClick={onCheckout}
                disabled={cart.length === 0}
                className="mt-4 w-full rounded-2xl bg-royal py-3 font-display font-semibold text-white transition hover:bg-navy disabled:cursor-not-allowed disabled:opacity-50"
            >
                Lanjut ke Pembayaran
            </button>
        </>
    );
}