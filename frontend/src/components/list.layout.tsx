"use client"

import { Button } from "@/components/buttons/default.button"
import { ChevronLeftIcon, ChevronRightIcon, PencilSquareIcon, KeyIcon } from "@heroicons/react/24/outline"
import { DeleteButtonModal } from "./buttons/delete.button"

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
    totalItems: number
    onPageChange: (page: number) => void
    onView?: (item: T) => void
    showDeleteAction?: boolean
    onDelete?: (id: string) => Promise<void>
    showEditAction?: boolean
    onEdit?: (item: T) => void
    showChangePasswordAction?: boolean
    onChangePassword?: (item: T) => void
}

export default function List<T extends { id: string }>({
    columns,
    data,
    page,
    totalPages,
    totalItems,
    onPageChange,
    showDeleteAction = false,
    onDelete,
    showEditAction = false,
    onEdit,
    onView,
    showChangePasswordAction = false,
    onChangePassword,
}: ListProps<T>) {
    return (
        <div className="w-full p-8 space-y-6 rounded-xl bg-gray-50 shadow-md">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={String(col.key)}
                                    className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide"
                                >
                                    {col.label}
                                </th>
                            ))}
                            {(showEditAction || showDeleteAction) && (
                                <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-right uppercase tracking-wide">
                                    Ações
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 bg-white">
                        {data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (showEditAction || showDeleteAction ? 1 : 0)}
                                    className="px-4 py-4 text-center text-gray-500"
                                >
                                    Nenhum registro encontrado
                                </td>
                            </tr>
                        ) : (
                            data.map((row) => (
                                <tr
                                    key={row.id}
                                    className="hover:bg-gray-100 cursor-pointer transition-colors"
                                    onClick={(e) => {
                                        const target = e.target as HTMLElement
                                        if (target.closest("button")) return
                                        onView?.(row)
                                    }}
                                >
                                    {columns.map((col) => (
                                        <td key={String(col.key)} className="px-4 py-3 text-sm text-gray-700">
                                            {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                                        </td>
                                    ))}

                                    {(showEditAction || showDeleteAction) && (
                                        <td className="px-4 py-3 text-sm flex justify-end items-center gap-3">
                                            {showChangePasswordAction && (
                                                <button
                                                    onClick={() => onChangePassword?.(row)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-700 transition"
                                                    title="Alterar senha"
                                                >
                                                    <KeyIcon className="h-5 w-5" />
                                                </button>
                                            )}
                                            {showEditAction && (
                                                <button
                                                    onClick={() => onEdit?.(row)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-700 transition"
                                                    title="Editar"
                                                >
                                                    <PencilSquareIcon className="h-5 w-5" />
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

            <div className="flex items-center justify-between mt-4">
                <Button
                    variant="secondary"
                    className="flex items-center gap-2 min-w-[90px] h-9"
                    disabled={page === 1}
                    onClick={() => onPageChange(page - 1)}
                >
                    <ChevronLeftIcon className="h-4 w-4" />
                    Anterior
                </Button>

                <span className="text-sm text-gray-500 mx-2">
                    Exibindo {data.length} de {totalItems} - Página {page} de {totalPages}
                </span>

                <Button
                    variant="secondary"
                    className="flex items-center gap-2 min-w-[90px] h-9"
                    disabled={page === totalPages}
                    onClick={() => onPageChange(page + 1)}
                >
                    Próxima
                    <ChevronRightIcon className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
