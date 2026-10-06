import { Fredoka, DM_Sans } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
    subsets: ["latin"],
    variable: "--font-fredoka",
    weight: ["500", "600", "700"],
});

const dmSans = DM_Sans({
    subsets: ["latin"],
    variable: "--font-dmsans",
});

export const metadata = {
    title: "Risol Mayo Fitri - Kasir",
    description: "Aplikasi kasir Risol Mayo Fitri",
};

export default function RootLayout({ children }) {
    return (
        <html lang="id" className={fredoka.variable + " " + dmSans.variable}>
            <body className="font-sans bg-cream text-ink antialiased">{children}</body>
        </html>
    );
}