"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";

export default function PetugasPage() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ name: "", username: "", password: "" });
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const loadList = async () => {
        const res = await fetch("/api/petugas");
        const data = await res.json();
        if (data.success) setList(data.petugas);
        setLoading(false);
    };

    useEffect(() => {
        loadList();
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSaving(true);

        const res = await fetch("/api/petugas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        const data = await res.json();

        if (!data.success) {
            setError(data.message);
            setSaving(false);
            return;
        }

        setForm({ name: "", username: "", password: "" });
        setSaving(false);
        loadList();
    };

    const toggleActive = async (id, current) => {
        await fetch("/api/petugas/" + id, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ is_active: !current }),
        });
        loadList();
    };

    return (
        <AdminShell title="Kelola Petugas">
            <form onSubmit={handleSubmit} className="mb-8 rounded-2xl border-2 border-sky bg-white p-6">
                <p className="mb-4 font-display font-bold text-navy">Daftarkan Kasir Baru</p>

                <div className="grid gap-4 sm:grid-cols-3">
                    <input
                        name="name" placeholder="Nama" value={form.name} onChange={handleChange} required
                        className="rounded-xl border-2 border-sky px-4 py-2.5 outline-none focus:border-royal"
                    />
                    <input
                        name="username" placeholder="Username" value={form.username} onChange={handleChange} required
                        className="rounded-xl border-2 border-sky px-4 py-2.5 outline-none focus:border-royal"
                    />
                    <input
                        name="password" type="password" placeholder="Password (min. 6)" value={form.password} onChange={handleChange} required
                        className="rounded-xl border-2 border-sky px-4 py-2.5 outline-none focus:border-royal"
                    />
                </div>

                {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

                <button
                    type="submit" disabled={saving}
                    className="mt-4 rounded-xl bg-royal px-5 py-2.5 font-display font-semibold text-white transition hover:bg-navy disabled:opacity-60"
                >
                    {saving ? "Menyimpan..." : "Tambah Kasir"}
                </button>
            </form>

            <div className="rounded-2xl border-2 border-sky bg-white">
                <p className="border-b-2 border-sky px-6 py-4 font-display font-bold text-navy">Daftar Kasir</p>

                {loading && <p className="px-6 py-6 text-muted">Memuat...</p>}
                {!loading && list.length === 0 && (
                    <p className="px-6 py-6 text-muted">Belum ada akun kasir.</p>
                )}

                {list.map((p) => (
                    <div key={p.id} className="flex items-center justify-between border-b border-sky/60 px-6 py-4 last:border-0">
                        <div>
                            <p className="font-semibold text-navy">{p.name}</p>
                            <p className="text-sm text-muted">@{p.username}</p>
                        </div>
                        <button
                            onClick={() => toggleActive(p.id, p.is_active)}
                            className={
                                "rounded-full px-4 py-1.5 text-sm font-semibold " +
                                (p.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600")
                            }
                        >
                            {p.is_active ? "Aktif" : "Nonaktif"}
                        </button>
                    </div>
                ))}
            </div>
        </AdminShell>
    );
}