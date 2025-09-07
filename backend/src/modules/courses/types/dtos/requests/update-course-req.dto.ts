import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class UpdateCourseReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    technologicalAxis: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    educationLevel: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    degree: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    modality: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    shift: string
}

export class UpdateCourseParamsReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string
}
