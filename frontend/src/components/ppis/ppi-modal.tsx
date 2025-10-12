"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/buttons/default.button"
import { ChevronDownIcon, ChevronUpIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline"
import { PPIRes } from "@/types/ppi.type"
import { createPPISchema } from "@/validations/ppi.schema"
import { getAllSubjects } from "@/services/subjects.service"

type PPIModalProps = {
    isOpen: boolean
    PPI: PPIRes | null
    onClose: () => void
    onSave: (updated: PPIRes, changedFields?: Partial<PPIRes>) => void
}

type SubjectOption = {
    value: string
    label: string
}

export function PPIModal({ isOpen, PPI, onClose, onSave }: PPIModalProps) {
    const isEditMode = !!PPI
    const [formData, setFormData] = useState<PPIRes | null>(null)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [showSelect, setShowSelect] = useState(false)
    const [search, setSearch] = useState("")
    const [allSubjects, setAllSubjects] = useState<SubjectOption[]>([])
    const [subjectsLoaded, setSubjectsLoaded] = useState(false)

    useEffect(() => {
        if (PPI) {
            setFormData(PPI)
        } else {
            setFormData({
                id: "",
                classPeriod: "",
                workload: 0,
                subjects: [],
            } as unknown as PPIRes)
        }
    }, [PPI])

    const fetchSubjects = useCallback(async (query?: string) => {
        const data = await getAllSubjects({ name: query })
        setAllSubjects(data?.items.map((u) => ({ label: u.name, value: u.id })) || [])
    }, [])

    useEffect(() => {
        if (!isOpen || subjectsLoaded) return

        const timeout = setTimeout(() => {
            fetchSubjects(search)
            setSubjectsLoaded(true)
        }, 800)
        return () => clearTimeout(timeout)
    }, [search, fetchSubjects, subjectsLoaded, isOpen])

    if (!isOpen || !formData) return null

    const toggleSubject = (id: string, name?: string) => {
        const exists = formData.subjects.some((s) => s.id === id)
        if (exists) {
            setFormData({
                ...formData,
                subjects: formData.subjects.filter((s) => s.id !== id),
            })
        } else {
            setFormData({
                ...formData,
                subjects: [...formData.subjects, { id, name, workload: 0, isCoordinator: false }],
            })
        }
    }

    const updateWorkload = (id: string, newWorkload: number) => {
        setFormData({
            ...formData,
            subjects: formData.subjects.map((s) => (s.id === id ? { ...s, workload: newWorkload } : s)),
        })
    }

    const handleCoordinatorSelect = (id: string) => {
        setFormData({
            ...formData,
            subjects: formData.subjects.map((s) => ({
                ...s,
                isCoordinator: s.id === id,
            })),
        })
    }

    const handleSubmit = () => {
        const result = createPPISchema.safeParse(formData)

        if (!result.success) {
            const firstIssue = result.error.issues[0]
            setErrors({
                [firstIssue.path[0] as string]: firstIssue.message,
            })
            return
        }

        setErrors({})
        if (isEditMode) {
            const changed: Partial<PPIRes> = {}
            if (PPI?.workload !== formData.workload || PPI?.classPeriod !== formData.classPeriod) {
                changed.workload = formData.workload
                changed.classPeriod = formData.classPeriod
            }

            if (JSON.stringify(PPI?.subjects) !== JSON.stringify(formData.subjects)) {
                changed.subjects = formData.subjects
            }

            onSave(formData, changed)
        } else {
            onSave(formData)
        }
        setFormData({
            id: "",
            classPeriod: "",
            workload: "",
            subjects: [],
        } as unknown as PPIRes)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg p-6 w-full max-w-xl">
                <h2 className="text-lg font-semibold mb-4">{PPI ? "Editar PPI" : "Nova PPI"}</h2>

                <div className="space-y-3">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Ano/Semestre da turma</label>
                        <input
                            type="text"
                            value={formData.classPeriod}
                            onChange={(e) => setFormData({ ...formData, classPeriod: e.target.value })}
                            className="mt-1 p-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.classPeriod && (
                            <div className="flex items-center space-x-1 mt-1 text-red-500 text-sm">
                                <ExclamationCircleIcon className="h-4 w-4" />
                                <span>{errors.classPeriod}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Carga Horária</label>
                        <input
                            type="number"
                            value={formData.workload}
                            onChange={(e) => setFormData({ ...formData, workload: Number(e.target.value) })}
                            className="mt-1 p-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.workload && (
                            <div className="flex items-center space-x-1 mt-1 text-red-500 text-sm">
                                <ExclamationCircleIcon className="h-4 w-4" />
                                <span>{errors.workload}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">Disciplinas</label>

                        <div
                            className="flex flex-wrap items-center justify-between gap-1 p-2 border rounded-md bg-white shadow-sm cursor-pointer hover:ring-1 hover:ring-blue-400 transition-all"
                            onClick={() => setShowSelect(!showSelect)}
                        >
                            <div className="flex flex-wrap gap-1">
                                {formData.subjects.map((s) => (
                                    <span
                                        key={s.id}
                                        className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                                    >
                                        {s.name} ({s.workload}h{s.isCoordinator ? ", Coord." : ""})
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                toggleSubject(s.id, s?.name)
                                            }}
                                            className="ml-1 text-red-500 hover:text-red-700 text-xs"
                                        >
                                            x
                                        </button>
                                    </span>
                                ))}
                            </div>

                            {showSelect ? (
                                <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                            ) : (
                                <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                            )}
                        </div>

                        {errors.subjects && (
                            <div className="flex items-center space-x-1 mt-1 text-red-500 text-sm">
                                <ExclamationCircleIcon className="h-4 w-4" />
                                <span>{errors.subjects}</span>
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
                                            .map((s) => {
                                                const selected = formData.subjects.find((v) => v.id === s.value)
                                                return (
                                                    <div
                                                        key={s.value}
                                                        className="flex items-center justify-between text-sm hover:bg-gray-100 p-1 rounded"
                                                    >
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={!!selected}
                                                                onChange={() => toggleSubject(s.value, s.label)}
                                                                className="w-4 h-4"
                                                            />
                                                            {s.label}
                                                        </label>

                                                        {selected && (
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex items-center gap-1">
                                                                    <span className="text-xs text-gray-500">
                                                                        Carga horária:
                                                                    </span>
                                                                    <input
                                                                        type="number"
                                                                        min={1}
                                                                        placeholder="h"
                                                                        value={selected.workload}
                                                                        onChange={(e) =>
                                                                            updateWorkload(
                                                                                s.value,
                                                                                Number(e.target.value),
                                                                            )
                                                                        }
                                                                        onClick={(e) => e.stopPropagation()}
                                                                        className="w-16 border rounded px-1 py-0.5 text-sm text-center focus:outline-none focus:ring-1 focus:ring-blue-400"
                                                                    />
                                                                </div>

                                                                <label className="flex items-center gap-1 text-xs text-gray-600">
                                                                    <input
                                                                        type="radio"
                                                                        name="coordinator"
                                                                        checked={selected.isCoordinator}
                                                                        onChange={() =>
                                                                            handleCoordinatorSelect(s.value)
                                                                        }
                                                                        className="w-4 h-4 text-blue-500"
                                                                    />
                                                                    Coordenadora
                                                                </label>
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            })
                                    )}
                                </div>
                            </div>
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
