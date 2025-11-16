import { ExclamationCircleIcon } from "@heroicons/react/24/outline"
import { Button } from "../buttons/default.button"
import { ChangePasswordValidationReq } from "@/types/user.type"
import { UserField } from "./user-field"

export type ChangePasswordFormProps = {
    formData: ChangePasswordValidationReq
    errors: any
    onChange: (field: string, value: string) => void
    onSave: () => void
    onCancel?: () => void
    shouldShowCurrentPassword: boolean
    shouldShowCancel: boolean
    userName?: string
}

export function ChangePasswordForm({
    formData,
    errors,
    onChange,
    onSave,
    onCancel,
    shouldShowCurrentPassword,
    shouldShowCancel,
    userName,
}: ChangePasswordFormProps) {
    return (
        <div className="bg-white rounded-lg p-6 w-full max-w-xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Alterar Senha</h2>

            <div className="space-y-4 mb-6">
                {userName && <UserField label="Nome" value={userName} readOnly />}
                {shouldShowCurrentPassword && (
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">Senha atual</label>
                        <input
                            type="password"
                            value={formData.currentPassword}
                            onChange={(e) => onChange("currentPassword", e.target.value)}
                            className="mt-1 p-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {errors.currentPassword && (
                            <div className="flex items-center space-x-1 mt-1 text-red-500 text-sm">
                                <ExclamationCircleIcon className="h-4 w-4" />
                                <span>{errors.currentPassword}</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Nova senha</label>
                    <input
                        type="password"
                        value={formData.newPassword}
                        onChange={(e) => onChange("newPassword", e.target.value)}
                        className="mt-1 p-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {errors.newPassword && (
                        <div className="flex items-center space-x-1 mt-1 text-red-500 text-sm">
                            <ExclamationCircleIcon className="h-4 w-4" />
                            <span>{errors.newPassword}</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Confirmar senha</label>
                    <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => onChange("confirmPassword", e.target.value)}
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

            <div className="flex justify-end gap-3">
                {shouldShowCancel && (
                    <Button variant="secondary" onClick={onCancel}>
                        Cancelar
                    </Button>
                )}
                <Button variant="primary" onClick={onSave}>
                    Salvar
                </Button>
            </div>
        </div>
    )
}
