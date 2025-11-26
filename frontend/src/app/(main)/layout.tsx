"use client"

import Navbar from "@/components/navbar.global"

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="grid h-screen p-0 font-[family-name:var(--font-geist-sans)]">
            <Navbar />
            <main className="w-full p-6 sm:p-10 md:p-18 pt-[64px]">{children}</main>
        </div>
    )
}
