import { ApiProperty } from "@nestjs/swagger"
import { UserRole } from "src/common/enums/user-role.enum"

export class UserResDto {
    @ApiProperty({ format: "uuid" })
    id: string

    @ApiProperty()
    registration: string

    @ApiProperty()
    name: string

    @ApiProperty({ enum: UserRole })
    role: UserRole

    @ApiProperty()
    courseId: Array<string>

    @ApiProperty()
    createdAt: Date

    @ApiProperty()
    updatedAt: Date
}
