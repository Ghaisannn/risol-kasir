import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { getSession } from "@/lib/auth";

// Lihat semua akun kasir
export async function GET() {
    const session = await getSession();
    if (!session || session.role !== "admin") {
        return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 403 });
    }

    const [rows] = await pool.query(
        "SELECT id, name, username, is_active, created_at FROM users WHERE role = 'petugas' ORDER BY created_at DESC"
    );

    return NextResponse.json({ success: true, petugas: rows });
}

// Daftarkan akun kasir baru
export async function POST(req) {
    const session = await getSession();
    if (!session || session.role !== "admin") {
        return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 403 });
    }

    try {
        const body = await req.json();
        const name = body.name?.trim();
        const username = body.username?.trim().toLowerCase();
        const password = body.password;

        if (!name || !username || !password) {
            return NextResponse.json(
                { success: false, message: "Semua kolom wajib diisi." },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { success: false, message: "Password minimal 6 karakter." },
                { status: 400 }
            );
        }

        const [existing] = await pool.query("SELECT id FROM users WHERE username = ?", [username]);
        if (existing.length > 0) {
            return NextResponse.json(
                { success: false, message: "Username sudah dipakai." },
                { status: 409 }
            );
        }

        const hash = await bcrypt.hash(password, 10);

        await pool.query(
            "INSERT INTO users (name, username, password_hash, role) VALUES (?, ?, ?, 'petugas')",
            [name, username, hash]
        );

        return NextResponse.json({ success: true, message: "Akun kasir berhasil dibuat." });
    } catch (err) {
        console.error("Buat petugas error:", err);
        return NextResponse.json({ success: false, message: "Terjadi kesalahan server." }, { status: 500 });
    }
}