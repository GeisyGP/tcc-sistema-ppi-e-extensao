import { InitialPage, MenuItens } from "@/types/initial-page.type"
import { UserRole } from "@/types/user.type"

export function mapInitialPage(userRole: UserRole | undefined): InitialPage {
    switch (userRole) {
        case UserRole.VIEWER:
            return {
                userInfo: true,
                menuItens: [MenuItens.PROJECTS],
                projects: false,
            }
        case UserRole.STUDENT:
            return {
                userInfo: true,
                menuItens: [MenuItens.PROJECTS],
                projects: true,
            }
        case UserRole.TEACHER:
            return {
                userInfo: true,
                menuItens: [
                    MenuItens.PROJECTS,
                    MenuItens.PPIS,
                    MenuItens.PROJECTS,
                    MenuItens.SUBJECTS,
                    MenuItens.USERS,
                ],
                projects: true,
            }
        case UserRole.COORDINATOR:
            return {
                userInfo: true,
                menuItens: [
                    MenuItens.PROJECTS,
                    MenuItens.PPIS,
                    MenuItens.PROJECTS,
                    MenuItens.SUBJECTS,
                    MenuItens.USERS,
                ],
                projects: true,
            }
        case UserRole.SYSADMIN:
            return {
                userInfo: true,
                menuItens: [MenuItens.COURSES, MenuItens.USERS],
                projects: false,
            }
        default:
            return {
                userInfo: true,
                menuItens: [],
                projects: false,
            }
    }
}
