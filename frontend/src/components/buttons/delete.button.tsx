"use client"

import { useState } from "react"
import { ExclamationTriangleIcon, TrashIcon } from "@heroicons/react/24/outline"
import { Button } from "./default.button"

interface DeleteButtonModalProps {
    id: string
    onDelete?: (id: string) => Promise<void>
    buttonClassName?: string
    iconClassName?: string
}

export function DeleteButtonModal({ id, onDelete, buttonClassName, iconClassName }: DeleteButtonModalProps) {
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
            <button
                onClick={handleOpen}
                className={buttonClassName || "text-red-400 hover:text-red-700"}
                title="Excluir"
            >
                <TrashIcon className={iconClassName || "h-5 w-5"} />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl text-center transform transition-transform scale-100">
                        <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-gray-100 mb-4">
                            <ExclamationTriangleIcon className="h-6 w-6 text-gray-600" />
                        </div>
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Tem certeza que deseja excluir?</h2>
                        <div className="flex justify-center gap-6">
                            <Button
                                variant="secondary"
                                className="w-32 transition-colors hover:bg-gray-100"
                                onClick={handleClose}
                                disabled={loading}
                            >
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
