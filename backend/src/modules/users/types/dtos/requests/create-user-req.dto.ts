import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator"
import { UserRole } from "src/common/enums/user-role.enum"

export class CreateUserReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    registration: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty({ enum: UserRole })
    @IsEnum(UserRole)
    @IsNotEmpty()
    role: UserRole

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string
}
