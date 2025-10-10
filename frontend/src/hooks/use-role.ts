"use client"
import { useSession } from "next-auth/react"
import { UserRole } from "@/types/user.type"

export function useRole() {
    const { data: session } = useSession()
    const userRole = session?.user?.mainRole as UserRole | undefined
    const userId = session?.user.id

    const can = (...roles: UserRole[]) => !!userRole && roles.includes(userRole)

    return { userRole, can, userId }
}
