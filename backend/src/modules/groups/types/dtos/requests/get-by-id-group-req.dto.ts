import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class GetByIdGroupReqDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string
}
