"use client"

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { useState } from "react"

interface SearchBarProps {
    onSearch: (value: string) => void
    placeholder?: string
}

export default function SearchBar({ onSearch, placeholder }: SearchBarProps) {
    const [value, setValue] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSearch(value.trim())
    }

    return (
        <form onSubmit={handleSubmit} className="relative w-full">
            <input
                type="text"
                placeholder={placeholder || "Buscar..."}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="
          w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 pr-10 
          placeholder-gray-400
          focus:border-gray-300 focus:ring-2 focus:ring-gray-300 outline-none
        "
            />

            <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition"
            >
                <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
        </form>
    )
}
