import "../globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "SIPPIE",
    description: "Sistema Integrado de PPI e Extensão",
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-br">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <div className="grid place-items-center h-screen p-0 font-[family-name:var(--font-geist-sans)] bg-linear-to-br from-gray-100 to-gray-200">
                    <main className="w-full max-w-4xl p-6">{children}</main>
                </div>
            </body>
        </html>
    );
}
