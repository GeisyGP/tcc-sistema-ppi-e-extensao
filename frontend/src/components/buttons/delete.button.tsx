"use client"

import { useState } from "react"
import { ExclamationTriangleIcon, TrashIcon } from "@heroicons/react/24/outline"
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
        setLoading(false)
        setIsOpen(false)
    }

    const handleClose = () => setIsOpen(false)

    return (
        <>
            <button onClick={handleOpen} className="text-red-400 hover:text-red-700" title="Excluir">
                <TrashIcon className="h-5 w-5" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl text-center transform transition-transform scale-100">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
                            <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Tem certeza que deseja excluir?</h2>
                        <p className="text-sm text-gray-500 mb-6">Essa ação não poderá ser desfeita.</p>
                        <div className="flex justify-center gap-4">
                            <Button variant="secondary" className="w-32" onClick={handleClose} disabled={loading}>
                                Cancelar
                            </Button>
                            <Button
                                className="w-32 bg-red-600 hover:bg-red-700 text-white"
                                onClick={handleConfirm}
                                disabled={loading}
                            >
                                {loading ? "Excluindo..." : "Confirmar"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
