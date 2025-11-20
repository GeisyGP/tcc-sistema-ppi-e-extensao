"use client"

import toast from "react-hot-toast"
import { useCallback, useState } from "react"
import { ChangePasswordForm } from "@/components/users/change-password"
import { GENERIC_ERROR_MESSAGE } from "@/constants"
import { ApiError } from "@/exceptions/api-error.exception"
import { useRole } from "@/hooks/use-role"
import { changePassword } from "@/services/users.service"
import { ChangePasswordReq } from "@/types/user.type"
import { changePasswordSchema } from "@/validations/user.schema"
import { logout } from "@/actions/logout"

export default function ChangePasswordPage() {
    const { userId, sessionStatus } = useRole()
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    function handleSave() {
        const result = changePasswordSchema.safeParse(formData)

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

    const handleChangePassword = useCallback(async (input: ChangePasswordReq, userId: string) => {
        try {
            await changePassword(
                {
                    currentPassword: input.currentPassword,
                    newPassword: input.newPassword,
                },
                userId,
            )
            toast.success("Senha alterada com sucesso")
            await logout()
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : GENERIC_ERROR_MESSAGE
            toast.error(errorMessage)
        }
    }, [])

    if (sessionStatus == "unauthenticated") {
        window.location.reload()
    }

    return (
        <main className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-green-900 p-6 flex items-center justify-center">
                <h1 className="text-3xl font-bold text-white tracking-wide m-0">GESTÃO PPI</h1>
            </div>
            <div className="p-6 flex items-center justify-center">
                <ChangePasswordForm
                    formData={formData}
                    errors={errors}
                    onChange={(field, value) => setFormData({ ...formData, [field]: value })}
                    onSave={handleSave}
                    shouldShowCancel={false}
                    shouldShowCurrentPassword={true}
                />
            </div>
        </main>
    )
}
