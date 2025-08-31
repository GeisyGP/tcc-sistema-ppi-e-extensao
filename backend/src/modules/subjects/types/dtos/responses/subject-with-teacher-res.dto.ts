import { ApiProperty } from "@nestjs/swagger"
import { IsUUID } from "class-validator"

export class SubjectWithTeacherResDto {
    @ApiProperty({ format: "uuid" })
    @IsUUID()
    id: string

    @ApiProperty()
    name: string

    @ApiProperty({ type: () => TeacherResDto, isArray: true })
    teachers: TeacherResDto[]

    @ApiProperty()
    createdAt: Date

    @ApiProperty()
    updatedAt: Date
}

class TeacherResDto {
    @ApiProperty({ format: "uuid" })
    id: string

    @ApiProperty()
    name: string
}
