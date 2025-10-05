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
        setValues((prev) => ({ ...prev, [key]: value }))
    }

    const handleApply = () => {
        onApply(values)
        setIsOpen(false)
    }

    const handleLoadOptions = async (filter: FilterOption) => {
        if (filter.onLoadOptions && !dynamicOptions[filter.key]) {
            const loaded = await filter.onLoadOptions()
            setDynamicOptions((prev) => ({ ...prev, [filter.key]: loaded }))
        }
    }

    return (
        <div className="relative">
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 !bg-gray-50 !text-gray-500 !border !border-gray-300"
                variant="secondary"
            >
                <FunnelIcon className="h-6 w-5" />
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-sm p-4 z-50">
                    <h3 className="text-sm font-semibold mb-2 text-gray-900">Filtros</h3>
                    <div className="space-y-3">
                        {filters.map((f) => {
                            const opts = dynamicOptions[f.key] || f.options || []
                            return (
                                <div key={f.key}>
                                    <label className="block text-sm font-medium mb-1 text-gray-900">{f.label}</label>
                                    {f.type === "select" ? (
                                        <select
                                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-gray-300 focus:ring-1 focus:ring-gray-300 outline-none"
                                            value={values[f.key] || ""}
                                            onChange={(e) => handleChange(f.key, e.target.value)}
                                            onFocus={() => handleLoadOptions(f)}
                                        >
                                            <option value="">Todos</option>
                                            {opts.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-sm focus:border-gray-300 focus:ring-1 focus:ring-gray-300 outline-none"
                                            value={values[f.key] || ""}
                                            onChange={(e) => handleChange(f.key, e.target.value)}
                                        />
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <Button onClick={() => setIsOpen(false)} variant="secondary" className="px-3 py-1 text-sm">
                            Cancelar
                        </Button>
                        <Button onClick={handleApply} className="bg-green-600 text-white px-3 py-1 text-sm">
                            Aplicar
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
