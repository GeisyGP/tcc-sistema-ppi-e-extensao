export const UserRole = {
    SYSADMIN: "SYSADMIN",
    COORDINATOR: "COORDINATOR",
    TEACHER: "TEACHER",
    STUDENT: "STUDENT",
} as const
export type UserRole = (typeof UserRole)[keyof typeof UserRole]
