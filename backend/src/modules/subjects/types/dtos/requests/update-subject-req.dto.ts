import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsNotEmpty, IsString } from "class-validator"

export class UpdateSubjectReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
    teachers: Array<string>
}

export class UpdateSubjectParamsReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string
}
