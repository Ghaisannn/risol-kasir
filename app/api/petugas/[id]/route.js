import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSession } from "@/lib/auth";

// Aktifkan / nonaktifkan akun kasir
export async function PATCH(req, { params }) {
    const session = await getSession();
    if (!session || session.role !== "admin") {
        return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    await pool.query("UPDATE users SET is_active = ? WHERE id = ? AND role = 'petugas'", [
        body.is_active ? 1 : 0,
        id,
    ]);

    return NextResponse.json({ success: true });
}