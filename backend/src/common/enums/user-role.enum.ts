export const UserRole = {
    COORDINATOR: "COORDINATOR",
    TEACHER: "TEACHER",
    STUDENT: "STUDENT",
    SYSADMIN: "SYSADMIN",
    VIEWER: "VIEWER",
} as const
export type UserRole = (typeof UserRole)[keyof typeof UserRole]
