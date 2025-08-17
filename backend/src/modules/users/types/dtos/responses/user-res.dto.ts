import { ApiProperty } from "@nestjs/swagger"
import { randomUUID } from "crypto"
import { UserRole } from "src/common/enums/user-role.enum"

export class UserResDto {
    @ApiProperty({ type: randomUUID })
    id: string

    @ApiProperty()
    registration: string

    @ApiProperty()
    name: string

    @ApiProperty({ enum: UserRole })
    role: UserRole

    @ApiProperty()
    createdAt: Date

    @ApiProperty()
    updatedAt: Date
}
