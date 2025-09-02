"use client"

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { useState } from "react"

interface SearchBarProps {
  onSearch: (value: string) => void
  placeholder?: string
}

export default function SearchBar({ onSearch, placeholder }: SearchBarProps) {
  const [value, setValue] = useState("")

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder={placeholder || "Buscar..."}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-md border px-3 py-2 pr-10"  
      />

      <button
        type="button"
        onClick={() => onSearch(value)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
      </button>
    </div>
  )
}
