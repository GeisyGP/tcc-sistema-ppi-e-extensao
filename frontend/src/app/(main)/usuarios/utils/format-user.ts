import { User, UserRes, UserRole, UserWithCoursesRes } from "@/types/user.type"

export function formatUser(res: UserRes): User {
    return {
        id: res.id,
        name: res.name,
        registration: res.registration,
        email: res.email,
        createdAt: new Date(res.createdAt).toLocaleDateString(),
        updatedAt: new Date(res.updatedAt).toLocaleDateString(),
    }
}

export function formatUserWithCourses(res: UserWithCoursesRes): User {
    return {
        id: res.id,
        name: res.name,
        registration: res.registration,
        email: res.email,
        courses: res.userCourse?.length
            ? res.userCourse.map((uc) => ({
                  name: uc.name,
                  role: roleMap[uc.role] || uc.role,
              }))
            : [],
        createdAt: new Date(res.createdAt).toLocaleDateString(),
        updatedAt: new Date(res.updatedAt).toLocaleDateString(),
    }
}

export const roleMap: Record<UserRole, string> = {
    COORDINATOR: "Coordenador",
    TEACHER: "Docente",
    STUDENT: "Discente",
    SYSADMIN: "Administrador do sistema",
    VIEWER: "Consultor",
}
