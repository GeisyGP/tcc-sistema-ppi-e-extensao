import { UserRole } from "src/common/enums/user-role.enum"

export class RequestDto {
    user: UserRequestDto
}

export class UserRequestDto {
    sub: string
    role: UserRole
    name: string
}
