"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/buttons/default.button"
import { ChevronDownIcon, ChevronUpIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline"
import { Deliverable } from "@/types/deliverable.type"
import { createDeliverableSchema, updateDeliverableSchema } from "@/validations/deliverable.schema"
import { useUniqueProject } from "@/app/(main)/projetos/[id]/hooks/use-unique-project"
import { getPPIById } from "@/services/ppis.service"

type DeliverableModalProps = {
    isOpen: boolean
    deliverable: Deliverable | null
    projectId: string
    onClose: () => void
    onSave: (updated: Deliverable) => void
}

type SubjectOption = {
    value: string
    label: string
}

export function DeliverableModal({ isOpen, deliverable, projectId, onClose, onSave }: DeliverableModalProps) {
    const isEditMode = !!deliverable
    const [formData, setFormData] = useState<Deliverable | null>(null)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [showSelect, setShowSelect] = useState(false)
    const [search, setSearch] = useState("")
    const [allSubjects, setAllSubjects] = useState<SubjectOption[]>([])
    const [subjectsLoaded, setSubjectsLoaded] = useState(false)
    const { fetchProject, rawData: projectRawData } = useUniqueProject()

    useEffect(() => {
        if (deliverable) {
            setFormData(deliverable)
        } else {
            setFormData({
                id: "",
                name: "",
                description: "",
                startDate: null,
                endDate: null,
                subjectId: "",
                subjectName: "",
            } as unknown as Deliverable)
        }
    }, [deliverable])

    useEffect(() => {
        fetchProject(projectId)
    }, [fetchProject, projectId])

    const fetchSubjects = useCallback(async () => {
        if (projectRawData?.ppiId) {
            const data = await getPPIById(projectRawData.ppiId)
            if (data && data?.subjects.length > 0) {
                setAllSubjects(data.subjects.map((u) => ({ label: u?.name || "", value: u.id })) || [])
            }
        }
    }, [projectRawData?.ppiId])

    useEffect(() => {
        if (!isOpen || isEditMode || subjectsLoaded || !projectRawData?.ppiId) return

        const timeout = setTimeout(() => {
            fetchSubjects()
            setSubjectsLoaded(true)
        }, 800)
        return () => clearTimeout(timeout)
    }, [search, fetchSubjects, subjectsLoaded, isOpen, isEditMode, projectRawData?.ppiId])

    if (!isOpen || !formData) return null

    const handleSubmit = () => {
        if (!isEditMode) {
            const result = createDeliverableSchema.safeParse(formData)
            if (!result.success) {
                const firstIssue = result.error.issues[0]
                setErrors({
                    [firstIssue.path[0] as string]: firstIssue.message,
                })
                return
            }

            onSave(formData)
        } else if (JSON.stringify(deliverable) !== JSON.stringify(formData)) {
            const result = updateDeliverableSchema.safeParse(formData)
            if (!result.success) {
                const firstIssue = result.error.issues[0]
                setErrors({
                    [firstIssue.path[0] as string]: firstIssue.message,
                })
                return
            }

            onSave(formData)
        }

        setFormData({
            id: "",
            name: "",
            description: "",
            startDate: "",
            endDate: "",
            subjectId: "",
            subjectName: "",
        } as unknown as Deliverable)
        setErrors({})
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg p-6 w-full max-w-xl">
                <h2 className="text-lg font-semibold mb-4">{deliverable ? "Editar entregável" : "Novo entregável"}</h2>

                <div className="space-y-3">
                    {isEditMode && (
                        <p className="mt-4 text-sm text-gray-600 leading-snug border-l-2 border-green-400 pl-2">
                            As entregas realizadas pelos grupos podem ser consultadas acessando o grupo correspondente
                            na página do projeto.
                        </p>
                    )}

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Nome</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="mt-1 p-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.name && (
                            <div className="flex items-center space-x-1 mt-1 text-red-500 text-sm">
                                <ExclamationCircleIcon className="h-4 w-4" />
                                <span>{errors.name}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Descrição</label>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="mt-1 p-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.description && (
                            <div className="flex items-center space-x-1 mt-1 text-red-500 text-sm">
                                <ExclamationCircleIcon className="h-4 w-4" />
                                <span>{errors.description}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Data inicial</label>
                        <input
                            type="datetime-local"
                            value={formData.startDate || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    startDate: e.target.value,
                                })
                            }
                            className="mt-1 p-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.startDate && (
                            <div className="flex items-center space-x-1 mt-1 text-red-500 text-sm">
                                <ExclamationCircleIcon className="h-4 w-4" />
                                <span>{errors.startDate}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Data final</label>
                        <input
                            type="datetime-local"
                            value={formData.endDate || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    endDate: e.target.value,
                                })
                            }
                            className="mt-1 p-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.endDate && (
                            <div className="flex items-center space-x-1 mt-1 text-red-500 text-sm">
                                <ExclamationCircleIcon className="h-4 w-4" />
                                <span>{errors.endDate}</span>
                            </div>
                        )}
                    </div>

                    {!isEditMode && (
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">Disciplina (opcional)</label>

                            <div
                                className="flex items-center justify-between gap-1 p-2 border rounded-md bg-white shadow-sm cursor-pointer hover:ring-1 hover:ring-blue-400 transition-all"
                                onClick={() => setShowSelect(!showSelect)}
                            >
                                <div className="flex flex-wrap gap-1">
                                    {formData.subjectName ? (
                                        <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                            {formData.subjectName}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setFormData({
                                                        ...formData,
                                                        subjectId: "",
                                                        subjectName: "",
                                                    })
                                                }}
                                                className="ml-1 text-red-500 hover:text-red-700 text-xs"
                                            >
                                                x
                                            </button>
                                        </span>
                                    ) : (
                                        <span className="text-gray-400 text-sm">Selecione uma disciplina...</span>
                                    )}
                                </div>

                                {showSelect ? (
                                    <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                                ) : (
                                    <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                                )}
                            </div>

                            {errors.subjectId && (
                                <div className="flex items-center space-x-1 mt-1 text-red-500 text-sm">
                                    <ExclamationCircleIcon className="h-4 w-4" />
                                    <span>{errors.subjectId}</span>
                                </div>
                            )}

                            {showSelect && (
                                <div className="mt-1 border rounded shadow-lg p-2 max-h-60 overflow-y-auto bg-white z-10">
                                    <input
                                        type="text"
                                        placeholder="Digite para buscar..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full p-1 mb-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                    />

                                    <div className="flex flex-col gap-1">
                                        {allSubjects.length === 0 ? (
                                            <span className="text-sm text-gray-500 italic px-1">
                                                Nenhuma disciplina encontrada
                                            </span>
                                        ) : (
                                            allSubjects
                                                .filter((s) => s.label.toLowerCase().includes(search.toLowerCase()))
                                                .map((s) => (
                                                    <label
                                                        key={s.value}
                                                        className="flex items-center gap-2 text-sm hover:bg-gray-100 p-1 rounded cursor-pointer"
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="subject"
                                                            checked={formData.subjectId === s.value}
                                                            onChange={() => {
                                                                setFormData({
                                                                    ...formData,
                                                                    subjectId: s.value,
                                                                    subjectName: s.label,
                                                                })
                                                                setShowSelect(false)
                                                            }}
                                                            className="w-4 h-4"
                                                        />
                                                        {s.label}
                                                    </label>
                                                ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
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
