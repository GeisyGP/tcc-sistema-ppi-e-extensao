import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty, IsString } from "class-validator"
import { UserRole } from "src/common/enums/user-role.enum"

export class ChangeRoleParamReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    userId: string
}

enum ValidUserRoles {
    COORDINATOR = "COORDINATOR",
    TEACHER = "TEACHER",
}

export class ChangeRoleBodyReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    courseId: string

    @ApiProperty({ enum: ValidUserRoles })
    @IsEnum(ValidUserRoles)
    @IsNotEmpty()
    userRole: UserRole
}
