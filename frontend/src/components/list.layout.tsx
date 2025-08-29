'use client'

import { Button } from '@/components/buttons/default.button'
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    PencilIcon,
} from '@heroicons/react/24/outline'
import { DeleteButtonModal } from './buttons/delete.button'

type Column<T> = {
    key: keyof T
    label: string
    render?: (value: unknown, row: T) => React.ReactNode
}

type ListProps<T extends { id: string | number }> = {
    columns: Column<T>[]
    data: T[]
    page: number
    totalPages: number
    onPageChange: (page: number) => void
    showDeleteAction?: boolean
    onDelete?: (id: string) => Promise<void>
    showEditAction?: boolean
    onEdit?: (id: string, item: T) => Promise<void>
}

export default function List<T extends { id: string }>({
    columns,
    data,
    page,
    totalPages,
    onPageChange,
    showDeleteAction = false,
    onDelete,
    showEditAction = false,
    onEdit
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

                            {(showEditAction || showDeleteAction) && (
                                <th className="px-4 py-3 text-sm font-medium text-gray-700 text-right">
                                    Ações
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={
                                        columns.length +
                                        (showEditAction || showDeleteAction ? 1 : 0)
                                    }
                                    className="px-4 py-6 text-center text-gray-500"
                                >
                                    Nenhum registro encontrado
                                </td>
                            </tr>
                        ) : (
                            data.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50">
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

                                    {(showEditAction || showDeleteAction) && (
                                        <td className="px-4 py-3 text-sm text-right space-x-2">
                                            {showEditAction && (
                                                <button
                                                    onClick={() => onEdit?.(row.id, row)}
                                                    className="text-black-400 hover:text-black-900"
                                                >
                                                    <PencilIcon className="h-5 w-5" />
                                                </button>
                                            )}
                                            {showDeleteAction && <DeleteButtonModal id={row.id} onDelete={onDelete} />}
                                        </td>
                                    )}
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
