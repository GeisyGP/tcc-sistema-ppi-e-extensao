import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, MinLength } from "class-validator"

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

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    currentPassword: string
}
