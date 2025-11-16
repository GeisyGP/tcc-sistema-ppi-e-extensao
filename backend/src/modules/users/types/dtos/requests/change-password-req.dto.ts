import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator"

export class ChangePasswordParamReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string
}

export class ChangePasswordBodyReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    newPassword: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    currentPassword: string
}
