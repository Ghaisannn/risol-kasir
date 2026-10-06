export const VARIANTS = [
    { key: "kepiting", match: "kepiting", label: "Kepiting", color: "#e2662a" },
    { key: "beef", match: "beef", label: "Smoke Beef", color: "#8a5a35" },
    { key: "sosis", match: "sosis", label: "Sosis", color: "#d9534f" },
    { key: "sayuran", match: "sayuran", label: "Sayuran & Ayam", color: "#6c9a3f" },
    { key: "kebab", match: "kebab", label: "Kebab", color: "#7a4a28" },
];

export function getVariant(name) {
    const lower = (name || "").toLowerCase();
    const found = VARIANTS.find((v) => lower.includes(v.match));
    return found || { key: "default", label: "Risol", color: "#f2a900" };
}

export function formatRupiah(value) {
    return "Rp " + Number(value || 0).toLocaleString("id-ID");
}