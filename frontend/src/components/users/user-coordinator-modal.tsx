"use client"

import { ExclamationCircleIcon } from "@heroicons/react/24/outline"
import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/buttons/default.button"
import { CreateUserReq, UserRole } from "@/types/user.type"
import { createUserSchema } from "@/validations/user.schema"
import { getAllCourses } from "@/services/courses.service"
import { roleMap } from "@/app/(main)/users/utils/format-user"
import { useModalBehavior } from "@/hooks/use-modal-baheavior"

type ExtendedUserReq = CreateUserReq & {
    confirmPassword: string
}

type UserModalProps = {
    isOpen: boolean
    onClose: () => void
    onSave: (created: CreateUserReq, role: UserRole) => void
}

export function UserCoordinatorModal({ isOpen, onClose, onSave }: UserModalProps) {
    const [courses, setCourses] = useState<{ label: string; value: string }[]>([])
    const [coursesLoaded, setCoursesLoaded] = useState(false)
    const [formData, setFormData] = useState<ExtendedUserReq>({
        name: "",
        registration: "",
        password: "",
        confirmPassword: "",
        courseId: "",
        email: "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const { handleBackdropClick } = useModalBehavior(isOpen, onClose)

    const fetchCourses = useCallback(async () => {
        const data = await getAllCourses({})
        setCourses(data?.items.map((c) => ({ label: `${c.name}`, value: c.id })) || [])
    }, [])

    useEffect(() => {
        if (!isOpen || coursesLoaded) return

        fetchCourses()
        setCoursesLoaded(true)
        return
    }, [coursesLoaded, fetchCourses, isOpen])

    if (!isOpen) return null

    const handleSubmit = () => {
        const result = createUserSchema.safeParse(formData)

        if (!result.success) {
            const firstIssue = result.error.issues[0]
            setErrors({
                [firstIssue.path[0] as string]: firstIssue.message,
            })
            return
        }

        const userData: Omit<ExtendedUserReq, "confirmPassword"> = {
            name: formData.name,
            registration: formData.registration,
            email: formData.email,
            password: formData.password,
            courseId: formData.courseId,
        }

        setErrors({})
        onSave(userData, UserRole.COORDINATOR)
        setFormData({
            name: "",
            registration: "",
            courseId: "",
            email: "",
            password: "",
            confirmPassword: "",
        })
        onClose()
    }

    const handleClose = () => {
        setFormData({
            ...formData,
            password: "",
            confirmPassword: "",
        })
        setErrors({})
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleBackdropClick}>
            <div className="max-h-[90vh] bg-white rounded-lg p-6 w-full max-w-xl overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4">Novo {roleMap[UserRole.COORDINATOR]}</h2>

                <div className="space-y-3">
                    <p className="mt-4 text-sm text-gray-600 leading-snug border-l-2 border-green-400 pl-2">
                        O usuário é identificado por sua matrícula. Ao realizar o cadastro, caso seja verificado que ele
                        já está vinculado a outro curso, ele será apenas associado ao novo curso, sem que suas
                        informações sejam alteradas.
                    </p>
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Nome do usuário</label>
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
                        <label className="text-sm font-medium text-gray-700">Matrícula/SIAPE</label>
                        <input
                            type="text"
                            value={formData.registration}
                            onChange={(e) => setFormData({ ...formData, registration: e.target.value })}
                            className="mt-1 p-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.registration && (
                            <div className="flex items-center space-x-1 mt-1 text-red-500 text-sm">
                                <ExclamationCircleIcon className="h-4 w-4" />
                                <span>{errors.registration}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">E-mail</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="mt-1 p-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.email && (
                            <div className="flex items-center space-x-1 mt-1 text-red-500 text-sm">
                                <ExclamationCircleIcon className="h-4 w-4" />
                                <span>{errors.email}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="courseId" className="text-sm font-medium text-gray-700 mb-1">
                            Curso
                        </label>
                        <select
                            id="courseId"
                            name="courseId"
                            value={formData.courseId}
                            onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                            className="bg-white text-gray-800 text-sm border border-gray-300 rounded-md px-2 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="" disabled>
                                Selecione o curso
                            </option>
                            {courses.map((c) => (
                                <option key={c.value} value={c.value} className="truncate">
                                    {c.label}
                                </option>
                            ))}
                        </select>

                        {errors.courseId && (
                            <div className="flex items-center space-x-1 mt-1 text-red-500 text-sm">
                                <ExclamationCircleIcon className="h-4 w-4" />
                                <span>{errors.courseId}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Senha</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="mt-1 p-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.password && (
                            <div className="flex items-center space-x-1 mt-1 text-red-500 text-sm">
                                <ExclamationCircleIcon className="h-4 w-4" />
                                <span>{errors.password}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Confirmar senha</label>
                        <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="mt-1 p-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.confirmPassword && (
                            <div className="flex items-center space-x-1 mt-1 text-red-500 text-sm">
                                <ExclamationCircleIcon className="h-4 w-4" />
                                <span>{errors.confirmPassword}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <Button variant="secondary" onClick={handleClose}>
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
