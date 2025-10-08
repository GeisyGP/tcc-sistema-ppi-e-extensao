"use client"

import { UserIcon, KeyIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline"
import { useActionState } from "react"
import { useSearchParams } from "next/navigation"
import { authenticate } from "@/actions/authenticate"
import { Button } from "@/components/buttons/default.button"

export default function LoginForm() {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/home"
    const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined)

    return (
        <form action={formAction} className="w-full mx-auto p-6 space-y-6">
            <h1 className="mb-3 text-2xl">Login</h1>
            <div className="w-full">
                <div>
                    <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="matricula">
                        Matrícula/SIAPE
                    </label>
                    <div className="relative">
                        <input
                            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                            id="registration"
                            type="string"
                            name="registration"
                            placeholder="Matrícula"
                            required
                        />
                        <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                    </div>
                </div>
                <div className="mt-4">
                    <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="senha">
                        Senha
                    </label>
                    <div className="relative">
                        <input
                            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Senha"
                            required
                        />
                        <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                    </div>
                </div>
            </div>
            <input type="hidden" name="redirectTo" value={callbackUrl} />
            <Button variant="primary" className="mt-4 w-full bg-green-900 hover:bg-stone-800" aria-disabled={isPending}>
                Entrar
            </Button>
            <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
                {errorMessage && (
                    <>
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                        <p className="text-sm text-red-500">{errorMessage}</p>
                    </>
                )}
            </div>
        </form>
    )
}
