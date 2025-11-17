"use client"

import { useModalBehavior } from "@/hooks/use-modal-baheavior"
import { ReactNode } from "react"

type ViewModalProps<T> = {
    isOpen: boolean
    item: T | null
    onClose: () => void
    renderContent: (item: T) => ReactNode
    title?: string | ((item: T) => string)
}

export function ViewModal<T>({ isOpen, item, onClose, renderContent, title }: ViewModalProps<T>) {
    const { handleBackdropClick } = useModalBehavior(isOpen, onClose)
    if (!isOpen || !item) return null

    const renderedTitle = typeof title === "function" ? title(item) : title

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleBackdropClick}>
            <div className="max-h-[90vh] bg-white rounded-lg p-6 w-full max-w-xl overflow-y-auto">
                {renderedTitle && (
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-lg font-bold text-gray-900">{renderedTitle}</h2>
                    </div>
                )}

                <div className="space-y-2">{renderContent(item)}</div>

                <div className="mt-6 text-right">
                    <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-900">
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    )
}
