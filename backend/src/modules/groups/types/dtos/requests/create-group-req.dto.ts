import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsNotEmpty, IsString } from "class-validator"

export class CreateGroupReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    projectId: string

    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
    userIds: string[]
}
