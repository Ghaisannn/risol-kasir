import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

function homeFor(role) {
    return role === "admin" ? "/admin" : "/kasir";
}

export async function proxy(req) {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const session = await verifySession(token);

    // Halaman utama: arahkan sesuai status login
    if (pathname === "/") {
        const target = session ? homeFor(session.role) : "/login";
        return NextResponse.redirect(new URL(target, req.url));
    }

    // Halaman login: kalau sudah login, tidak perlu tampil lagi
    if (pathname === "/login") {
        if (session) {
            return NextResponse.redirect(new URL(homeFor(session.role), req.url));
        }
        return NextResponse.next();
    }

    // Area admin: hanya role admin
    if (pathname.startsWith("/admin")) {
        if (!session) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        if (session.role !== "admin") {
            return NextResponse.redirect(new URL(homeFor(session.role), req.url));
        }
        return NextResponse.next();
    }

    // Area kasir: hanya role petugas
    if (pathname.startsWith("/kasir")) {
        if (!session) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        if (session.role !== "petugas") {
            return NextResponse.redirect(new URL(homeFor(session.role), req.url));
        }
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/login", "/admin/:path*", "/kasir/:path*"],
};