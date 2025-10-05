"use client"

import { useSession } from "next-auth/react"
import { ReactNode } from "react"

type RoleGuardProps = {
    children: ReactNode
    roles?: string[]
}

export function RoleGuard({ children, roles = [] }: RoleGuardProps) {
    const { data: session, status } = useSession()

    if (status !== "authenticated") return null

    const userRole = session?.user?.mainRole
    if (roles.length > 0 && !roles.includes(userRole || "no")) {
        return null
    }

    return <>{children}</>
}
