import Navbar from "@/components/global/navbar.global"
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
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-br">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <div className="grid h-screen p-0 font-[family-name:var(--font-geist-sans)]">
                    <Navbar />
                    <main className="w-full p-18">{children}</main>
                </div>
            </body>
        </html>
    )
}
