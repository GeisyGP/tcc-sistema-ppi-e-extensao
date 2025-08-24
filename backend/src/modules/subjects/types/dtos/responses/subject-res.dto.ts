import { ApiProperty } from "@nestjs/swagger"
import { randomUUID } from "crypto"

export class SubjectResDto {
    @ApiProperty({ type: randomUUID })
    id: string

    @ApiProperty()
    name: string

    @ApiProperty()
    createdAt: Date

    @ApiProperty()
    updatedAt: Date
}
