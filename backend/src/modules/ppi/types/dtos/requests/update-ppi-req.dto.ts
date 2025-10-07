import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class UpdatePPIReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    classPeriod: string

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    workload: number
}

export class UpdatePPIParamsReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string
}
