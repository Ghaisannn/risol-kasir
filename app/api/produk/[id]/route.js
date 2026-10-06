import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PATCH(req, { params }) {
    const session = await getSession();
    if (!session || session.role !== "admin") {
        return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 403 });
    }

    const { id } = await params;

    try {
        const body = await req.json();
        const price = Number(body.price);
        const stock = Number(body.stock);
        const imageUrl = body.image_url?.trim() || null;

        if (!Number.isFinite(price) || price < 0) {
            return NextResponse.json({ success: false, message: "Harga tidak valid." }, { status: 400 });
        }

        if (!Number.isInteger(stock) || stock < 0) {
            return NextResponse.json({ success: false, message: "Stok tidak valid." }, { status: 400 });
        }

        await pool.query(
            "UPDATE products SET price = ?, stock = ?, image_url = ?, is_active = ? WHERE id = ?",
            [price, stock, imageUrl, body.is_active ? 1 : 0, id]
        );

        return NextResponse.json({ success: true, message: "Menu berhasil diperbarui." });
    } catch (err) {
        console.error("Update produk error:", err);
        return NextResponse.json({ success: false, message: "Terjadi kesalahan server." }, { status: 500 });
    }
}