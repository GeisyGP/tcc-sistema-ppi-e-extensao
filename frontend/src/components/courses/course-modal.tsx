"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/buttons/default.button"
import { CourseRes } from "@/types/course.type"
import { createCourseSchema } from "@/validations/course.schema"
import { ExclamationCircleIcon } from "@heroicons/react/24/outline"

type CourseModalProps = {
    isOpen: boolean
    course: CourseRes | null
    onClose: () => void
    onSave: (updated: CourseRes) => void
}

export function CourseModal({ isOpen, course, onClose, onSave }: CourseModalProps) {
    const [formData, setFormData] = useState<CourseRes | null>(null)
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (course) {
            setFormData(course)
        } else {
            setFormData({
                id: "",
                name: "",
                technologicalAxis: "",
                educationLevel: "",
                degree: "",
                modality: "",
                shift: "",
            } as unknown as CourseRes)
        }
    }, [course])

    if (!isOpen || !formData) return null

    const handleSubmit = () => {
        const result = createCourseSchema.safeParse(formData)

        if (!result.success) {
            const firstIssue = result.error.issues[0]
            setErrors({
                [firstIssue.path[0] as string]: firstIssue.message,
            })
            return
        }

        setErrors({})
        onSave(formData)
        setFormData({
            id: "",
            name: "",
            technologicalAxis: "",
            educationLevel: "",
            degree: "",
            modality: "",
            shift: "",
        } as unknown as CourseRes)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg p-6 w-full max-w-xl">
                <h2 className="text-lg font-semibold mb-4">{course ? "Editar curso" : "Novo curso"}</h2>

                <div className="space-y-3">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Nome do curso</label>
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
                        <label className="text-sm font-medium text-gray-700">Eixo Tecnológico</label>
                        <input
                            type="text"
                            value={formData.technologicalAxis}
                            onChange={(e) => setFormData({ ...formData, technologicalAxis: e.target.value })}
                            className="mt-1 p-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.technologicalAxis && (
                            <div className="flex items-center space-x-1 mt-1 text-red-500 text-sm">
                                <ExclamationCircleIcon className="h-4 w-4" />
                                <span>{errors.technologicalAxis}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Forma</label>
                        <input
                            type="text"
                            value={formData.educationLevel}
                            onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                            className="mt-1 p-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.educationLevel && (
                            <div className="flex items-center space-x-1 mt-1 text-red-500 text-sm">
                                <ExclamationCircleIcon className="h-4 w-4" />
                                <span>{errors.educationLevel}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Grau</label>
                        <input
                            type="text"
                            value={formData.degree}
                            onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                            className="mt-1 p-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.degree && (
                            <div className="flex items-center space-x-1 mt-1 text-red-500 text-sm">
                                <ExclamationCircleIcon className="h-4 w-4" />
                                <span>{errors.degree}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Modalidade</label>
                        <input
                            type="text"
                            value={formData.modality}
                            onChange={(e) => setFormData({ ...formData, modality: e.target.value })}
                            className="mt-1 p-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.modality && (
                            <div className="flex items-center space-x-1 mt-1 text-red-500 text-sm">
                                <ExclamationCircleIcon className="h-4 w-4" />
                                <span>{errors.modality}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Turno</label>
                        <input
                            type="text"
                            value={formData.shift}
                            onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                            className="mt-1 p-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.shift && (
                            <div className="flex items-center space-x-1 mt-1 text-red-500 text-sm">
                                <ExclamationCircleIcon className="h-4 w-4" />
                                <span>{errors.shift}</span>
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
