"use client"

import { useState } from "react"

interface SearchBarProps {
  onSearch: (value: string) => void
  placeholder?: string
}

export default function SearchBar({ onSearch, placeholder }: SearchBarProps) {
  const [value, setValue] = useState("")

  return (
    <div className="flex items-center gap-2 mb-4">
      <input
        type="text"
        placeholder={placeholder || "Buscar..."}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 rounded-md border px-3 py-2"
      />

      <button
        type="button"
        onClick={() => onSearch(value)}
        className="px-4 py-2 bg-green-700 text-white rounded"
      >
        Pesquisar
      </button>
    </div>
  )
}
