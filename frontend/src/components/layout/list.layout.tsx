'use client'

import { Button } from '@/components/global/buttons/default.button'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

type Column<T> = {
    key: keyof T
    label: string
    render?: (value: unknown, row: T) => React.ReactNode
}

type ListProps<T> = {
    columns: Column<T>[]
    data: T[]
    page: number
    totalPages: number
    onPageChange: (page: number) => void
}

export default function List<T>({
    columns,
    data,
    page,
    totalPages,
    onPageChange,
}: ListProps<T>) {
    return (
        <div className="w-full p-6 space-y-4 border rounded-lg bg-gray-50">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={String(col.key)}
                                    className="px-4 py-3 text-left text-sm font-medium text-gray-700"
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-4 py-6 text-center text-gray-500"
                                >
                                    Nenhum registro encontrado
                                </td>
                            </tr>
                        ) : (
                            data.map((row, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    {columns.map((col) => (
                                        <td
                                            key={String(col.key)}
                                            className="px-4 py-3 text-sm text-gray-700"
                                        >
                                            {col.render
                                                ? col.render(row[col.key], row)
                                                : String(row[col.key])}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between">
                <Button
                    variant="secondary"
                    className="flex items-center gap-1"
                    aria-disabled={page === 1}
                    onClick={() => onPageChange(page - 1)}
                >
                    <ChevronLeftIcon className="h-4 w-4" />
                    Anterior
                </Button>
                <span className="text-sm text-gray-600">
                    Página {page} de {totalPages}
                </span>
                <Button
                    variant="secondary"
                    className="flex items-center gap-1"
                    aria-disabled={page === totalPages}
                    onClick={() => onPageChange(page + 1)}
                >
                    Próxima
                    <ChevronRightIcon className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
