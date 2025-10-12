import { ApiProperty } from "@nestjs/swagger"
import { randomUUID } from "crypto"

export class GroupResDto {
    @ApiProperty({ type: randomUUID })
    id: string

    @ApiProperty()
    name: string

    @ApiProperty()
    projectId: string

    @ApiProperty()
    users: UserGroupResDto[]

    @ApiProperty()
    createdAt: Date

    @ApiProperty()
    updatedAt: Date
}

class UserGroupResDto {
    @ApiProperty({ type: randomUUID })
    id: string

    @ApiProperty()
    name: string

    @ApiProperty()
    registration: string
}
