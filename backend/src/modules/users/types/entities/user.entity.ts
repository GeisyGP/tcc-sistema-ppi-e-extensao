import { User } from "@prisma/client"
import { UserRole } from "src/common/enums/user-role.enum"

export class UserEntity implements User {
    name: string
    id: string
    registration: string
    role: UserRole
    password: string
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    courseId: string[]
}
