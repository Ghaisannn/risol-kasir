import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ success: false, message: "Silakan login." }, { status: 401 });
    }

    const [rows] = await pool.query(
        "SELECT id, name, price, stock, image_url FROM products WHERE is_active = 1 ORDER BY name ASC"
    );

    return NextResponse.json({ success: true, produk: rows });
}