"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/buttons/default.button"
import { ChevronDownIcon, ChevronUpIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline"
import { ProjectRes } from "@/types/project.type"
import { getAllPPIs } from "@/services/ppis.service"
import { createProjectSchema } from "@/validations/project.schema"
import { useModalBehavior } from "@/hooks/use-modal-baheavior"

export type PPIOption = {
    label: string
    value: string
}

type EditProjectModalProps = {
    isOpen: boolean
    project: ProjectRes | null
    onClose: () => void
    onSave: (updated: ProjectRes) => void
}

export function ProjectModal({ isOpen, project, onClose, onSave }: EditProjectModalProps) {
    const [formData, setFormData] = useState<ProjectRes | null>(null)
    const [allPPIs, setAllPPIs] = useState<PPIOption[]>([])
    const [ppisLoaded, setPPIsLoaded] = useState(false)
    const [showPPISelect, setShowPPISelect] = useState(false)
    const [search, setSearch] = useState("")
    const [errors, setErrors] = useState<Record<string, string>>({})
    const { handleBackdropClick } = useModalBehavior(isOpen, onClose)

    const isEditing = !!project

    useEffect(() => {
        if (project) {
            setFormData(project)
        } else {
            setFormData({
                id: "",
                class: "",
                executionPeriod: "",
                status: "",
                theme: "",
                campusDirector: "",
                academicDirector: "",
                ppiId: "",
                ppiClassPeriod: "",
            } as unknown as ProjectRes)
        }
    }, [project])

    const fetchPPIs = useCallback(async (query?: string) => {
        const data = await getAllPPIs({ classPeriod: query })
        setAllPPIs(data?.items.map((u) => ({ label: u.classPeriod, value: u.id })) || [])
    }, [])

    useEffect(() => {
        if (!isOpen || ppisLoaded || isEditing) return

        const timeout = setTimeout(() => {
            fetchPPIs(search)
            setPPIsLoaded(true)
        }, 800)
        return () => clearTimeout(timeout)
    }, [search, fetchPPIs, isOpen, ppisLoaded, isEditing])

    if (!isOpen || !formData) return null

    const handleSelectPPI = (ppi: PPIOption) => {
        setFormData({
            ...formData,
            ppiId: ppi.value,
            ppiClassPeriod: ppi.label,
        })
        setShowPPISelect(false)
    }

    const handleSubmit = () => {
        const result = createProjectSchema.safeParse(formData)

        if (!result.success) {
            const firstIssue = result.error.issues[0]
            setErrors({
                [firstIssue.path[0] as string]: firstIssue.message,
            })
            return
        }

        onSave(formData)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleBackdropClick}>
            <div className="max-h-[90vh] bg-white rounded-lg p-6 w-full max-w-xl overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4">{isEditing ? "Editar projeto" : "Novo projeto"}</h2>

                <div className="space-y-3">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Tema</label>
                        <input
                            type="text"
                            value={formData.theme}
                            onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                            className="mt-1 p-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.theme && (
                            <div className="flex items-center space-x-1 mt-1 text-red-500 text-sm">
                                <ExclamationCircleIcon className="h-4 w-4" />
                                <span>{errors.theme}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Turma</label>
                        <input
                            type="text"
                            value={formData.class}
                            onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                            className="mt-1 p-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.class && (
                            <div className="flex items-center space-x-1 mt-1 text-red-500 text-sm">
                                <ExclamationCircleIcon className="h-4 w-4" />
                                <span>{errors.class}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Período de execução (ano/semestre)</label>
                        <input
                            type="text"
                            value={formData.executionPeriod}
                            onChange={(e) => setFormData({ ...formData, executionPeriod: e.target.value })}
                            className="mt-1 p-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.executionPeriod && (
                            <div className="flex items-center space-x-1 mt-1 text-red-500 text-sm">
                                <ExclamationCircleIcon className="h-4 w-4" />
                                <span>{errors.executionPeriod}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Diretor(a) Geral do Campus</label>
                        <input
                            type="text"
                            value={formData.campusDirector}
                            onChange={(e) => setFormData({ ...formData, campusDirector: e.target.value })}
                            className="mt-1 p-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.campusDirector && (
                            <div className="flex items-center space-x-1 mt-1 text-red-500 text-sm">
                                <ExclamationCircleIcon className="h-4 w-4" />
                                <span>{errors.campusDirector}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Diretor(a) de Ensino</label>
                        <input
                            type="text"
                            value={formData.academicDirector}
                            onChange={(e) => setFormData({ ...formData, academicDirector: e.target.value })}
                            className="mt-1 p-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.academicDirector && (
                            <div className="flex items-center space-x-1 mt-1 text-red-500 text-sm">
                                <ExclamationCircleIcon className="h-4 w-4" />
                                <span>{errors.academicDirector}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">PPI</label>

                        {isEditing ? (
                            <div className="p-2 border rounded-md bg-gray-50 text-gray-700 cursor-not-allowed">
                                {formData.ppiClassPeriod || "PPI não definida"}
                            </div>
                        ) : (
                            <>
                                <div
                                    className="flex items-center justify-between p-2 border rounded-md bg-white shadow-sm cursor-pointer hover:ring-1 hover:ring-blue-400 transition-all"
                                    onClick={() => setShowPPISelect(!showPPISelect)}
                                >
                                    <span className="text-sm text-gray-700">
                                        {formData.ppiClassPeriod || "Selecione uma PPI"}
                                    </span>
                                    {showPPISelect ? (
                                        <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                                    ) : (
                                        <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                                    )}
                                </div>

                                {errors.ppiId && (
                                    <div className="flex items-center space-x-1 mt-1 text-red-500 text-sm">
                                        <ExclamationCircleIcon className="h-4 w-4" />
                                        <span>{errors.ppiId}</span>
                                    </div>
                                )}

                                {showPPISelect && (
                                    <div className="mt-1 border rounded shadow-lg p-2 max-h-60 overflow-y-auto bg-white z-10">
                                        <input
                                            type="text"
                                            placeholder="Buscar PPI..."
                                            value={search}
                                            onChange={(e) => {
                                                setSearch(e.target.value)
                                                setPPIsLoaded(false)
                                            }}
                                            className="w-full p-1 mb-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                        />

                                        <div className="flex flex-col gap-1">
                                            {allPPIs.length === 0 ? (
                                                <span className="text-sm text-gray-500 italic px-1">
                                                    Nenhuma PPI encontrada
                                                </span>
                                            ) : (
                                                allPPIs.map((ppi) => (
                                                    <div
                                                        key={ppi.value}
                                                        className={`p-1 rounded cursor-pointer text-sm hover:bg-gray-100 ${formData.ppiId === ppi.value ? "bg-blue-100" : ""}`}
                                                        onClick={() => handleSelectPPI(ppi)}
                                                    >
                                                        {ppi.label}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <Button variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Salvar
                    </Button>
                </div>
            </div>
        </div>
    )
}
