import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class CreateCourseReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    technologicalAxis: string

    @ApiProperty({ example: "Superior" })
    @IsString()
    @IsNotEmpty()
    educationLevel: string

    @ApiProperty({ example: "Bacharelado" })
    @IsString()
    @IsNotEmpty()
    degree: string

    @ApiProperty({ example: "Presencial" })
    @IsString()
    @IsNotEmpty()
    modality: string

    @ApiProperty({ example: "Noturno" })
    @IsString()
    @IsNotEmpty()
    shift: string
}
