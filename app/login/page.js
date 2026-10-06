"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ username: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!data.success) {
                setError(data.message);
                setLoading(false);
                return;
            }

            router.push(data.redirect);
            router.refresh();
        } catch (err) {
            console.error(err);
            setError("Terjadi kesalahan, coba lagi.");
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen lg:grid lg:grid-cols-2">
            {/* ===== Sisi kiri: brand ===== */}
            <section className="relative overflow-hidden bg-royal px-6 pt-8 pb-32 text-white lg:flex lg:flex-col lg:justify-between lg:px-14 lg:pt-12 lg:pb-44">
                <span className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/5" />
                <span className="pointer-events-none absolute top-1/2 -left-20 h-56 w-56 rounded-full bg-white/5" />

                <div className="relative inline-flex items-center gap-2 self-start rounded-full bg-white/15 px-4 py-2 font-display text-sm font-semibold tracking-wide">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber" />
                    RISOL MAYO
                </div>

                <div className="relative mt-10 lg:mt-0">
                    <h2 className="font-display text-4xl font-bold leading-tight xl:text-5xl">
                        Yuk, mulai <span className="text-amber">jualan</span> hari ini.
                    </h2>
                    <p className="mt-4 max-w-md text-white/80">
                        Catat pesanan, cek stok, dan cetak struk dalam satu aplikasi.
                    </p>
                </div>

                <div className="relative mt-10 hidden max-w-md lg:block">
                    <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-[2rem] bg-orange" />
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] border-4 border-white/90">
                        <Image
                            src="/risol-poster.jpg"
                            alt="Risol Mayo"
                            fill
                            priority
                            sizes="448px"
                            className="object-cover"
                        />
                    </div>
                </div>

                <svg
                    className="absolute bottom-0 left-0 h-24 w-full lg:h-32"
                    viewBox="0 0 1440 160"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    <path className="fill-amber" d="M0,80 C240,150 480,10 720,70 C960,130 1200,150 1440,60 L1440,160 L0,160 Z" />
                    <path className="fill-orange" d="M0,110 C260,160 500,60 760,110 C1000,155 1220,140 1440,100 L1440,160 L0,160 Z" />
                </svg>
            </section>

            {/* ===== Sisi kanan: form ===== */}
            <section className="flex items-center justify-center px-6 py-12 lg:px-16">
                <div className="w-full max-w-sm">
                    <p className="mb-2 font-display text-sm font-semibold text-orange">Login</p>
                    <h1 className="mb-2 font-display text-4xl font-bold text-navy">Masuk</h1>
                    <p className="mb-8 text-muted">Gunakan akun yang diberikan admin.</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="username" className="mb-2 block text-sm font-semibold text-navy">
                                Username
                            </label>
                            <div className="relative">
                                <svg
                                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                >
                                    <circle cx="12" cy="8" r="4" />
                                    <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                                </svg>
                                <input
                                    id="username" name="username" type="text" autoComplete="username" autoFocus required
                                    value={form.username} onChange={handleChange}
                                    placeholder="Masukkan username"
                                    className="w-full rounded-2xl border-2 border-sky bg-white py-3.5 pl-12 pr-4 font-medium outline-none transition focus:border-royal"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-navy">
                                Password
                            </label>
                            <div className="relative">
                                <svg
                                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                >
                                    <rect x="5" y="11" width="14" height="9" rx="2" />
                                    <path d="M8 11V8a4 4 0 118 0v3" />
                                </svg>
                                <input
                                    id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required
                                    value={form.password} onChange={handleChange}
                                    placeholder="Masukkan password"
                                    className="w-full rounded-2xl border-2 border-sky bg-white py-3.5 pl-12 pr-12 font-medium outline-none transition focus:border-royal"
                                />
                                <button
                                    type="button" onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted transition hover:text-royal"
                                >
                                    {showPassword ? (
                                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 3l18 18" />
                                            <path d="M10.6 5.1A9.7 9.7 0 0112 5c6.5 0 10 7 10 7a17 17 0 01-3.2 4.2M6.6 6.6C3.9 8.3 2 12 2 12s3.5 7 10 7c1.5 0 2.9-.4 4.1-.9" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit" disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-royal py-3.5 font-display text-lg font-semibold text-white shadow-lg shadow-royal/25 transition hover:bg-navy disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                "Memproses..."
                            ) : (
                                <>
                                    Masuk
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14M13 6l6 6-6 6" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-muted">
                        Lupa password? Hubungi admin.
                    </p>
                </div>
            </section>
        </main>
    );
}