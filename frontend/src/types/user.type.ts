export interface UserRes {
    id: string
    registration: string
    name: string
    role: UserRole
    createdAt: Date
    updatedAt: Date
}

export const UserRole = {
    COORDINATOR: "COORDINATOR",
    TEACHER: "TEACHER",
    STUDENT: "STUDENT",
    SYSADMIN: "SYSADMIN",
    VIEWER: "VIEWER",
} as const
export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export interface GetAllUsersReq {
    name?: string
    role?: UserRole
    page?: number
    limit?: number
}

