"use client"

import { useState } from "react"
import { FunnelIcon } from "@heroicons/react/24/outline"
import { Button } from "./default.button"

type FilterOption = {
  key: string
  label: string
  type: "select" | "text"
  options?: { label: string; value: string }[]
  onLoadOptions?: () => Promise<{ label: string; value: string }[]>
}

type FilterButtonProps = {
  filters: FilterOption[]
  onApply: (values: Record<string, string>) => void
}

export function FilterButton({ filters, onApply }: FilterButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [values, setValues] = useState<Record<string, string>>({})
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, { label: string; value: string }[]>>({})

  const handleChange = (key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }))
  }

  const handleApply = () => {
    onApply(values)
    setIsOpen(false)
  }

  const handleLoadOptions = async (filter: FilterOption) => {
    if (filter.onLoadOptions && !dynamicOptions[filter.key]) {
      const loaded = await filter.onLoadOptions()
      setDynamicOptions(prev => ({ ...prev, [filter.key]: loaded }))
    }
  }

  return (
    <div className="relative">
      <Button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-1" variant="secondary">
        <FunnelIcon className="h-6 w-5" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg p-4 z-50">
          <h3 className="text-lg font-semibold mb-3">Filtros</h3>
          <div className="space-y-3">
            {filters.map(f => {
              const opts = dynamicOptions[f.key] || f.options || []
              return (
                <div key={f.key}>
                  <label className="block text-sm font-medium mb-1">{f.label}</label>
                  {f.type === "select" ? (
                    <select
                      className="w-full border rounded px-2 py-1"
                      value={values[f.key] || ""}
                      onChange={e => handleChange(f.key, e.target.value)}
                      onFocus={() => handleLoadOptions(f)}
                    >
                      <option value="">Todos</option>
                      {opts.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1"
                      value={values[f.key] || ""}
                      onChange={e => handleChange(f.key, e.target.value)}
                    />
                  )}
                </div>
              )
            })}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsOpen(false)} variant="secondary">Cancelar</Button>
            <Button onClick={handleApply} className="bg-green-600 text-white">
              Aplicar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
