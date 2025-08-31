export const UserRole = {
    COORDINATOR: "COORDINATOR",
    TEACHER: "TEACHER",
    STUDENT: "STUDENT",
    SYSADMIN: "SYSADMIN",
} as const
export type UserRole = (typeof UserRole)[keyof typeof UserRole]
