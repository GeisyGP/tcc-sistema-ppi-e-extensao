import { User } from "@prisma/client"
import { UserRole } from "src/common/enums/user-role.enum"

export class UserEntity implements User {
    id: string
    name: string
    email: string
    registration: string
    role: UserRole
    changePasswordIsRequired: boolean
    password: string
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    courseId: string[]
}
