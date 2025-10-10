import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateProjectReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    class: string

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    currentYear: number

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    theme: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    ppiId: string
}
