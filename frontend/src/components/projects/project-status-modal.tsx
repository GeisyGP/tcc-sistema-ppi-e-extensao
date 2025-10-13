"use client"

import { useState } from "react"
import { Button } from "@/components/buttons/default.button"
import { ProjectStatus, ProjectStatusMapped } from "@/types/project.type"

interface ProjectStatusModalProps {
    isOpen: boolean
    currentStatus: ProjectStatus
    onClose: () => void
    onSave: (newStatus: ProjectStatus) => void
}

export function ProjectStatusModal({ isOpen, currentStatus, onClose, onSave }: ProjectStatusModalProps) {
    const [selectedStatus, setSelectedStatus] = useState(currentStatus)

    if (!isOpen) return null

    const status = [
        { value: ProjectStatus.NOT_STARTED, label: ProjectStatusMapped.NOT_STARTED },
        { value: ProjectStatus.STARTED, label: ProjectStatusMapped.STARTED },
        { value: ProjectStatus.FINISHED, label: ProjectStatusMapped.FINISHED },
    ]

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-sm p-6 animate-fadeIn">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Alterar status</h2>

                <div className="space-y-3">
                    {status.map((status) => (
                        <label
                            key={status.value}
                            className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition ${
                                selectedStatus === status.value
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                            <input
                                type="radio"
                                name="status"
                                value={status.value}
                                checked={selectedStatus === status.value}
                                onChange={() => setSelectedStatus(status.value)}
                                className="text-blue-600 focus:ring-blue-500"
                            />
                            <span className={"font-medium"}>{status.label}</span>
                        </label>
                    ))}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <Button variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            onSave(selectedStatus)
                            onClose()
                        }}
                    >
                        Salvar
                    </Button>
                </div>
            </div>
        </div>
    )
}
