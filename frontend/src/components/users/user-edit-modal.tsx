"use client"

import { Button } from "@/components/buttons/default.button"
import { ChangeRoleReq, UpdateUserReq, UserRole, UserWithCoursesRes } from "@/types/user.type"
import { useState, useEffect } from "react"
import { UserField } from "./user-field"
import { RoleGuard } from "../role-guard"

type UserEditModalProps = {
    isOpen: boolean
    onClose: () => void
    user: UserWithCoursesRes
    onChangeRole: (userId: string, updateReq: ChangeRoleReq[]) => void
    onUpdate: (userId: string, updateReq: UpdateUserReq) => void
}

export function UserEditModal({ isOpen, onClose, user, onChangeRole, onUpdate }: UserEditModalProps) {
    const [links, setLinks] = useState<ChangeRoleReq[]>([])
    const [formData, setFormData] = useState<UpdateUserReq>({
        name: user.name,
        registration: user.registration,
    })

    useEffect(() => {
        if (user?.userCourse) {
            setLinks(
                user.userCourse.map((c) => ({
                    courseId: c.courseId,
                    userRole: c.role as UserRole,
                })),
            )
        }
    }, [user])

    if (!isOpen) return null

    const handleToggle = (courseId: string) => {
        setLinks((prev) =>
            prev.map((c) =>
                c.courseId === courseId
                    ? {
                          ...c,
                          userRole: c.userRole === UserRole.COORDINATOR ? UserRole.TEACHER : UserRole.COORDINATOR,
                      }
                    : c,
            ),
        )
    }

    const handleSave = () => {
        const hasUserChanges = formData.name !== user.name || formData.registration !== user.registration

        const changedRoles: ChangeRoleReq[] = links.filter((link) => {
            const original = user.userCourse.find((c) => c.courseId === link.courseId)
            return original?.role !== link.userRole
        })

        if (hasUserChanges) {
            onUpdate?.(user.id, formData)
        }

        if (changedRoles.length > 0) {
            onChangeRole?.(user.id, changedRoles)
        }

        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-xl max-h-[80vh] overflow-y-auto">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Editar usuário</h2>

                <div className="space-y-4 mb-6">
                    <UserField
                        label="Nome"
                        value={formData.name}
                        onChange={(newValue) => setFormData((prev) => ({ ...prev, name: newValue }))}
                    />

                    <UserField
                        label="Matrícula/SIAPE"
                        value={formData.registration}
                        onChange={(newValue) => setFormData((prev) => ({ ...prev, registration: newValue }))}
                    />
                </div>

                <RoleGuard roles={[UserRole.SYSADMIN]}>
                    <h3 className="text-md font-semibold mb-2">Cursos</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Ative o toggle para tornar o usuário coordenador no curso correspondente
                    </p>
                    <div className="grid grid-cols-1 gap-2 mb-4">
                        {user.userCourse?.map((course) => {
                            const current = links.find((c) => c.courseId === course.courseId)
                            const isCoordinator = current?.userRole === UserRole.COORDINATOR

                            return (
                                <div
                                    key={course.courseId}
                                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg shadow-sm hover:shadow transition"
                                >
                                    <span className="text-gray-700 font-medium text-sm">{course.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleToggle(course.courseId)}
                                        className={`relative inline-flex h-5 w-10 items-center rounded-full transition ${
                                            isCoordinator ? "bg-green-500" : "bg-gray-300"
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                                isCoordinator ? "translate-x-5" : "translate-x-1"
                                            }`}
                                        />
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                </RoleGuard>

                <div className="flex justify-end gap-3">
                    <Button variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Salvar
                    </Button>
                </div>
            </div>
        </div>
    )
}
