import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class UpdateProjectReqDto {
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
    topic: string
}

export class UpdateProjectParamsReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string
}
