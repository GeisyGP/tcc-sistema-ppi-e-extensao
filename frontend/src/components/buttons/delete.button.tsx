'use client'

import { useState } from "react"
import { ExclamationTriangleIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Button } from "./default.button"

interface DeleteButtonModalProps {
    id: string
    onDelete?: (id: string) => Promise<void>
}

export function DeleteButtonModal({ id, onDelete }: DeleteButtonModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    if (!onDelete) return

    const handleOpen = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsOpen(true)
    }

    const handleConfirm = async () => {
        setLoading(true)
        await onDelete(id)
    }

    const handleClose = () => {
        setIsOpen(false)
    }

    return (
        <>
            <button
                onClick={handleOpen}
                className="text-red-400 hover:text-red-700"
                title="Excluir"
            >
                <TrashIcon className="h-5 w-5" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg p-8 w-full max-w-lg text-left">
                        <>
                            <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500 mb-4" />
                            <h2 className="text-lg font-semibold mb-2">Tem certeza que deseja excluir?</h2>
                            <p className="text-sm text-gray-600 mb-4">
                                Essa ação não poderá ser desfeita.
                            </p>
                            <div className="flex justify-center gap-4">
                                <Button
                                    variant="secondary"
                                    onClick={handleClose}
                                    disabled={loading}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={handleConfirm}
                                    disabled={loading}
                                >
                                    {loading ? 'Excluindo...' : 'Confirmar'}
                                </Button>
                            </div>
                        </>
                    </div>
                </div>
            )}
        </>
    )
}
