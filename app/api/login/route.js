import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { signSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";

export async function POST(req) {
    try {
        const body = await req.json();
        const username = body.username?.trim();
        const password = body.password;

        if (!username || !password) {
            return NextResponse.json(
                { success: false, message: "Username dan password wajib diisi." },
                { status: 400 }
            );
        }

        const [rows] = await pool.query(
            "SELECT id, name, username, password_hash, role FROM users WHERE username = ? AND is_active = 1 LIMIT 1",
            [username]
        );

        const user = rows[0];
        const valid = user ? await bcrypt.compare(password, user.password_hash) : false;

        if (!valid) {
            return NextResponse.json(
                { success: false, message: "Username atau password salah." },
                { status: 401 }
            );
        }

        const token = await signSession({
            id: user.id,
            name: user.name,
            username: user.username,
            role: user.role,
        });

        const redirect = user.role === "admin" ? "/admin" : "/kasir";

        const response = NextResponse.json({ success: true, redirect: redirect });
        response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);

        return response;
    } catch (err) {
        console.error("Login error:", err);
        return NextResponse.json(
            { success: false, message: "Terjadi kesalahan server." },
            { status: 500 }
        );
    }
}