import { ApiProperty } from "@nestjs/swagger"

export class UserResDto {
    @ApiProperty({ format: "uuid" })
    id: string

    @ApiProperty()
    registration: string

    @ApiProperty()
    name: string

    @ApiProperty()
    email: string

    @ApiProperty()
    changePasswordIsRequired: boolean

    @ApiProperty()
    createdAt: Date

    @ApiProperty()
    updatedAt: Date
}
