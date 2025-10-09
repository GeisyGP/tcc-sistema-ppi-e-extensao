import { UserRole } from "src/common/enums/user-role.enum"

export class RequestDto {
    user: UserRequestDto
}

export class UserRequestDto {
    sub: string
    name: string
    courses: Array<{ courseId: string; role: string }>
    mainRole: UserRole
    mainCourseId: string
}
