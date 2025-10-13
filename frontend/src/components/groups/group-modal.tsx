"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/buttons/default.button"
import { getAllUsers } from "@/services/users.service"
import { ChevronDownIcon, ChevronUpIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline"
import { createGroupSchema } from "@/validations/group.schema"
import { GroupRes, GroupCreateInput } from "@/types/group.type"

export type StudentOption = {
    label: string
    value: string
}

type GroupModalProps = {
    isOpen: boolean
    group: GroupRes | null
    projectId: string
    onClose: () => void
    onSave: (data: GroupCreateInput) => void
}

export function GroupModal({ isOpen, group, projectId, onClose, onSave }: GroupModalProps) {
    const [formData, setFormData] = useState<GroupCreateInput>({
        name: "",
        userIds: [],
        projectId,
    })
    const [allStudents, setAllStudents] = useState<StudentOption[]>([])
    const [studentLoaded, setStudentLoaded] = useState(false)
    const [showStudentSelect, setShowStudentSelect] = useState(false)
    const [search, setSearch] = useState("")
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (group) {
            setFormData({
                name: group.name,
                projectId: group.projectId,
                userIds: group.users.map((u) => u.id),
            })
        } else {
            setFormData({ name: "", userIds: [], projectId })
        }
    }, [group, projectId])

    const fetchStudents = useCallback(async (query?: string) => {
        const data = await getAllUsers({ role: ["STUDENT"], name: query })
        setAllStudents(data?.items.map((u) => ({ label: `${u.name} (${u.registration})`, value: u.id })) || [])
    }, [])

    useEffect(() => {
        if (!isOpen || studentLoaded) return
        const timeout = setTimeout(() => {
            fetchStudents(search)
            setStudentLoaded(true)
        }, 800)
        return () => clearTimeout(timeout)
    }, [search, fetchStudents, isOpen, studentLoaded])

    if (!isOpen) return null

    const toggleStudent = (id: string) => {
        const exists = formData.userIds.includes(id)
        setFormData({
            ...formData,
            userIds: exists ? formData.userIds.filter((uid) => uid !== id) : [...formData.userIds, id],
        })
    }

    const handleSubmit = () => {
        const result = createGroupSchema.safeParse(formData)

        if (!result.success) {
            const firstIssue = result.error.issues[0]
            setErrors({ [firstIssue.path[0] as string]: firstIssue.message })
            return
        }

        onSave(formData)
        setFormData({ name: "", userIds: [], projectId })
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg p-6 w-full max-w-xl">
                <h2 className="text-lg font-semibold mb-4">{group ? "Editar grupo" : "Novo grupo"}</h2>

                <div className="space-y-3">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Nome do grupo</label>
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
                        <label className="text-sm font-medium text-gray-700 mb-1">Discentes</label>

                        <div
                            className="flex flex-wrap items-center justify-between gap-1 p-2 border rounded-md bg-white shadow-sm cursor-pointer hover:ring-1 hover:ring-blue-400 transition-all"
                            onClick={() => setShowStudentSelect(!showStudentSelect)}
                        >
                            <div className="flex flex-wrap gap-1">
                                {formData.userIds.map((id) => {
                                    const student = allStudents.find((s) => s.value === id)
                                    return (
                                        <span
                                            key={id}
                                            className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                                        >
                                            {student ? (
                                                <>
                                                    {student.label}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            toggleStudent(id)
                                                        }}
                                                        className="ml-1 text-red-500 hover:text-red-700 text-xs"
                                                    >
                                                        x
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="text-gray-500 italic">Carregando...</span>
                                            )}
                                        </span>
                                    )
                                })}
                            </div>

                            {showStudentSelect ? (
                                <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                            ) : (
                                <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                            )}
                        </div>

                        {errors.userIds && (
                            <div className="flex items-center space-x-1 mt-1 text-red-500 text-sm">
                                <ExclamationCircleIcon className="h-4 w-4" />
                                <span>{errors.userIds}</span>
                            </div>
                        )}

                        {showStudentSelect && (
                            <div className="mt-1 border rounded shadow-lg p-2 max-h-60 overflow-y-auto bg-white z-10">
                                <input
                                    type="text"
                                    placeholder="Digite para buscar..."
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value)
                                        setStudentLoaded(false)
                                    }}
                                    className="w-full p-1 mb-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                />

                                <div className="flex flex-col gap-1">
                                    {allStudents.length === 0 ? (
                                        <span className="text-sm text-gray-500 italic px-1">
                                            Nenhum discente encontrado
                                        </span>
                                    ) : (
                                        allStudents.map((u) => (
                                            <label
                                                key={u.value}
                                                className="flex items-center gap-2 text-sm hover:bg-gray-100 p-1 rounded cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.userIds.includes(u.value)}
                                                    onChange={() => toggleStudent(u.value)}
                                                    className="w-4 h-4"
                                                />
                                                {u.label}
                                            </label>
                                        ))
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
