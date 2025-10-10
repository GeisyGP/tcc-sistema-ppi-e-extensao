import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class UpdateByIdParamReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string
}

export class UpdateByIdBodyReqDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    name: string
}
