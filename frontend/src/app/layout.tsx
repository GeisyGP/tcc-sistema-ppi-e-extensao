import { NextAuthProvider } from "@/providers/session-provider";
import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";

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
                <NextAuthProvider>
                    {children}
                </NextAuthProvider>
                <Toaster position="top-right" reverseOrder={false} />
            </body>
        </html>
    )
}
