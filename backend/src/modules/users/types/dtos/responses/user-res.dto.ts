import { ApiProperty } from "@nestjs/swagger"

export class UserResDto {
    @ApiProperty({ format: "uuid" })
    id: string

    @ApiProperty()
    registration: string

    @ApiProperty()
    name: string

    @ApiProperty()
    createdAt: Date

    @ApiProperty()
    updatedAt: Date
}
