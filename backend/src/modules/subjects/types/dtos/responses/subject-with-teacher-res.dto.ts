import { ApiProperty } from "@nestjs/swagger"
import { randomUUID } from "crypto"

export class SubjectWithTeacherResDto {
    @ApiProperty({ type: randomUUID })
    id: string

    @ApiProperty()
    name: string

    @ApiProperty()
    teachers: TeacherResDto[]

    @ApiProperty()
    createdAt: Date

    @ApiProperty()
    updatedAt: Date
}

class TeacherResDto {
    @ApiProperty({ type: randomUUID })
    id: string

    @ApiProperty()
    name: string
}
