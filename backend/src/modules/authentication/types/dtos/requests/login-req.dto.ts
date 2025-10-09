import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class LoginReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    registration: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string
}
