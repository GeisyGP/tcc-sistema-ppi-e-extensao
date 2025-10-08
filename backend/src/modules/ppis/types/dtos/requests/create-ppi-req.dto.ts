import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreatePPIReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    classPeriod: string

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    workload: number

    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
    subjects: Array<SubjectPPIReq>
}

export class SubjectPPIReq {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    workload: number
}
