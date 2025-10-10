"use client"

import { ExclamationCircleIcon } from "@heroicons/react/24/outline"
import { useState } from "react"
import { Button } from "@/components/buttons/default.button"
import { CreateUserReq, UserRole } from "@/types/user.type"
import { createUserSchema } from "@/validations/user.schema"
import { roleMap } from "@/app/(main)/usuarios/utils/format-user"

type ExtendedUserReq = CreateUserReq & {
    confirmPassword: string
}

type UserModalProps = {
    isOpen: boolean
    onClose: () => void
    onSave: (created: CreateUserReq, role: UserRole) => void
    role: UserRole
}

export function UserModal({ isOpen, onClose, onSave, role }: UserModalProps) {
    const [formData, setFormData] = useState<ExtendedUserReq>({
        name: "",
        registration: "",
        password: "",
        confirmPassword: "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

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
            password: formData.password,
        }

        setErrors({})
        onSave(userData, role)
        setFormData({
            name: "",
            registration: "",
            courseId: "",
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg p-6 w-full max-w-xl">
                <h2 className="text-lg font-semibold mb-4">Novo {roleMap[role]}</h2>

                <div className="space-y-3">
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
