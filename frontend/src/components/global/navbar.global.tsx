"use client"

import { useState } from "react"
import { logout } from "@/actions/logout"
import Link from "next/link"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-green-900 p-4 fixed top-0 left-0 w-full h-16 z-10 rounded-lg flex items-center justify-between">
      <div>
        <Link href="/home" className="text-3xl font-bold text-white tracking-wide m-0">
          SIPPIE
        </Link>
      </div>

      <ul className="hidden sm:flex space-x-4 text-white">
        <li>
          <Link href="/home" className="hover:underline hover:underline-offset-4">
            Home
          </Link>
        </li>
        <li>
          <Link href="/sobre" className="hover:underline hover:underline-offset-4">
            Sobre
          </Link>
        </li>
        <li>
          <Link href="/teste" className="hover:underline hover:underline-offset-4">
            Teste
          </Link>
        </li>
      </ul>

      <div className="flex items-center space-x-4">
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
          <li>
            <Link href="/home" className="block hover:underline" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/sobre" className="block hover:underline" onClick={() => setMenuOpen(false)}>
              Sobre
            </Link>
          </li>
          <li>
            <Link href="/teste" className="block hover:underline" onClick={() => setMenuOpen(false)}>
              Teste
            </Link>
          </li>
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
