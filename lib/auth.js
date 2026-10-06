import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

// Ambil data user yang sedang login (atau null kalau belum login)
export async function getSession() {
    const store = await cookies();
    const token = store.get(SESSION_COOKIE)?.value;
    return await verifySession(token);
}