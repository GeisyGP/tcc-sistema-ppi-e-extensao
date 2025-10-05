export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="grid place-items-center h-screen p-0 font-[family-name:var(--font-geist-sans)] bg-linear-to-br from-gray-100 to-gray-200">
            <main className="w-full max-w-4xl p-6">{children}</main>
        </div>
    )
}
