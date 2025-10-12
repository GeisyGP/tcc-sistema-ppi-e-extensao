import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class UpdateProjectReqDto {
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
}

export class UpdateProjectParamsReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string
}
