import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator"

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
    @ValidateNested()
    @IsNotEmpty()
    subjects: Array<SubjectPPIReq>
}

export class SubjectPPIReq {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    workload: number

    @ApiPropertyOptional()
    @IsBoolean()
    @IsNotEmpty()
    isCoordinator?: boolean
}
