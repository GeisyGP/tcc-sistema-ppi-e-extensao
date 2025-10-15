"use client"

import { Project } from "@/types/project.type"
import { PencilSquareIcon } from "@heroicons/react/24/outline"
import { useState } from "react"
import { Button } from "../buttons/default.button"

type VisibilityTogglePopoverProps = {
    project: Project
    onUpdate: (newValue: boolean) => Promise<void>
}

export function VisibilityTogglePopover({ project, onUpdate }: VisibilityTogglePopoverProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleConfirm = async () => {
        setLoading(true)
        try {
            await onUpdate(!project.visibleToAll)
        } finally {
            setLoading(false)
            setIsOpen(false)
        }
    }

    return (
        <div className="relative inline-block">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full font-medium shadow-sm transition-all duration-200 bg-gray-100 text-gray-700 hover:bg-gray-200"
                title="Alterar visibilidade"
            >
                <PencilSquareIcon className="w-4 h-4 opacity-70" />
                {project.visibleToAll ? "Sim" : "Não"}
            </button>

            {isOpen && (
                <div className="absolute z-50 right-0 mt-2 w-72 bg-white border border-gray-200 shadow-lg rounded p-3 text-sm text-gray-700">
                    <p className="text-sm text-gray-700 mb-3">
                        {project.visibleToAll
                            ? "Ao remover a visibilidade geral, o projeto continuará acessível apenas aos discentes que participam dele. Deseja remover a visibilidade para todos?"
                            : "Deseja tornar este projeto visível para todos os discentes do curso?"}
                    </p>

                    <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={() => setIsOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleConfirm} disabled={loading}>
                            {loading ? "Salvando..." : "Confirmar"}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
