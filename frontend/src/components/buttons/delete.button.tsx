'use client'

import { useState } from "react"
import { CheckCircleIcon, ExclamationTriangleIcon, TrashIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { Button } from "./default.button"

interface DeleteButtonModalProps {
    id: string
    onDelete?: (id: string) => Promise<void>
}

export function DeleteButtonModal({ id, onDelete }: DeleteButtonModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [loading, setLoading] = useState(false)
    if (!onDelete) return

    const handleOpen = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsOpen(true)
    }

    const handleConfirm = async () => {
        setLoading(true)
        try {
            await onDelete(id)
            setStatus('success')
        } catch (err) {
            console.error(err)
            setStatus('error')
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setIsOpen(false)
        setStatus('idle')
    }

    return (
        <>
            <button
                onClick={handleOpen}
                className="text-red-500 hover:text-red-700"
                title="Excluir"
            >
                <TrashIcon className="h-5 w-5" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg p-8 w-full max-w-lg text-left">
                        {status === 'idle' && (
                            <>
                                <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500 mb-4" />
                                <h2 className="text-lg font-semibold mb-2">Tem certeza que deseja excluir?</h2>
                                <p className="text-sm text-gray-600 mb-4">
                                    Essa ação não poderá ser desfeita.
                                </p>
                                <div className="flex justify-center gap-4">
                                    <Button
                                        variant = "secondary"
                                        onClick={handleClose}
                                        disabled={loading}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        onClick={handleConfirm}
                                        className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                                        disabled={loading}
                                    >
                                        {loading ? 'Excluindo...' : 'Confirmar'}
                                    </Button>
                                </div>
                            </>
                        )}

                        {status === 'success' && (
                            <div className="flex flex-col items-center gap-4">
                                <CheckCircleIcon className="h-12 w-12 text-green-500" />
                                <h2 className="text-lg font-semibold text-black-800">Excluído com sucesso</h2>
                                <button
                                    onClick={handleClose}
                                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                >
                                    Fechar
                                </button>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="flex flex-col items-center gap-4">
                                <XCircleIcon className="h-12 w-12 text-red-500" />
                                <h2 className="text-lg font-semibold text-black-800">Erro ao excluir. Tente novamente mais tarde.</h2>
                                <button
                                    onClick={handleClose}
                                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                >
                                    Fechar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
