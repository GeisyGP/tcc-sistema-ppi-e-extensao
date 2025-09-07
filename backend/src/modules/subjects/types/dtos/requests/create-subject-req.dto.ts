import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsNotEmpty, IsString } from "class-validator"

export class CreateSubjectReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
    teachers: Array<string>

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    courseId: string
}
