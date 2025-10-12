import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class CreateProjectReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    class: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    executionPeriod: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    theme: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    campusDirector: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    academicDirector: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    ppiId: string
}
