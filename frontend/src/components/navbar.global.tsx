"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { logout } from "@/actions/logout"
import { RoleGuard } from "./role-guard"
import { UserRole } from "@/types/user.type"
import { CourseSelector } from "./course-selector"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: "/home", label: "Home", roles: [] },
    { href: "/projetos", label: "Projetos", roles: [UserRole.COORDINATOR, UserRole.STUDENT, UserRole.TEACHER, UserRole.VIEWER] },
    { href: "/ppis", label: "PPIs", roles: [UserRole.COORDINATOR, UserRole.TEACHER] },
    { href: "/disciplinas", label: "Disciplinas", roles: [UserRole.COORDINATOR, UserRole.STUDENT, UserRole.TEACHER] },
    { href: "/usuarios", label: "Usuários", roles: [UserRole.SYSADMIN, UserRole.COORDINATOR, UserRole.TEACHER] },
    { href: "/cursos", label: "Cursos", roles: [UserRole.SYSADMIN] },
  ]

  return (
    <nav className="bg-green-900 p-4 fixed top-0 left-0 w-full h-16 z-10 rounded-lg flex items-center justify-between">
      <div>
        <Link href="/home" className="text-3xl font-bold text-white tracking-wide m-0">
          SISTEMA
        </Link>
      </div>

      <ul className="hidden sm:flex space-x-8 text-white">
        {navItems.map(item => {
          const isActive = pathname === item.href
          return (
            <RoleGuard key={item.href} roles={item.roles}>
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`hover:underline hover:underline-offset-4 transition-opacity ${isActive ? "opacity-100 font-bold underline" : "opacity-50"
                    }`}
                >
                  {item.label}
                </Link>
              </li>
            </RoleGuard>
          )
        })}
      </ul>

      <div className="flex items-center space-x-4">
        <RoleGuard roles={[UserRole.COORDINATOR, UserRole.STUDENT, UserRole.TEACHER, UserRole.VIEWER]}><CourseSelector /></RoleGuard>
        <button
          onClick={() => logout()}
          className="hidden sm:block bg-green-700 hover:bg-green-900 text-white px-4 py-2 rounded transition"
        >
          Sair
        </button>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          className="sm:hidden text-white text-2xl focus:outline-none"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <ul className="sm:hidden bg-green-900 p-4 space-y-2 rounded-b-lg text-white absolute top-full left-0 w-full z-20">
          {navItems.map(item => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block hover:underline"
              >
                {item.label}
              </Link>
            </li>
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
