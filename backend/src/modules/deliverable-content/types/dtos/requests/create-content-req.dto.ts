import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, MaxLength } from "class-validator"

export class CreateContentReqDto {
    @ApiProperty()
    @IsString()
    @MaxLength(1500)
    @IsNotEmpty()
    content: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    groupId: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    deliverableId: string
}
