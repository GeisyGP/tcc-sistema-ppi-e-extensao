import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator"

export class CreateUserReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    registration: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    courseId?: string
}

export class CreateUserCoordinatorReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    registration: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    courseId: string
}
