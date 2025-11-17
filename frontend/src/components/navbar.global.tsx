"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { logout } from "@/actions/logout"
import { RoleGuard } from "./role-guard"
import { UserRole } from "@/types/user.type"
import { CourseSelector } from "./courses/course-selector"

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const pathname = usePathname()

    const navItems = [
        { href: "/home", label: "Início", roles: [] },
        {
            href: "/projects",
            label: "Projetos",
            roles: [UserRole.COORDINATOR, UserRole.STUDENT, UserRole.TEACHER, UserRole.VIEWER],
        },
        { href: "/ppis", label: "PPIs", roles: [UserRole.COORDINATOR, UserRole.TEACHER] },
        { href: "/subjects", label: "Disciplinas", roles: [UserRole.COORDINATOR, UserRole.TEACHER] },
        { href: "/users", label: "Usuários", roles: [UserRole.SYSADMIN, UserRole.COORDINATOR, UserRole.TEACHER] },
        { href: "/courses", label: "Cursos", roles: [UserRole.SYSADMIN] },
    ]

    return (
        <nav className="bg-green-900 p-4 fixed top-0 left-0 w-full h-16 z-10 flex items-center justify-between">
            <Link href="/home" className="text-3xl font-bold text-white tracking-wide">
                Gestão PPI
            </Link>

            <ul className="hidden lg:flex justify-center space-x-8 text-white flex-1 mx-8">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                    return (
                        <RoleGuard key={item.href} roles={item.roles}>
                            <li>
                                <Link
                                    href={item.href}
                                    className={`hover:underline hover:underline-offset-4 transition-opacity ${
                                        isActive ? "opacity-100 font-bold underline" : "opacity-50"
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        </RoleGuard>
                    )
                })}
            </ul>

            <div className="flex items-center space-x-3">
                <RoleGuard roles={[UserRole.COORDINATOR, UserRole.STUDENT, UserRole.TEACHER, UserRole.VIEWER]}>
                    <div className="flex lg:hidden">
                        <CourseSelector />
                    </div>
                    <div className="hidden lg:block">
                        <CourseSelector />
                    </div>
                </RoleGuard>

                <button
                    onClick={() => logout()}
                    className="hidden lg:block bg-green-700 hover:bg-green-900 text-white px-4 py-2 rounded transition"
                >
                    Sair
                </button>

                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                    className="lg:hidden text-white text-2xl"
                >
                    {menuOpen ? "✕" : "☰"}
                </button>
            </div>

            {menuOpen && (
                <ul className="lg:hidden bg-green-900 p-4 space-y-4 rounded-b-lg text-white absolute top-full left-0 w-full z-20">
                    {navItems.map((item) => (
                        <RoleGuard key={item.href} roles={item.roles}>
                            <li>
                                <Link
                                    href={item.href}
                                    onClick={() => setMenuOpen(false)}
                                    className="block hover:underline"
                                >
                                    {item.label}
                                </Link>
                            </li>
                        </RoleGuard>
                    ))}

                    <li>
                        <button
                            onClick={() => {
                                logout()
                                setMenuOpen(false)
                            }}
                            className="w-full bg-green-700 hover:bg-green-900 text-white px-4 py-2 rounded transition"
                        >
                            Sair
                        </button>
                    </li>
                </ul>
            )}
        </nav>
    )
}
