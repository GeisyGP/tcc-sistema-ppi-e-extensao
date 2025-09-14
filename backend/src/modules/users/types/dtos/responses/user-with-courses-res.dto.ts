import { ApiProperty } from "@nestjs/swagger"
import { UserRole } from "src/common/enums/user-role.enum"
import { UserResDto } from "./user-res.dto"

export class UserWithCoursesResDto extends UserResDto {
    @ApiProperty()
    userCourse: Array<UserCourse>
}

export class UserCourse {
    @ApiProperty()
    courseId: string

    @ApiProperty()
    role: UserRole
}
