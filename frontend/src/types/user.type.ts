export interface User {
    id: string
    registration: string
    name: string
    courses?: { name: string; role: string }[]
    createdAt: string
    updatedAt: string
}

export interface UserRes {
    id: string
    registration: string
    name: string
    createdAt: Date
    updatedAt: Date
}

export interface UserWithCoursesRes extends UserRes {
    userCourse: Array<UserCourse>
}

export interface UserCourse {
    courseId: string
    role: UserRole
    name: string
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
    role?: UserRole[]
    page?: number
    limit?: number
    courseId?: string
}

export interface CreateUserReq {
    registration: string
    name: string
    password: string
    courseId?: string
}

export interface ChangeRoleReq {
    courseId: string
    userRole: UserRole
}
