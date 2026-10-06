import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ success: false, message: "Silakan login." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone")?.trim();

    if (!phone) {
        return NextResponse.json({ success: false, message: "Nomor HP wajib diisi." }, { status: 400 });
    }

    const [rows] = await pool.query("SELECT id, name, phone FROM members WHERE phone = ? LIMIT 1", [phone]);

    return NextResponse.json({ success: true, member: rows[0] || null });
}

export async function POST(req) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ success: false, message: "Silakan login." }, { status: 401 });
    }

    try {
        const body = await req.json();
        const name = body.name?.trim();
        const phone = body.phone?.trim();

        if (!name || !phone) {
            return NextResponse.json({ success: false, message: "Nama dan nomor HP wajib diisi." }, { status: 400 });
        }

        const [existing] = await pool.query("SELECT id, name, phone FROM members WHERE phone = ? LIMIT 1", [phone]);
        if (existing.length > 0) {
            return NextResponse.json({ success: true, member: existing[0], message: "Member sudah terdaftar." });
        }

        const [result] = await pool.query("INSERT INTO members (name, phone) VALUES (?, ?)", [name, phone]);

        return NextResponse.json({
            success: true,
            member: { id: result.insertId, name, phone },
            message: "Member baru berhasil didaftarkan.",
        });
    } catch (err) {
        console.error("Daftar member error:", err);
        return NextResponse.json({ success: false, message: "Terjadi kesalahan server." }, { status: 500 });
    }
}