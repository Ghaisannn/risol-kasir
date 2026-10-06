import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "risol_session";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 jam

export const sessionCookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
};

function getKey() {
    const secret = process.env.SESSION_SECRET;
    if (!secret) {
        throw new Error("SESSION_SECRET belum diisi di .env.local");
    }
    return new TextEncoder().encode(secret);
}

// Bikin token yang ditandatangani
export async function signSession(payload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("8h")
        .sign(getKey());
}

// Cek token: kalau asli dan belum kedaluwarsa kembalikan isinya, kalau tidak null
export async function verifySession(token) {
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, getKey());
        return payload;
    } catch (err) {
        return null;
    }
}