"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import ProductBadge from "@/components/ProductBadge";

function ProductRow({ product, onSaved }) {
    const [form, setForm] = useState({
        price: product.price,
        stock: product.stock,
        is_active: !!product.is_active,
    });
    const [saving, setSaving] = useState(false);
    const [savedTick, setSavedTick] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    };

    const handleSave = async () => {
        setSaving(true);
        setSavedTick(false);

        await fetch("/api/produk/" + product.id, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        setSaving(false);
        setSavedTick(true);
        onSaved();
        setTimeout(() => setSavedTick(false), 1500);
    };

    return (
        <div className="flex flex-col gap-4 border-b border-sky/60 px-6 py-5 last:border-0 sm:flex-row sm:items-center">
            <ProductBadge name={product.name} size={56} />

            <div className="flex-1">
                <p className="font-semibold text-navy">{product.name}</p>
                <p className="text-sm text-muted">{product.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:w-64">
                <div>
                    <label className="mb-1 block text-xs text-muted">Harga (Rp)</label>
                    <input
                        type="number" name="price" value={form.price} onChange={handleChange}
                        className="w-full rounded-xl border-2 border-sky px-3 py-2 text-sm outline-none focus:border-royal"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-xs text-muted">Stok</label>
                    <input
                        type="number" name="stock" value={form.stock} onChange={handleChange}
                        className="w-full rounded-xl border-2 border-sky px-3 py-2 text-sm outline-none focus:border-royal"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-muted">
                    <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
                    Aktif
                </label>
                <button
                    onClick={handleSave} disabled={saving}
                    className="rounded-xl bg-royal px-4 py-2 text-sm font-display font-semibold text-white transition hover:bg-navy disabled:opacity-60"
                >
                    {saving ? "..." : savedTick ? "Tersimpan" : "Simpan"}
                </button>
            </div>
        </div>
    );
}

export default function StokPage() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadList = async () => {
        const res = await fetch("/api/produk");
        const data = await res.json();
        if (data.success) setList(data.produk);
        setLoading(false);
    };

    useEffect(() => {
        loadList();
    }, []);

    return (
        <AdminShell title="Kelola Stok & Harga">
            <div className="rounded-2xl border-2 border-sky bg-white">
                <div className="border-b-2 border-sky px-6 py-4">
                    <p className="font-display font-bold text-navy">Menu Risol</p>
                    <p className="text-sm text-muted">Ubah harga dan stok tiap varian.</p>
                </div>

                {loading && <p className="px-6 py-6 text-muted">Memuat...</p>}

                {!loading && list.map((p) => (
                    <ProductRow key={p.id} product={p} onSaved={loadList} />
                ))}
            </div>
        </AdminShell>
    );
}