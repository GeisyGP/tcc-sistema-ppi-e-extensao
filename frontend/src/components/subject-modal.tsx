'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/buttons/default.button'
import { getAllUsers } from '@/services/users.service'
import { SubjectRes } from '@/types/subject.types'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'

export type TeacherOption = {
    label: string
    value: string
}

type EditSubjectModalProps = {
    isOpen: boolean
    subject: SubjectRes | null
    onClose: () => void
    onSave: (updated: SubjectRes) => void
}

export function SubjectModal({ isOpen, subject, onClose, onSave }: EditSubjectModalProps) {
    const [formData, setFormData] = useState<SubjectRes | null>(null)
    const [allTeachers, setAllTeachers] = useState<TeacherOption[]>([])
    const [showTeacherSelect, setShowTeacherSelect] = useState(false)
    const [search, setSearch] = useState('')

    useEffect(() => {
        if (subject) {
            setFormData({
                ...subject,
                teachers: subject.teachers.map(t => ({ id: t.id, name: t.name }))
            })
        } else {
            setFormData({
                id: "",
                name: "",
                teachers: [],
            } as unknown as SubjectRes)
        }
    }, [subject])

    const fetchTeachers = useCallback(async (query?: string) => {
        const data = await getAllUsers({ role: "TEACHER", name: query })
        setAllTeachers(
            data?.items.map(u => ({ label: `${u.name} (${u.registration})`, value: u.id })) || []
        )
    }, [])

    useEffect(() => {
        const timeout = setTimeout(async () => {
            fetchTeachers(search)
        }, 300)
        return () => clearTimeout(timeout)
    }, [fetchTeachers, search])

    if (!isOpen || !formData) return null

    const toggleTeacher = (id: string) => {
        if (!formData) return
        const arr = formData.teachers || []
        const exists = arr.find(t => t.id === id)

        if (exists) {
            setFormData({
                ...formData,
                teachers: arr.filter(t => t.id !== id)
            })
        } else {
            const teacherObj = allTeachers.find(t => t.value === id)
            if (teacherObj) {
                setFormData({
                    ...formData,
                    teachers: [...arr, { id: teacherObj.value, name: teacherObj.label }]
                })
            }
        }
    }

    const handleSubmit = () => {
        if (formData) {
            onSave({
                ...formData,
                teachers: [...formData.teachers]
            })
        }
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg p-6 w-full max-w-xl">
                <h2 className="text-lg font-semibold mb-4">
                    {subject ? "Editar disciplina" : "Nova disciplina"}
                </h2>

                <div className="space-y-3">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Nome da disciplina</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="mt-1 p-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">Docentes</label>

                        <div
                            className="flex flex-wrap items-center justify-between gap-1 p-2 border rounded-md bg-white shadow-sm cursor-pointer hover:ring-1 hover:ring-blue-400 transition-all"
                            onClick={() => {
                                const newValue = !showTeacherSelect
                                setShowTeacherSelect(newValue)
                                if (newValue && allTeachers.length === 0) {
                                    fetchTeachers()
                                }
                            }}
                        >
                            <div className="flex flex-wrap gap-1">
                                {formData.teachers.map(t => (
                                    <span
                                        key={t.id}
                                        className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                    >
                                        {t.name}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                toggleTeacher(t.id)
                                            }}
                                            className="ml-1 text-red-500 hover:text-red-700 text-xs"
                                        >
                                            x
                                        </button>
                                    </span>
                                ))}
                            </div>

                            {showTeacherSelect ? (
                                <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                            ) : (
                                <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                            )}
                        </div>

                        {showTeacherSelect && (
                            <div className="mt-1 border rounded shadow-lg p-2 max-h-60 overflow-y-auto bg-white z-10">
                                <input
                                    type="text"
                                    placeholder="Digite para buscar..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full p-1 mb-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                />

                                <div className="flex flex-col gap-1">
                                    {allTeachers.length === 0 ? (
                                        <span className="text-sm text-gray-500 italic px-1">
                                            Nenhum docente encontrado
                                        </span>
                                    ) : (
                                        allTeachers.map(t => (
                                            <label
                                                key={t.value}
                                                className="flex items-center gap-2 text-sm hover:bg-gray-100 p-1 rounded cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.teachers.some(tr => tr.id === t.value)}
                                                    onChange={() => toggleTeacher(t.value)}
                                                    className="w-4 h-4"
                                                />
                                                {t.label}
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
