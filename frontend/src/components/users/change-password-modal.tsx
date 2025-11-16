"use client"

import { useCallback, useState } from "react"
import { ChangePasswordReq } from "@/types/user.type"
import { ChangePasswordForm } from "./change-password"
import { changePassword } from "@/services/users.service"
import toast from "react-hot-toast"
import { ApiError } from "@/exceptions/api-error.exception"
import { changePasswordSchema } from "@/validations/user.schema"
import { GENERIC_ERROR_MESSAGE } from "@/constants"
import { useModalBehavior } from "@/hooks/use-modal-baheavior"

type ChangePasswordModalProps = {
    open: boolean
    onClose: () => void
    userId: string
    shouldShowCurrentPassword?: boolean
    userName?: string
}

export function ChangePasswordModal({
    open,
    onClose,
    userId,
    shouldShowCurrentPassword = true,
    userName,
}: ChangePasswordModalProps) {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const { handleBackdropClick } = useModalBehavior(open, onClose)

    function handleSave() {
        const dataToValidate = {
            ...formData,
            currentPassword: shouldShowCurrentPassword ? formData.currentPassword : "pass",
        }
        const result = changePasswordSchema.safeParse(dataToValidate)

        if (!result.success) {
            const firstIssue = result.error.issues[0]
            setErrors({
                [firstIssue.path[0] as string]: firstIssue.message,
            })
            return
        }

        const userData = {
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
        }

        setErrors({})
        handleChangePassword(userData, userId as string)
    }

    const handleChangePassword = useCallback(
        async (input: ChangePasswordReq, userId: string) => {
            try {
                await changePassword(
                    {
                        currentPassword: input.currentPassword,
                        newPassword: input.newPassword,
                    },
                    userId,
                )
                toast.success("Senha alterada com sucesso")
                onClose()
            } catch (error: any) {
                const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
                toast.error(errorMessage)
            }
        },
        [onClose],
    )

    if (!open) return null

    return (
        <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={handleBackdropClick}
        >
            <div className="max-h-[80vh] w-full max-w-xl overflow-y-auto">
                <ChangePasswordForm
                    formData={formData}
                    errors={errors}
                    onChange={(field, value) => setFormData({ ...formData, [field]: value })}
                    onSave={handleSave}
                    onCancel={onClose}
                    shouldShowCancel={true}
                    shouldShowCurrentPassword={shouldShowCurrentPassword}
                    userName={userName}
                />
            </div>
        </div>
    )
}
