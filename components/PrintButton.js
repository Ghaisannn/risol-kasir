"use client";

export default function PrintButton() {
    return (
        <button
            onClick={() => window.print()}
            className="no-print mb-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-navy py-3 font-display font-semibold text-cream transition hover:bg-ink"
        >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9V3h12v6M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                <path d="M6 14h12v7H6z" />
            </svg>
            Cetak Struk
        </button>
    );
}