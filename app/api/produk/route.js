import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
    const session = await getSession();
    if (!session || session.role !== "admin") {
        return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 403 });
    }

    const [rows] = await pool.query(
        "SELECT id, name, description, price, stock, image_url, is_active FROM products ORDER BY id ASC"
    );

    return NextResponse.json({ success: true, produk: rows });
}